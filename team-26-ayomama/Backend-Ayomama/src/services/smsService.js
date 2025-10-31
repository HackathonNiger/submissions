import axios from 'axios';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendSMS(phoneNumber, bodyMessage) {
  const message = await client.messages.create({
    body: bodyMessage,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: "+2349133037750",
  });

  console.log(message.body);
}

export { sendSMS };
