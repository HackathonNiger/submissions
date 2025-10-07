# GestPay WhatsApp Payment System

This directory contains the WhatsApp Business API integration for GestPay, allowing users to perform financial transactions directly through WhatsApp messages.

## Overview

The WhatsApp payment system mirrors the Telegram implementation but uses the WhatsApp Business API (Meta Cloud API) for messaging. Users can check balances, send money, view transactions, and get financial advice through natural language conversations.

## Architecture

### Core Components

1. **webhook.php** - Main webhook handler for incoming WhatsApp messages
2. **handlers/** - Specific action handlers (balance, transfers, transactions, account)
3. **setup-bot.php** - Admin endpoint for configuring WhatsApp bot
4. **toggle-payments.php** - User endpoint for enabling/disabling WhatsApp payments
5. **disconnect-whatsapp.php** - User endpoint for unlinking WhatsApp account
6. **details.php** - User endpoint for viewing WhatsApp connection details

### Database Tables

#### New Tables Created:
- `whatsapp_sessions` - Session management for WhatsApp users
- `whatsapp_bot_config` - Bot configuration (tokens, API keys)
- `whatsapp_messages` - Message logging for debugging

#### Existing Tables Used:
- `users` - User accounts with WhatsApp flags
- `linked_accounts` - Platform linking (supports 'whatsapp')
- `transactions` - Financial transactions (supports 'whatsapp-pay' feature)
- `otp_codes` - OTP verification for account linking
- `webapp_tokens` - PIN verification tokens

## User Flow

### 1. Account Linking
```
User sends "Hi" → System checks if phone exists in users table
→ If exists: Generate OTP → User enters OTP → Account linked
→ If not exists: Show registration message
```

### 2. Payment Flow
```
User: "Send ₦500 to John"
→ AI parses intent → Find recipient → Check balance
→ Create pending transaction → Generate webapp token
→ Send PIN verification link → User enters PIN → Transaction completed
```

### 3. Balance Check
```
User: "What's my balance?"
→ AI parses intent → Query user balance → Format response
```

## API Endpoints

### User Endpoints

#### Toggle WhatsApp Payments
```http
POST /api/v1/whatsapp/toggle-payments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "enable_payments": true
}
```

#### Get WhatsApp Details
```http
GET /api/v1/whatsapp/details
Authorization: Bearer <jwt_token>
```

#### Disconnect WhatsApp
```http
POST /api/v1/whatsapp/disconnect-whatsapp
Authorization: Bearer <jwt_token>
```

### Admin Endpoints

#### Setup WhatsApp Bot
```http
POST /api/v1/whatsapp/setup-bot
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "phone_number_id": "1234567890",
  "access_token": "your_access_token",
  "webhook_verify_token": "your_verify_token",
  "business_account_id": "your_business_id",
  "ai_api_key": "your_ai_api_key",
  "ai_model": "gpt-4o-mini"
}
```

## Configuration

### WhatsApp Business API Setup

1. **Create Meta Developer Account**
   - Go to developers.facebook.com
   - Create a new app with WhatsApp Business API

2. **Get Required Credentials**
   - Phone Number ID
   - Access Token
   - Webhook Verify Token
   - Business Account ID

3. **Configure Webhook**
   - Webhook URL: `https://yourdomain.com/api/v1/whatsapp/webhook`
   - Verify Token: (set in bot config)
   - Subscribe to: messages

### Database Setup

Run the SQL commands in `/database/whatsapp_tables.sql`:

```sql
-- Execute these commands in your MySQL database
SOURCE /path/to/gestpay/database/whatsapp_tables.sql;
```

## AI Integration

The system uses A4F API for natural language processing:

### Supported Actions:
- `get_balance` - Check account balance
- `get_account_details` - View account information
- `get_transaction_history` - Show recent transactions
- `transfer_internal` - Send money to GestPay users
- `transfer_external` - External bank transfers (coming soon)
- `fintech_advice` - Financial advice and education

### AI Response Format:
```json
{
  "action": "transfer_internal",
  "parameters": {
    "amount": 500,
    "recipient": "John"
  },
  "message": "Initiating transfer of ₦500 to John"
}
```

## Security Features

1. **OTP Verification** - Account linking requires OTP
2. **PIN Verification** - Transactions require PIN entry via secure webview
3. **Session Management** - Stateful conversation tracking
4. **Payment Toggles** - Users can disable WhatsApp payments
5. **Token Expiry** - Webapp tokens expire in 15 minutes

## Error Handling

### Common Error Scenarios:
- Invalid phone number format
- Account not found
- Insufficient balance
- Disabled payments
- Expired OTP/tokens
- AI API failures

### Logging:
- All messages logged to `whatsapp_messages` table
- Errors logged to PHP error log
- Webhook requests logged for debugging

## Testing

### Manual Testing Flow:
1. Configure bot using setup endpoint
2. Send "Hi" to WhatsApp number
3. Complete OTP verification
4. Test commands:
   - "What's my balance?"
   - "Send ₦100 to [user]"
   - "Show my transactions"

### Webhook Testing:
```bash
# Test webhook verification
curl "https://yourdomain.com/api/v1/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test&hub.verify_token=your_token"

# Test message webhook
curl -X POST https://yourdomain.com/api/v1/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"from":"1234567890","text":{"body":"Hi"},"type":"text"}]}}]}]}'
```

## Deployment Checklist

- [ ] Database tables created
- [ ] WhatsApp Business API configured
- [ ] Webhook URL set in Meta Developer Console
- [ ] Bot configuration saved via setup endpoint
- [ ] AI API key configured
- [ ] SSL certificate installed (required for webhooks)
- [ ] Error logging enabled
- [ ] Test user account linked and verified

## Troubleshooting

### Common Issues:

1. **Webhook not receiving messages**
   - Check webhook URL is accessible
   - Verify SSL certificate
   - Check webhook verify token

2. **OTP not working**
   - Check phone number format
   - Verify user exists in database
   - Check OTP expiry time

3. **AI not responding**
   - Verify AI API key
   - Check API quota/limits
   - Review error logs

4. **Payments failing**
   - Check user has `allow_whatsapp_payments = 1`
   - Verify sufficient balance
   - Check webapp token generation

## Differences from Telegram Implementation

1. **Message Format**: WhatsApp uses different API structure
2. **Interactive Elements**: Limited compared to Telegram inline keyboards
3. **Verification**: Uses webhook verification instead of bot token
4. **Phone Numbers**: Direct phone number identification vs chat IDs
5. **Session Management**: Phone-based instead of chat_id-based

## Future Enhancements

- [ ] Interactive buttons for recipient selection
- [ ] Rich media support (images, documents)
- [ ] Group payment features
- [ ] Merchant payment QR codes
- [ ] Payment reminders and notifications
- [ ] Multi-language support
- [ ] Voice message support
