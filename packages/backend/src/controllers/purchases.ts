// import { Elysia, t } from "elysia";
// import { Product } from "../../db/schema";
// import { addUser, getAllUsers } from "../models/userFunctions";
// import { productInsertDTO, userInsertDTO } from "@server/src/types";
// import { Preference } from "mercadopago";
// import { cliente } from "../services/clienteMP";
// import { Static } from "@sinclair/typebox";

// export const purchasesController = new Elysia({ prefix: "/purchases" })
//   .post(
//     "/",
//     async ({ body }) => {
//       return await crearCompra(body);
//     } /* ,
//     {
//       body: bodySchema
//     }, */,
//   )
//   /* .post("/webhook", async ({ body}) => {resolverWebhook(body)},{
//     body: t.Object(
//       {
//         id: t.String(),
//         live_mode: t.String(),
//         type: t.String(),
//         date_created: t.String(),
//         user_id: t.String(),
//         api_version: t.String(),
//         action: t.String(),
//         data: t.String(),
//       },
//       {
//         description: "Expected MercadoPago WebHook",
//       },
//     ),}) */
//   .get("/$id", () => {});

// // Definir el esquema para el cuerpo del request (body)
// const bodySchema = t.Object({
//   items: t.Array(productInsertDTO),
// });
// // Generar y exportar el tipo a partir del esquema usando `Static`
// type BodyType = Static<typeof bodySchema>;

// async function crearCompra(body /* : BodyType */) {
//   const preference = new Preference(cliente);

//   const response = await preference.create({
//     body: {
//       items: [
//         {
//           //body.items
//           id: "1234",
//           title: "Mi producto",
//           description: "Dispositivo de tienda móvil de comercio electrónico",
//           quantity: 1,
//           unit_price: 1,
//         },
//       ],
//       payment_methods: {
//         excluded_payment_types: [],
//         excluded_payment_methods: [
//           {
//             id: "visa",
//           },
//         ],
//         installments: 6,
//         default_installments: 1,
//       },
//       back_urls: {
//         success: "http://test.com/success",
//         failure: "http://test.com/failure",
//         pending: "http://test.com/pending",
//       },
//       external_reference: "ORDEN-TEST",
//     },
//   });

//   console.log("hola" + JSON.stringify(response));
//   return {
//     preferenceId: response.id,
//   };
// }
// /* function resolverWebhook(body){
//     const { id, live_mode, type, date_created, user_id, api_version, action, data } = body;
//     console.log(`Entro Webhook` + body.data);
//     console.log(`Entro Webhook` + data);
//     console.log(`Entro Webhook` + data.id);
//     console.log(`Entro Webhook` + id);
//     // Asegurarse de que es un evento de pago creado
//     if (action === 'payment.created' && type === 'payment') {
//       const paymentId = data.id;

//       // Aquí puedes realizar acciones como consultar el pago en la API de MercadoPago
//       // o actualizar el estado de tu base de datos según el ID del pago.

//       console.log(`Webhook recibido: Pago creado con ID ${paymentId} en modo ${live_mode ? 'producción' : 'sandbox'}.`);

//       // Realiza cualquier lógica adicional que necesites

//       return {
//         status: 'success',
//         message: `Webhook procesado correctamente para el pago ${paymentId}.`
//       };
//     }

//     return {
//       status: 'error',
//       message: 'Tipo de acción no soportado.'
//     };
// } */
