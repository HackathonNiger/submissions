# Vitalink Backend

## Overview

Vitalink Backend is a Django-based REST API server for the Vitalink health monitoring application. It integrates machine learning models to predict blood pressure (systolic and diastolic) based on user inputs like age, gender, oxygen saturation (SpO2), heart rate (BPM), and body temperature. The system also generates health alerts based on predefined thresholds for these vital signs.

The backend handles data ingestion from health devices, processes it through AI models, stores records in a database, and provides endpoints for retrieving the latest health data and updating user configurations.

## Features

- **Data Ingestion**: Accepts health metrics via API endpoints and stores them in the database.
- **Machine Learning Integration**: Uses a pre-trained Keras model to predict blood pressure values.
- **Health Alerts**: Generates automated alerts for abnormal vital signs (e.g., high/low heart rate, fever, hypoxemia).
- **User Configuration**: Allows updating user age and gender for personalized predictions.
- **Real-time Data Retrieval**: Provides the latest health records with an "online" status indicator.
- **Admin Interface**: Includes Django admin for database management.
- **CORS Support**: Configured for cross-origin requests, suitable for web and mobile frontends.
- **Deployment Ready**: Hosted on PythonAnywhere with production settings.

## Tech Stack

- **Framework**: Django 5.1.4
- **Database**: SQLite (for development; can be switched to PostgreSQL/MySQL for production)
- **Machine Learning**: TensorFlow/Keras (for blood pressure prediction model)
- **Deployment**: PythonAnywhere
- **Other**: CORS headers for API access

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Git

### Steps

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd vitalink_server
   ```

2. **Create a Virtual Environment** (recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:

   ```bash
   pip install django djangorestframework tensorflow corsheaders
   ```

4. **Apply Migrations**:

   ```bash
   python manage.py migrate
   ```

5. **Create Superuser** (for admin access):

   ```bash
   python manage.py createsuperuser
   ```

6. **Run the Server**:
   ```bash
   python manage.py runserver
   ```
   The server will start at `http://127.0.0.1:8000/`.

## Usage

- **Admin Panel**: Access `http://127.0.0.1:8000/admin/` to manage database records.
- **API Endpoints**: Use tools like Postman or curl to interact with the API.
- **ML Model**: The Keras model (`model.keras`) is loaded automatically on server start for predictions.

### Example Usage

1. Update user config:

   ```bash
   curl "http://127.0.0.1:8000/update?age=30&gender=1"
   ```

2. Push health data:

   ```bash
   curl "http://127.0.0.1:8000/push?spo2=95&bpm=70&temp=36.5"
   ```

3. Pull latest data:
   ```bash
   curl "http://127.0.0.1:8000/pull"
   ```

## API Endpoints

The API is hosted at `https://vitalink.pythonanywhere.com` in production.

### 1. Push Data (`GET /push`)

Pushes new health metrics, predicts BP, generates alerts, and saves to database.

**Parameters**:

- `spo2` (int): Oxygen saturation percentage
- `bpm` (int): Heart rate in beats per minute
- `temp` (float): Body temperature in Celsius

**Response**:

```json
{
  "success": true
}
```

### 2. Pull Data (`GET /pull`)

Retrieves the latest health record.

**Response**:

```json
{
  "spo2": 95,
  "bpm": 70,
  "temp": 36.5,
  "sbp": 120,
  "dbp": 80,
  "alert": "Healthy state from restricted health data",
  "online": true
}
```

### 3. Update Config (`GET /update`)

Updates user age and gender.

**Parameters**:

- `age` (int): User's age
- `gender` (int): Gender (0 for female, 1 for male)

**Response**:

```json
{
  "success": true
}
```

### 4. Admin (`/admin`)

Django admin interface for database management.

## Data Models

### Config

Stores user configuration.

- `age` (IntegerField): User's age
- `gender` (IntegerField): User's gender (0/1)

### VitalinkRecord

Stores health records.

- `timestamp` (DateTimeField): Auto-generated timestamp
- `age` (IntegerField): User's age at record time
- `gender` (IntegerField): User's gender
- `spo2` (IntegerField): Oxygen saturation
- `temp` (FloatField): Body temperature
- `bpm` (IntegerField): Heart rate
- `alert` (CharField): AI-generated alert message
- `sbp` (IntegerField): Systolic blood pressure (predicted)
- `dbp` (IntegerField): Diastolic blood pressure (predicted)

## Deployment

The application is deployed on PythonAnywhere at `https://vitalink.pythonanywhere.com`.

### Production Notes

- Set `DEBUG = False` in `settings.py`.
- Use environment variables for `SECRET_KEY`.
- Switch to a production database like PostgreSQL.
- Ensure static files are served correctly.

## Contact

For questions or support, contact the development team.
