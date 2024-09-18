import { Issuer } from "openid-client";

enum ProveedoresValidos {
  Google = "https://accounts.google.com",
}

const googleOauthFile = await Bun.file("clienteGoogle.json").json();

const issuer = await Issuer.discover(ProveedoresValidos.Google);

export const GoogleClient = new issuer.Client({
  client_id: googleOauthFile.web.client_id,
  client_secret: googleOauthFile.web.client_secret,
  redirect_uris: googleOauthFile.web.redirect_uris,
  response_types: ["id_token"],
});
