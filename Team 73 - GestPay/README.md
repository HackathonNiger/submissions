# GestPay - Complete Payment Solution

GestPay is a comprehensive payment solution featuring face recognition technology, built with a modern tech stack including Python-PHP backend, Next.js web application, and React Native mobile app.

## Deliverables

### 🌐 Web Application
- **Live Demo:** [GestPay Web App](https://gestpay.vercel.app) 

### 📱 Mobile Application  
- **APK Download:** [Download GestPay APK](https://expo.dev/artifacts/eas/jPyEqJjsz42VeF4EZKJWHF.apk) 



## 🏗️ Project Structure

```
GestPay/
├── backend-php/          # PHP backend with face recognition API
├── web-app/             # Next.js web application
├── mobile-app/          # React Native/Expo mobile application
├── backend-aiml-python/ # Python AI/ML services 
└── README.md           # This file
```

## 🚀 Quick Start Guide

### Prerequisites

Before setting up any component, ensure you have the following installed:

- **PHP 7.4+** with extensions: mysqli, json, curl
- **MySQL 8.0+** or MariaDB 10.4+
- **Node.js 18+** and npm
- **Python 3.8+** and pip
- **Composer** (PHP dependency manager)
- **XAMPP/WAMP/MAMP** (recommended for local development)
- **Expo CLI** for mobile development

---

## 📱 Component Setup Instructions

### 1. Backend PHP Setup

The PHP backend provides REST APIs for user management, payments, and face recognition integration.

#### **Requirements**
- PHP 7.4+ with mysqli extension
- MySQL/MariaDB database
- Apache/Nginx web server
- Composer for dependency management

#### **Installation Steps**

1. **Navigate to backend directory:**
   ```bash
   cd backend-php
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Database Setup:**
   - Create a MySQL database named `gestpay`
   - Import the database schemas:
     ```bash
     mysql -u root -p gestpay < database/face_recognition_schema.sql
     mysql -u root -p gestpay < database/luxand_schema.sql
     mysql -u root -p gestpay < database/whatsapp_tables.sql
     ```

4. **Configure Database Connection:**
   - Edit `config/config.php` and update database credentials:
     ```php
     $servername = "localhost";
     $username = "root";
     $password = "your_password";
     $dbname = "gestpay";
     ```

5. **Web Server Configuration:**
   - If using XAMPP, place the project in `htdocs/gestpay`
   - Ensure `.htaccess` is enabled for clean URLs
   - Access via: `http://localhost/gestpay`

6. **Python Face Recognition Service:**
   ```bash
   cd python
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env file with your configuration
   python main.py
   ```

#### **API Endpoints**
- Base URL: `http://localhost/gestpay/api/`
- Face Recognition: `http://localhost:8000` (Python service)

---

### 2. Web Application Setup (Next.js)

Modern web interface built with Next.js, Tailwind CSS, and Redux.

#### **Requirements**
- Node.js 18+
- npm or yarn

#### **Installation Steps**

1. **Navigate to web-app directory:**
   ```bash
   cd web-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration:**
   - Create `.env.local` file:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost/gestpay/api
     NEXT_PUBLIC_FACE_API_URL=http://localhost:8000
     ```

4. **Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

#### **Access**
- Development: `http://localhost:3000`
- Production: `http://localhost:3000` (after build)

#### **Features**
- Responsive design with Tailwind CSS
- Redux state management
- Face recognition integration
- Modern UI components

---

### 3. Mobile Application Setup (React Native/Expo)

Cross-platform mobile app built with React Native and Expo.

#### **Requirements**
- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Studio/Emulator

#### **Installation Steps**

1. **Install Expo CLI globally:**
   ```bash
   npm install -g @expo/cli
   ```

2. **Navigate to mobile-app directory:**
   ```bash
   cd mobile-app
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Environment Configuration:**
   - Update API endpoints in your configuration files
   - Ensure backend services are running

5. **Development:**
   ```bash
   # Start Expo development server
   expo start
   
   # Run on specific platforms
   expo start --android
   expo start --ios
   expo start --web
   ```

6. **Testing:**
   - Install Expo Go app on your mobile device
   - Scan QR code from terminal
   - Or use simulators/emulators

#### **Features**
- Face recognition for payments
- Secure authentication
- Cross-platform compatibility
- Modern UI with native performance

#### **Build for Production**
```bash
# Build for Android
expo build:android

# Build for iOS (requires Apple Developer account)
expo build:ios
```

---

### 4. Backend AI/ML Python Setup

FastAPI-based AI/ML backend service with face recognition, biometric authentication, and payment processing capabilities.

#### **Requirements**
- Python 3.8+ with pip
- PostgreSQL database
- Virtual environment (recommended)

#### **Installation Steps**

1. **Navigate to backend AI/ML directory:**
   ```bash
   cd backend-aiml-python
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration:**
   Create a `.env` file in the `backend-aiml-python` directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/gestpay_ai
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   
   ```

5. **Database Setup:**
   ```bash
   # Create PostgreSQL database
   createdb gestpay_ai
   
   # Database tables will be created automatically on first run
   ```

6. **Start the FastAPI server:**
   ```bash
   # Development mode with auto-reload
   uvicorn bridge:app --reload --host 0.0.0.0 --port 8001
   
   # Production mode
   uvicorn bridge:app --host 0.0.0.0 --port 8001
   ```

#### **API Endpoints**
- Base URL: `http://localhost:8001`
- Authentication: `/auth/` - User registration, login, token management
- Biometric: `/biometric/` - Face recognition and biometric payments
- User Management: `/user/` - User profile and settings
- Transactions: `/transactions/` - Payment transaction handling
- Wallet: `/wallet/` - Digital wallet operations
- Dashboard: `/dashboard/` - Analytics and reporting

#### **Key Features**
- **Face Recognition:** DeepFace integration with FAISS indexing for fast facial matching
- **Biometric Payments:** Secure face-based payment authentication
- **JWT Authentication:** Token-based security with refresh tokens
- **Payment Integration:** Paystack payment gateway integration
- **Real-time Processing:** FastAPI async support for high performance
- **Database ORM:** SQLAlchemy with PostgreSQL backend
- **CORS Support:** Cross-origin resource sharing for web integration

#### **Technology Stack**
- **FastAPI** - Modern Python web framework
- **DeepFace** - Face recognition and analysis
- **FAISS** - Facebook AI Similarity Search for embeddings
- **TensorFlow** - Machine learning framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Primary database
- **Pydantic** - Data validation and settings
- **OpenCV** - Computer vision processing

---

## 🗄️ Database Configuration

### Database Schema
The project uses MySQL with the following main tables:
- `users` - User accounts with face recognition data
- `face_recognition_logs` - Audit trail for face recognition events
- `payments` - Payment transactions
- `whatsapp_integration` - WhatsApp API integration data

### Setup Instructions
1. Create database: `CREATE DATABASE gestpay;`
2. Import schemas in order:
   ```bash
   mysql -u root -p gestpay < backend-php/config/gestpay.sql
   ```

---

## 🔧 Environment Configuration

### Backend PHP Environment
Edit `backend-php/config/config.php`:
```php
$servername = "localhost";
$username = "root";
$password = "your_password";
$dbname = "gestpay";
$SITE_URL = "http://localhost/gestpay";
```

### Python Face Recognition Service
Copy and edit `backend-php/python/.env.example` to `.env`:
```env
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=8000
FACE_CONFIDENCE_THRESHOLD=0.6
FACE_MODEL=hog
```

### Web Application Environment
Create `web-app/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost/gestpay/api
NEXT_PUBLIC_FACE_API_URL=http://localhost:8000
```

---

## 🚀 Running the Complete System

### Development Mode
1. **Start Database:** Ensure MySQL is running
2. **Start PHP Backend:** 
   ```bash
   # If using XAMPP, start Apache and MySQL
   # Or use PHP built-in server:
   cd backend-php
   php -S localhost:8080
   ```
3. **Start Python Face Recognition:**
   ```bash
   cd backend-php/python
   python main.py
   ```
4. **Start Web Application:**
   ```bash
   cd web-app
   npm run dev
   ```
5. **Start Mobile App:**
   ```bash
   cd mobile-app
   expo start
   ```

### Access Points
- **Web App:** http://localhost:3000
- **PHP Backend:** http://localhost/gestpay (or http://localhost:8080)
- **Face Recognition API:** http://localhost:8000
- **Mobile App:** Via Expo Go app or simulator

---

## 🔒 Security Considerations

- **Face Recognition Data:** Stored as encrypted JSON in database
- **API Security:** Implement proper authentication tokens
- **Database Security:** Use strong passwords and limit access
- **HTTPS:** Use SSL certificates in production
- **Environment Variables:** Never commit sensitive data to version control

---

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   - Check MySQL service is running
   - Verify credentials in `config/config.php`
   - Ensure database `gestpay` exists

2. **Face Recognition Service Not Starting:**
   - Install Python dependencies: `pip install -r requirements.txt`
   - Check port 8000 is available
   - Verify `.env` configuration

3. **Mobile App Not Loading:**
   - Ensure Expo CLI is installed
   - Check Node.js version (18+)
   - Clear Expo cache: `expo start -c`

4. **Web App Build Errors:**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Next.js version compatibility
   - Verify environment variables

---

## 📚 Technology Stack

### Backend
- **PHP 7.4+** - Server-side logic
- **MySQL 8.0+** - Database
- **Composer** - Dependency management
- **Python 3.8+** - Face recognition service
- **FastAPI** - Python web framework

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management

### Mobile
- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation
- **Redux** - State management

### AI/ML
- **face-recognition** - Python face recognition library
- **OpenCV** - Computer vision
- **NumPy** - Numerical computing



## 👥 Support

For technical support or questions:
- Check troubleshooting section above
- Review component-specific documentation
- Ensure all prerequisites are installed
- Verify environment configurations
- Message 09019659410 on whatsapp

---

*Last updated: October 2025*
