// generate-token.ts
import { google } from 'googleapis';
import readline from 'readline';

const CLIENT_ID = '343774515630-910b87607fk9f3qafp6inqgavnm6vg5a.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'; // Default for desktop/CLI apps

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline', // Crucial: gets a long-lived refresh token
  scope: ['https://mail.google.com/'],
});

console.log('1. Authorize this app by visiting this url:\n', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\n2. Enter the code from that page here: ', async (code) => {
  const { tokens } = await oAuth2Client.getToken(code);
  console.log('\nSuccess! Your Refresh Token is:\n', tokens.refresh_token);
  rl.close();
});