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
};
