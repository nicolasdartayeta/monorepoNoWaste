import { Issuer } from "openid-client";

enum ProveedoresValidos {
  Google = "https://accounts.google.com",
  Facebook = "https://limited.facebook.com",
}

const googleOauthFile = await Bun.file("clienteGoogle.json").json();

const googleIssuer = await Issuer.discover(ProveedoresValidos.Google);

export const GoogleClient = new googleIssuer.Client({
  client_id: googleOauthFile.web.client_id,
  client_secret: googleOauthFile.web.client_secret,
  redirect_uris: googleOauthFile.web.redirect_uris,
  response_types: ["id_token"],
});

const facebookIssuer = await Issuer.discover(ProveedoresValidos.Facebook);

export const FacebookClient = new facebookIssuer.Client({
  client_id: "439209621904066",
  client_secret: "a80220f4060317dcfed1c224df5986d9",
  redirect_uris: ["http://localhost:3000/auth/facebook/callback"],
  response_types: ["id_token"],
});
