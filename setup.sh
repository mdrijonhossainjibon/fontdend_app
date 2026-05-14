#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
#   CaptchaMaster Frontend Vercel-Style Auto-Deploy
#   Dev by: Md Rijon Hossain Jibon YT
# ═══════════════════════════════════════════════════════════════════════

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
echo "  ┃                                                                ┃"
echo "  ┃   FRONTEND AUTO-DEPLOY (VITE + PM2 + WEBHOOK)                  ┃"
echo "  ┃   Developed by: Md Rijon Hossain Jibon YT                      ┃"
echo "  ┃                                                                ┃"
echo "  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
echo -e "${NC}"

if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

# 1. Configuration
read -p "Enter GitHub Repo URL (HTTPS): " REPO_URL
read -p "Enter Domain Name: " DOMAIN
INSTALL_DIR="/var/www/$DOMAIN"

# 2. Install Essentials
echo -e "${BLUE}Installing Nginx, Node.js, and PM2...${NC}"
apt update && apt install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2 serve

# 3. Initial Clone & Build
echo -e "${BLUE}Cloning and Building Frontend...${NC}"
rm -rf $INSTALL_DIR
git clone $REPO_URL $INSTALL_DIR
cd $INSTALL_DIR
npm install --legacy-peer-deps
npm run build

# 4. Serve with PM2 (Static Build)
echo -e "${BLUE}Serving with PM2...${NC}"
pm2 stop "$DOMAIN-app" 2>/dev/null || true
pm2 start "serve -s dist -p 3000" --name "$DOMAIN-app"

# 5. Nginx Configuration (Reverse Proxy to PM2)
echo -e "${BLUE}Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# 6. Setup SSL (Optional but Recommended)
echo -e "${YELLOW}Do you want to install SSL (Certbot)? (y/n)${NC}"
read INSTALL_SSL
if [ "$INSTALL_SSL" = "y" ]; then
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN
fi

# 7. Vercel-Style Webhook (Auto-Push Build)
echo -e "${BLUE}Setting up Webhook Listener on Port 9000...${NC}"
mkdir -p $INSTALL_DIR/deploy-server
cat > $INSTALL_DIR/deploy-server/deploy.js <<EOF
const http = require('http');
const { exec } = require('child_process');

http.createServer((req, res) => {
    if (req.method === 'POST') {
        console.log('Push received! Updating Frontend...');
        exec('cd $INSTALL_DIR && git pull && npm install && npm run build && pm2 restart "$DOMAIN-app"', (err) => {
            if (err) console.error('Build Error:', err);
            else console.log('Frontend Updated Successfully!');
        });
        res.writeHead(200);
        res.end('Deployment Started');
    } else {
        res.writeHead(404);
        res.end();
    }
}).listen(9000);
EOF

pm2 stop "$DOMAIN-webhook" 2>/dev/null || true
pm2 start $INSTALL_DIR/deploy-server/deploy.js --name "$DOMAIN-webhook"
pm2 save

echo -e "${GREEN}Deployment Successful!${NC}"
echo -e "${CYAN}Website: http://$DOMAIN${NC}"
echo -e "${CYAN}Webhook for GitHub: http://$DOMAIN:9000${NC}"
echo -e "${YELLOW}Developed by: Md Rijon Hossain Jibon YT${NC}"
