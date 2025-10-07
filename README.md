# PathWise-AI

![Pathwise](Pathwise.png)

PathWise-AI is an interactive career guidance platform designed to help Nigerian graduates and job seekers explore career paths, build relevant skills, and complete hands-on projects. The platform provides curated learning roadmaps, assessments, and project workspaces for various tech and professional roles.

## 🚀 Features

- **Career Roadmaps:** Step-by-step skill trees for roles like Frontend Developer, Backend Developer, Fullstack Developer, Product Designer, and more
- **Skill Assessments:** Interactive quizzes to validate your knowledge and earn certificates
- **Project Workspaces:** Guided, real-world projects with code editors and progress tracking
- **Resource Library:** Curated links to top learning materials for each skill
- **AI Agent Integration:** Powered by AIQ toolkit for intelligent career guidance and recommendations
- **Responsive UI:** Built with React, Tailwind CSS, and Vite for fast, modern web experience

## 📁 Project Structure

```
PathWise-AI/
├── Pathwise-frontend/
│   ├── public/
│   │   ├── images/
│   │   └── ...icons and manifest
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── Pathwise-backend/
├── nigeria_pathwise/
├── cors_proxy.py
└── README.md
```

## 🎯 Prerequisites

- Windows 10/11 with WSL2 support
- Internet connection for downloading packages
- Basic familiarity with terminal/command line

---

# 🛠️ Complete Installation & Setup Guide

This guide walks you through setting up the PathWise AI project inside **WSL Ubuntu** from scratch. Follow the steps carefully to get the complete system running.

## Step 1: Install WSL and Ubuntu

1. Open **PowerShell** as Administrator on Windows
2. Install WSL with Ubuntu:
   ```bash
   wsl --install
   ```
3. **Restart your PC** after installation
4. Open Ubuntu (WSL) from your terminal or Start menu

## Step 2: Update Ubuntu System

Update and upgrade your Ubuntu system:

```bash
sudo apt update && sudo apt upgrade -y
```

> **Note:** Enter your Windows system password when prompted. Characters won't be displayed on screen for security.

## Step 3: Install Essential Tools

Install Python 3 and development tools:

```bash
# Python 3 (usually pre-installed, but install tools)
sudo apt install -y python3 python3-venv python3-pip

# Install curl for downloading Node.js
sudo apt install -y curl

# Verify Python installation
python3 --version
```

## Step 4: Clone the Repository

```bash
git clone https://github.com/codewithgaji/PathWise-AI.git
cd PathWise-AI
```

## Step 5: Set Up Python Virtual Environment

Create and activate a Python virtual environment:

```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate
```

> **Important:** You should see `(.venv)` at the beginning of your terminal prompt when activated.

## Step 6: Install Node.js (Latest LTS)

Remove outdated versions and install the latest Node.js:

```bash
# Remove outdated Node.js if present
sudo apt remove -y nodejs npm
sudo apt autoremove -y

# Add NodeSource repository for Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

## Step 7: Install and Configure MongoDB

### Add MongoDB Repository

```bash
# Add MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo tee /usr/share/keyrings/mongodb-server-7.0.gpg > /dev/null

# Add MongoDB repository (using Ubuntu 22.04 Jammy for compatibility)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package lists
sudo apt update
```

### Install and Start MongoDB

```bash
# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start automatically on boot
sudo systemctl enable mongod

# Check MongoDB status
sudo systemctl status mongod
```

Use **Ctrl + C** to exit the status view.

### Verify MongoDB Connection

```bash
mongosh --eval 'db.runCommand({ connectionStatus: 1 })'
```

You should see `"ok" : 1` in the output if MongoDB is working correctly.

---

# 🚀 Running the Application

The PathWise-AI system consists of four components that need to run simultaneously. Open **four separate Ubuntu (WSL) terminals** for the following:

## Terminal 1: Frontend Server

```bash
cd PathWise-AI/Pathwise-frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Terminal 2: Backend Server

```bash
cd PathWise-AI
source .venv/bin/activate
cd Pathwise-backend
npm install
npm start
```

## Terminal 3: AI Agent Setup and Server

### Install AI Dependencies

```bash
cd PathWise-AI
source .venv/bin/activate

# Install uv and AI toolkit
pip install uv
uv add aiqtoolkit
uv add fastapi uvicorn
```

### Install and Configure Agent

```bash
# Install the agent
uv pip install -e .
uv pip install -e nigeria_pathwise

# Remove existing agent (if any) and create new one
nat workflow delete nigeria_pathwise
nat workflow create nigeria_pathwise
```

### Set Up Agent Configuration Files

1. **Configure config.yml:**
   ```bash
   # Navigate to nigeria_pathwise/src/nigeria_pathwise/configs/
   # Copy the config.yml file to nigeria_pathwise/configs/
   # Then copy the content from the GitHub repository's config.yml
   ```

2. **Update function files:**
   ```bash
   # Replace content of nigeria_pathwise/nigeria_pathwise_function.py
   # with the content from vector.py in the repository
   ```

3. **Create data directory and file:**
   ```bash
   # Create 'data' folder in nigeria_pathwise root directory
   mkdir -p nigeria_pathwise/data
   
   # Create nigeria_career_guide.csv in the data folder
   # Copy content from repository's nigeria_career_guide.csv
   ```

### Start AI Agent

```bash
nat serve --config_file nigeria_pathwise/configs/config.yml
```

## Terminal 4: CORS Proxy Server

```bash
cd PathWise-AI
source .venv/bin/activate

# Install Flask dependencies
pip install flask flask_cors

# Start CORS proxy server
python cors_proxy.py
```

---

# ✅ Verification

Once all four terminals are running, you should have:

1. **Frontend:** Running on `http://localhost:5173`
2. **Backend:** Running on its configured port
3. **MongoDB:** Active and connected
4. **AI Agent:** Running with FastAPI
5. **CORS Proxy:** Handling cross-origin requests

Visit `http://localhost:5173` in your browser to access the PathWise-AI application.

---

# 🔧 Development

## Build for Production

```bash
cd Pathwise-frontend
npm run build
```

## Linting

```bash
npm run lint
```

## Customization

- **Skills:** Modify `src/data/SkillsData.js`
- **Projects:** Edit `src/data/roleProjectSets.js`
- **UI Components:** Found in `src/components/`
- **AI Agent:** Configure in `nigeria_pathwise/configs/config.yml`

---

# 🚨 Troubleshooting

## MongoDB Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# View MongoDB logs
sudo journalctl -u mongod
```

## Node.js Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall Node.js if needed
sudo apt remove -y nodejs npm
# Then repeat Node.js installation steps
```

## Virtual Environment Issues

```bash
# Recreate virtual environment
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
```

## Port Conflicts

- Frontend: `http://localhost:5173`
- Backend: Check your backend configuration
- AI Agent: Check FastAPI startup logs
- CORS Proxy: Check Flask startup logs

## General Debugging Tips

1. **Check all four terminals** are running their respective services
2. **Verify MongoDB** is active: `sudo systemctl status mongod`
3. **Check browser console** for frontend errors
4. **Review terminal output** for specific error messages
5. **Ensure virtual environment** is activated when running Python commands

---

# 📄 License

[MIT](LICENSE)

---

*Made for Nigerian graduates and job hunters by students*
