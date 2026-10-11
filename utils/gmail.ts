import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET
);

oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

/**
 * Polls Gmail API for the SleekFlow verification code
 */
export async function getLatestOtpCode(query: string = 'from:hi@sleekflow.io "is your SleekFlow verification code"'): Promise<string> {
  const timeoutMs = 30_000;
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 1,
    });

    const messages = listRes.data.messages;
    if (messages && messages.length > 0) {
      const messageRes = await gmail.users.messages.get({
        userId: 'me',
        id: messages[0].id!,
      });

      // Retrieve the subject line from headers
      const headers = messageRes.data.payload?.headers || [];
      const subjectHeader = headers.find((h) => h.name?.toLowerCase() === 'subject')?.value || '';
      const snippet = messageRes.data.snippet || '';

      // Match 6-digit OTP code from either subject or email body
      const subjectMatch = subjectHeader.match(/\b\d{6}\b/);
      if (subjectMatch) {
        return subjectMatch[0];
      }

      const snippetMatch = snippet.match(/\b\d{6}\b/);
      if (snippetMatch) {
        return snippetMatch[0];
      }
    }

    // Wait 2 seconds before retrying
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(`OTP email from hi@sleekflow.io was not received within ${timeoutMs}ms`);
}