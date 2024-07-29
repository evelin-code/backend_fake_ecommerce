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
  }
};
