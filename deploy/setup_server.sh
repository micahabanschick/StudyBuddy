#!/usr/bin/env bash
# StudyBuddy Server Setup — run once as root on the existing QuantPipe VPS
# Usage: bash setup_server.sh <git-repo-url>
# Example: bash setup_server.sh "https://github.com/micahabanschick/StudyBuddy.git"
set -euo pipefail

REPO_URL="${1:?Usage: $0 <git-repo-url>}"
APP_DIR="/opt/studybuddy"
APP_USER="studybuddy"
LOG_DIR="/var/log/studybuddy"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[+]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
die()  { echo -e "${RED}[✗]${NC} $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Must be run as root"

# ── 1. Create app user ────────────────────────────────────────────────────────
log "Creating $APP_USER user..."
if ! id "$APP_USER" &>/dev/null; then
    useradd --system --shell /bin/bash --home "$APP_DIR" --create-home "$APP_USER"
fi

mkdir -p "$LOG_DIR"
chown "$APP_USER:$APP_USER" "$LOG_DIR"

# ── 2. Install Node.js 22 (if not present) ───────────────────────────────────
if ! command -v node &>/dev/null || [[ "$(node --version)" != v22* ]]; then
    log "Installing Node.js 22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi

log "Installing pnpm..."
npm install -g pnpm@10

# ── 3. Install uv (if not present) ───────────────────────────────────────────
if ! command -v uv &>/dev/null; then
    log "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    # Add to system PATH
    ln -sf ~/.local/bin/uv /usr/local/bin/uv 2>/dev/null || true
fi

# ── 4. Clone repo ─────────────────────────────────────────────────────────────
log "Cloning StudyBuddy to $APP_DIR..."
if [[ -d "$APP_DIR/.git" ]]; then
    warn "Repo already exists — pulling latest"
    sudo -u "$APP_USER" git -C "$APP_DIR" pull
else
    rm -rf "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR"
    chown -R "$APP_USER:$APP_USER" "$APP_DIR"
fi

# ── 5. Install web deps + build ───────────────────────────────────────────────
log "Installing web dependencies..."
sudo -u "$APP_USER" bash -c "
    cd $APP_DIR/web
    pnpm install --frozen-lockfile
    pnpm db:generate
"

warn "Create $APP_DIR/web/.env.local before building (see web/.env.local.example)"
warn "Then run: sudo -u $APP_USER bash -c 'cd $APP_DIR/web && pnpm build'"

# ── 6. Install AI service deps ────────────────────────────────────────────────
log "Installing AI service dependencies..."
sudo -u "$APP_USER" bash -c "
    cd $APP_DIR/ai
    uv sync --frozen
"
warn "Create $APP_DIR/ai/.env before starting (see ai/.env.example)"

# ── 7. Install systemd services ───────────────────────────────────────────────
log "Installing systemd services..."
cp "$APP_DIR/deploy/systemd/studybuddy-web.service" /etc/systemd/system/
cp "$APP_DIR/deploy/systemd/studybuddy-ai.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable studybuddy-web studybuddy-ai

# ── 8. nginx site ─────────────────────────────────────────────────────────────
log "Configuring nginx..."
cp "$APP_DIR/deploy/nginx-site.conf" /etc/nginx/sites-available/studybuddy
ln -sf /etc/nginx/sites-available/studybuddy /etc/nginx/sites-enabled/studybuddy
warn "Edit /etc/nginx/sites-available/studybuddy and replace 'study.yourdomain.com'"
warn "Then run: certbot --nginx -d study.yourdomain.com"
warn "Then run: nginx -t && systemctl reload nginx"

# ── 9. Done ───────────────────────────────────────────────────────────────────
log "Setup complete. Next steps:"
echo "  1. Create $APP_DIR/web/.env.local  (copy from web/.env.local.example)"
echo "  2. Create $APP_DIR/ai/.env         (copy from ai/.env.example)"
echo "  3. sudo -u studybuddy bash -c 'cd /opt/studybuddy/web && pnpm build'"
echo "  4. Edit nginx site config with your domain, then run certbot"
echo "  5. systemctl start studybuddy-web studybuddy-ai"
