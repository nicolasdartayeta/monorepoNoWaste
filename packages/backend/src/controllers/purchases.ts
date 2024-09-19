import { Elysia, t } from "elysia";
import { crearCompra, resolverWebhook } from "../services/purchasesServices";
import { productDTO } from "../types";
export const purchasesController = new Elysia({ prefix: "/purchases" })
  .post(
    "/",
    async ({ body }) => {
      return await crearCompra(body);
    },
    {
      body: t.Array(productDTO),
    },
  )
  .post(
    "/webhook",
    async ({ body }) => {
      return await resolverWebhook(body);
    },
    {
      body: t.Object(
        {
          id: t.String(),
          live_mode: t.String(),
          type: t.String(),
          action: t.String(),
          data: t.Object({ id: t.String() }),
        },
        {
          description: "Expected MercadoPago WebHook",
        },
      ),
    },
  );

/*  async function crearCompra(body : BodyType ) {
   const preference = new Preference(cliente);

   const response = await preference.create({
     body: {
       items: [
         {
           //body.items
           id: "1234",
           title: "Mi producto",
           description: "Dispositivo de tienda móvil de comercio electrónico",
           quantity: 1,
           unit_price: 1,
         },
       ],
       payment_methods: {
         excluded_payment_types: [],
         excluded_payment_methods: [
           {
             id: "visa",
           },
         ],
         installments: 6,
         default_installments: 1,
       },
       back_urls: {
         success: "http:test.com/success",
         failure: "http:test.com/failure",
         pending: "http:test.com/pending",
       },
       external_reference: "ORDEN-TEST",
     },
   });

   console.log("hola" + JSON.stringify(responses));
   return {
     preferenceId: response.id,
   };
 } */
/* async function resolverWebhook(body){
     const { id, live_mode, type, date_created, user_id, api_version, action, data } = body;
     console.log(data);
     console.log(JSON.stringify(body.data));
     console.log(`Entro Webhook` + JSON.stringify(body));
     console.log(`Entro Webhook` + data);
     console.log(`Entro Webhook` + data.id);
     console.log(`Entro Webhook` + id);
     if (action === 'payment.created' && type === 'payment') {
       const paymentId = data.id;


       console.log(`Webhook recibido: Pago creado con ID ${paymentId} en modo ${live_mode ? 'producción' : 'sandbox'}.`);

       const pago = new Payment(cliente);
       const response = await pago.get({id: paymentId});
       console.log(response);
       // Access the 'items' array
        const items = response.additional_info.items;

        // Iterate over the items or log them
        items.forEach(item => {
          console.log(`ID: ${item.id}`);
          console.log(`Title: ${item.title}`);
          console.log(`Description: ${item.description}`);
          console.log(`Quantity: ${item.quantity}`);
          console.log(`Unit Price: ${item.unit_price}`);
        });
       return {
         status: 'success',
         message: `Webhook procesado correctamente para el pago ${paymentId}.`
       };
    }

     return {
       status: 'error',
       message: 'Tipo de acción no soportado.'
     };
 }  */
