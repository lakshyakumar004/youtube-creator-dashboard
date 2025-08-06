const { google } = require('googleapis');

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/youtube.upload'];

const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
};

module.exports = { oauth2Client, getAuthUrl };
