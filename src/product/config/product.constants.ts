export const ProductConstants = {
  STOCK_FETCHED: (stock: number) => ({
    status: 1,
    result: true,
    stock,
    message: 'El stock del producto se recuperó correctamente.',
  }),
  PRODUCT_NOT_FOUND: {
    status: 2,
    result: false,
    message: 'El producto no se encontró.',
  },
  STOCK_FETCH_FAILED: {
    status: 3,
    result: false,
    message: 'No se pudo recuperar el stock del producto.',
  },
  OUT_OF_STOCK: (productIds: number[]) => ({
    status: 4,
    result: false,
    products: productIds,
    message: 'No hay stock de algunos productos.',
  }),
  TOTAL_CALCULATED: (total: number) => ({
    status: 5,
    result: true,
    total,
    message: 'El valor total se calculó correctamente.',
  }),
  CALCULATION_FAILED: {
    status: 6,
    result: false,
    message: 'No se pudo calcular el valor total.',
  },
  ORDER_NOT_FOUND: {
    status: 7,
    result: false,
    message: 'La orden no se encontró.',
  },
  ORDER_STATUS_NOT_VALID: {
    status: 8,
    result: false,
    message: 'El estado de la orden no es válido para actualizar el stock.',
  },
  STOCK_UPDATED: {
    status: 9,
    result: true,
    message: 'El stock de los productos se actualizó correctamente.',
  },
  STOCK_UPDATE_FAILED: {
    status: 10,
    result: false,
    message: 'No se pudo actualizar el stock de los productos.',
  },
};
