
# SmartEd Africa Auth API

This project contains the backend authentication flow for SmartEd Africa, using modern registration practices: email confirmation before setting a password.

## Features

- **User Registration** (email only)
- **Email Confirmation**
- **Set Password** (after email verification)
- **Login**
- **Refresh Token**
- **Logout**
- **Forgot Password**
- **Reset Password**
- **Resend Confirmation Email**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/v1/auth/register | Register user (email only) |
| GET    | /api/v1/auth/confirm/:token | Confirm email |
| POST   | /api/v1/auth/set-password/:id | Set password after email verification |
| POST   | /api/v1/auth/login | Login user |
| POST   | /api/v1/auth/refresh | Refresh access token |
| POST   | /api/v1/auth/logout | Logout user |
| POST   | /api/v1/auth/forgot-password | Send password reset email |
| POST   | /api/v1/auth/reset-password/:token | Reset password using token |
| POST   | /api/v1/auth/resend-confirmation | Resend email confirmation |

---

## Modern Registration Flow

1. **Register** with name & email → user is created but not yet confirmed.
2. **Email confirmation** → user clicks the link received in email.
3. **Set Password** → user sets password after confirmation, can auto-login.
4. **Login** → user can login using email & password.
5. **Forgot/Reset Password** → reset password if forgotten.
6. **Resend Confirmation** → resend confirmation email if needed.

---

## Postman Collection

The Postman collection is included as `SmartEdAuth.postman_collection.json`. Import it into Postman to test all endpoints. Replace placeholders like `:token` or `:id` with actual values from responses.
