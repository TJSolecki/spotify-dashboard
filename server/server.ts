import { Elysia, t } from "elysia";
import { generateRandomString } from "./utils"

const app = new Elysia();

const PORT = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';


// Route to initiate the authorization process
app.get('/login', async (context) => {
  const scopes = 'user-read-private user-read-email';
  const state = generateRandomString(16);
  const args = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: scopes,
    state: state,
  });
  context.set.redirect = 'https://accounts.spotify.com/authorize?' + args;
});

  // Callback route to handle the access token request
  app.get('/callback', async ({ query, set, store }) => {
    const { code }: { code: string } = query;

    try {
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      });

      const responce = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
        },
        body: body
      });

      const data = await responce.json();

      const { access_token } = data;
      store.access_token = access_token;

      set.redirect = '/dashboard'
    } catch (error) {
      console.log(error);
      set.status = 500;
      return 'Error retrieving access token.';
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
