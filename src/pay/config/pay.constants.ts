export const PayConstants = {
  TRANSACTION_CREATED: (transactionId: number, reference: string) => ({
    status: 1,
    result: true,
    idTransaction: transactionId,
    reference,
    message: "La transacción se creó correctamente.",
  }),
  ORDER_NOT_FOUND: {
    status: 2,
    result: false,
    message: "La orden no se encontró."
  },
  TRANSACTION_CREATION_FAILED: {
    status: 3,
    result: false,
    message: "Ocurrió un error al crear la transacción."
  }
};
