export const OrderConstants = {
  ORDER_CREATED: (orderId: number) => ({
    status: 1,
    result: true,
    id: orderId,
    message: "La orden se creó correctamente.",
  }),
  USER_NOT_FOUND: {
    status: 2,
    result: false,
    message: "El usuario no se encontró."
  },
  PRODUCT_NOT_FOUND: {
    status: 3,
    result: false,
    message: "El producto no se encontró."
  },
  OUT_OF_STOCK: {
    status: 4,
    result: false,
    message: "El producto está fuera de stock."
  },
  ORDER_CREATION_FAILED: {
    status: 5,
    result: false,
    message: "No se pudo crear la orden."
  }
};
