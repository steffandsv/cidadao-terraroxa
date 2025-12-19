#!/bin/sh
echo "[MABUS] Recebido gatilho de atualização..."
cd /app
mkdir -p /root/.ssh
ssh-keyscan github.com >> /root/.ssh/known_hosts

git fetch --all
git reset --hard origin/main

# Usando docker-compose (compatível com o binário do alpine)
docker-compose up -d --build web
echo "[MABUS] Deploy finalizado."