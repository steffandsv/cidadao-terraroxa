import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from app import auth, repository

bp = Blueprint('main', __name__)

@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        phone = request.form['phone']
        error = None

        if not phone:
            error = 'Telefone é obrigatório.'

        if error is None:
            otp = auth.generate_otp()
            auth.store_otp(phone, otp)
            auth.send_otp(phone, otp)
            return redirect(url_for('main.otp_verify', phone=phone))

        flash(error)

    return render_template('login.html')

@bp.route('/otp', methods=('GET', 'POST'))
def otp_verify():
    phone = request.args.get('phone')
    if not phone:
        return redirect(url_for('main.login'))

    if request.method == 'POST':
        input_otp = request.form['otp']
        if auth.verify_otp(phone, input_otp):
            # Login successful
            user = repository.get_user_by_phone(phone)
            if user is None:
                user = repository.create_user(phone)

            session.clear()
            session['user_id'] = user['id']

            # Check for pending redirect (e.g. from QR code)
            next_url = session.get('next_url')
            if next_url:
                session.pop('next_url', None)
                return redirect(next_url)

            return redirect(url_for('main.profile'))
        else:
            flash('Código inválido.')

    return render_template('otp.html', phone=phone)

@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('main.login'))

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            # Store where they wanted to go
            session['next_url'] = request.url
            return redirect(url_for('main.login'))

        return view(**kwargs)

    return wrapped_view

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = repository.get_user_by_id(user_id)

@bp.route('/')
def index():
    # QR Code Entry point
    # Ex: /?p=POSTE-01
    asset_code = request.args.get('p')
    if asset_code:
        asset = repository.get_asset_by_hash(asset_code)
        if asset:
            if g.user:
                return redirect(url_for('main.asset_view', asset_id=asset['id']))
            else:
                session['next_url'] = url_for('main.asset_view', asset_id=asset['id'])
                return redirect(url_for('main.login'))

    # If no code, and logged in, go to profile
    if g.user:
        return redirect(url_for('main.profile'))

    return redirect(url_for('main.login'))

@bp.route('/asset/<int:asset_id>')
@login_required
def asset_view(asset_id):
    asset = repository.get_asset_by_id(asset_id)
    if not asset:
        return "Asset not found", 404
    return render_template('asset.html', asset=asset)

@bp.route('/report/<int:asset_id>', methods=('GET', 'POST'))
@login_required
def report(asset_id):
    asset = repository.get_asset_by_id(asset_id)
    rules = repository.get_gamification_rules()

    if request.method == 'POST':
        rule_slug = request.form['rule_slug']
        evidence_url = request.form.get('evidence_url') # In real app, handle file upload here

        # Simple simulation: if no file uploaded, just use a placeholder
        if not evidence_url:
            evidence_url = "https://via.placeholder.com/300"

        repository.create_user_action(g.user['id'], asset['id'], rule_slug, evidence_url)
        flash('Obrigado! Sua ação foi registrada e será analisada.')
        return redirect(url_for('main.asset_view', asset_id=asset['id']))

    return render_template('report.html', asset=asset, rules=rules)

@bp.route('/profile')
@login_required
def profile():
    balance = repository.get_user_balance(g.user['id'])
    history = repository.get_ledger_history(g.user['id'])

    # Calculate progress to next level
    next_level_points = 100 # Default Novato limit
    if balance > 100: next_level_points = 500
    if balance > 500: next_level_points = 1000 # Cap

    progress = min(100, int((balance / next_level_points) * 100))

    return render_template('profile.html', user=g.user, balance=balance, history=history, progress=progress)

from app import ledger

@bp.route('/admin')
@login_required
def admin():
    # In a real app, check for admin role.
    # checking phone number for admin access
    if g.user['phone'] != '0000000000':
         # Simple "admin" check for demo
         pass

    pending = repository.get_pending_actions()
    return render_template('admin.html', pending=pending)

@bp.route('/admin/approve/<int:action_id>', methods=('POST',))
@login_required
def admin_approve(action_id):
    action = repository.get_action_by_id(action_id)
    if action:
        points = 0
        # Find points for this rule
        rules = repository.get_gamification_rules()
        for r in rules:
            if r['slug'] == action['rule_slug']:
                points = r['points']
                break

        repository.update_action_status(action_id, 'APPROVED')
        ledger.process_approved_action(action_id, points)
        flash('Ação aprovada!')

    return redirect(url_for('main.admin'))

@bp.route('/admin/reject/<int:action_id>', methods=('POST',))
@login_required
def admin_reject(action_id):
    repository.update_action_status(action_id, 'REJECTED')
    flash('Ação rejeitada.')
    return redirect(url_for('main.admin'))
