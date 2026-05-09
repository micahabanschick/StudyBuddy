#!/usr/bin/env bash
# StudyBuddy update — run on the VPS to pull latest and restart services
# Usage: bash /opt/studybuddy/deploy/update.sh
set -euo pipefail

APP_DIR="/opt/studybuddy"
APP_USER="studybuddy"

GREEN='\033[0;32m'; NC='\033[0m'
log() { echo -e "${GREEN}[+]${NC} $*"; }

log "Pulling latest code..."
sudo -u "$APP_USER" git -C "$APP_DIR" pull

log "Updating web dependencies..."
sudo -u "$APP_USER" bash -c "
    cd $APP_DIR/web
    pnpm install --frozen-lockfile
    pnpm db:generate
    pnpm build
"

log "Updating AI service dependencies..."
sudo -u "$APP_USER" bash -c "
    cd $APP_DIR/ai
    uv sync --frozen
"

log "Restarting services..."
systemctl restart studybuddy-web studybuddy-ai

log "Done. Logs:"
echo "  journalctl -u studybuddy-web -f"
echo "  journalctl -u studybuddy-ai  -f"
