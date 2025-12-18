from app import repository

LEVELS = {
    0: 'Novato',
    101: 'Guardião',
    501: 'Lenda'
}

def calculate_level_title(points):
    title = 'Novato'
    for threshold, level_name in sorted(LEVELS.items()):
        if points >= threshold:
            title = level_name
    return title

def process_approved_action(action_id, points):
    """
    Called when an action is APPROVED.
    1. Adds entry to ledger.
    2. Recalculates user level.
    """
    action = repository.get_action_by_id(action_id)
    if not action:
        return False

    user_id = action['user_id']

    # 1. Add to Ledger
    repository.add_ledger_entry(
        user_id=user_id,
        action_id=action_id,
        amount=points,
        description=f"Action APPROVED: {action['rule_slug']}"
    )

    # 2. Recalculate Level
    current_balance = repository.get_user_balance(user_id)
    new_title = calculate_level_title(current_balance)

    # Update user title if changed (or just always update to be safe)
    repository.update_user_level(user_id, new_title)

    return True
