import axios from "axios";
const SPOTIFY_API: string = 'https://api.spotify.com/v1';
const CLIENT_ID: string = String(process.env.CLIENT_ID);
const CLIENT_SECRET: string = String(process.env.CLIENT_SECRET);

export function generateRandomString(length: number) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function getRefreshedToken(refresh_token: string) {
    const { data } = await axios.post(`${SPOTIFY_API}/api/token`,
        {
            grant_type: 'refresh_token',
            refresh_token,
        },
        { headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
        }}
    );
    return data.access_token;
}
