import { Product } from "@server/db/schema";
import { cliente } from "./clienteMP";
import { Preference, Payment } from "mercadopago";
import { addPurchase, aprovePurchase } from "../models/purchasesModel";

export const crearCompra = async (body: Array<Product>) => {
  //TODO MAKE CARRITO
  const preference = new Preference(cliente);

  const convertToNewProduct = (Product: Product) => {
    return {
      id: Product.id,
      title: Product.name,
      description: Product.description,
      quantity: 1, // default
      unit_price: parseFloat(Product.price),
    };
  };
  const convertProductArray = (Products: Array<Product>) => {
    if (!Array.isArray(Products)) {
      throw new Error("Products is not an array");
    }
    return Products.map(convertToNewProduct);
  };
  const purchaseId = await addPurchase(
    { user_id: "da", state: "pending" },
    body,
  ); // TODO get user_id

  const items = convertProductArray(body);
  const response = await preference.create({
    body: {
      items: items,
      external_reference: purchaseId, ///PURCHASE ID
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
    },
  });

  console.log(response);
  return {
    preferenceId: response.id, //SE USA PARA GENERAR COMPRA
    link: response.sandbox_init_point,
  };
};

export interface webhookMP {
  id: string;
  live_mode: string;
  type: string;
  action: string;
  data: { id: string };
}
export const resolverWebhook = async (body: webhookMP) => {
  const { id, live_mode, type, action, data } = body;
  console.log(data);
  console.log(JSON.stringify(body.data));
  console.log(`Entro Webhook` + JSON.stringify(body));
  console.log(`Entro Webhook` + data);
  console.log(`Entro Webhook` + data.id);
  console.log(`Entro Webhook` + id);
  if (action === "payment.created" && type === "payment") {
    const paymentId = data.id;

    console.log(
      `Webhook recibido: Pago creado con ID ${paymentId} en modo ${live_mode ? "producción" : "sandbox"}.`,
    );

    const pago = new Payment(cliente);
    const response = await pago.get({ id: paymentId });
    console.log(response);

    const preferenceExtId = response.external_reference;
    if (!preferenceExtId) {
      return {
        status: "error",
        message: "Referencia externa no encontrada",
      };
    }
    if (response.status == "approved") {
      aprovePurchase(preferenceExtId);
    }
    return {
      status: "success",
      message: `Webhook procesado correctamente para el pago ${paymentId}.`,
    };
  }

  return {
    status: "error",
    message: "Tipo de acción no soportado.",
  };
};
