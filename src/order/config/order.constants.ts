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
  OUT_OF_STOCK: (productIds: number[]) => ({
    status: 4,
    result: false,
    products: productIds,
    message: "No hay stock de los productos."
  }),
  ORDER_CREATION_FAILED: {
    status: 5,
    result: false,
    message: "No se pudo crear la orden."
  },
  ORDER_NOT_FOUND: {
    status: 6,
    result: false,
    message: "La orden no se encontró."
  },
  ORDER_UPDATED: (orderId: number) => ({
    status: 7,
    result: true,
    id: orderId,
    message: "El estado de la orden se actualizó correctamente."
  }),
  ORDER_UPDATE_FAILED: {
    status: 8,
    result: false,
    message: "No se pudo actualizar el estado de la orden."
  }
};
