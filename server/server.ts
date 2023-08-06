import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { generateRandomString } from "./utils";
import axios from "axios";

const app = new Elysia();
app.use(staticPlugin({
  assets: './dist',
  prefix: ''
}));

const PORT = 3000;
const SPOTIFY_API: string = 'https://api.spotify.com/v1';

const CLIENT_ID: string = String(process.env.CLIENT_ID);
const CLIENT_SECRET: string = String(process.env.CLIENT_SECRET);
const REDIRECT_URI = 'http://localhost:3000/callback';


// Route to initiate the authorization process
app.get('/authenticate', async (context) => {
  const scopes = 'user-top-read user-read-private user-read-email user-library-read playlist-modify-private playlist-modify-public';
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

app.get('/check-auth', ({store}) => {
  if (store.access_token) {
    return { isAuth: true };
  }
  return { isAuth: false }
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
      if (access_token === undefined){
        throw new Error("access token was not returned by spotify");
      }
      store.access_token = access_token;

      set.redirect = '/'
    } catch (error) {
      console.log(error);
      set.status = 500;
      return 'Error retrieving access token.';
    }
  });

  app.get('/top/tracks', async({ store, set }) => {
    try {
      const access_token = store.access_token;
      if (access_token === undefined) {
        set.status = 500;
        return 'no token';
      }
      const { data } = await axios.get(`${SPOTIFY_API}/me/top/tracks`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      set.status = 200;
      const tracks = data.items.map( entry => ({
        name: entry.name,
        artist: entry.artists[0].name,
        images: entry.album.images,
      }));
      return tracks;
    } catch (error) {
      set.status = 500;
      return error;
    }
  });

  app.get('/top/artists', async({ store, set }) => {
    try {
      const access_token = store.access_token;

      if (access_token === undefined) {
        set.status = 500;
        return 'no token';
      }

      const { data } = await axios.get(`${SPOTIFY_API}/me/top/artists`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      const artists = data.items.map( entry => ({
        name: entry.name,
        genres: entry.genres,
        images: entry.images,
      }));

      set.status = 200;
      return artists;
    } catch (error) {
      set.status = 500;
      return error;
    }
  });

  app.get('/', () => {
    const index = Bun.resolveSync("../dist/index.html", import.meta.dir)
    return Bun.file(index);
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
