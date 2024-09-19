import { MercadoPagoConfig } from "mercadopago";

export const cliente = new MercadoPagoConfig({
  accessToken:
    "APP_USR-7526583093473610-091723-79f313a1a5d78b1a813397f9b9e9a745-1994524719",
  options: {
    timeout: 5000,
    idempotencyKey: "fasasfasxzc",
    integratorId: "dev_24c65fb163bf11ea96500242ac130004",
    /* plataformId: string,
     
     corporationId: string */
  },
});
