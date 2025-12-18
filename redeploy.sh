#!/bin/sh
echo "[MABUS] Recebido gatilho de atualização..."
cd /app
# Garante keyscan
mkdir -p /root/.ssh
ssh-keyscan github.com >> /root/.ssh/known_hosts

# Atualiza repo
git fetch --all
git reset --hard origin/main

# Rebuild
docker compose up -d --build web
echo "[MABUS] Deploy finalizado."