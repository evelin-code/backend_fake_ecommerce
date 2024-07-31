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
  },
  REQUEST_ACCEPTANCE_TOKEN_FAILED: {
    status: 4,
    result: false,
    message: "Fallo al recuperar el token de aceptación."
  },
  CARD_TOKENIZATION_FAILED: {
    status: 5,
    result: false,
    message: "Fallo al tokenizar la tarjeta de crédito."
  },
  CREATE_GATEWAY_TRANSACTION_FAILED: {
    status: 6,
    result: false,
    message: "Fallo al crear la transacción en la pasarela"
  }
};

export const ErrorConstants = {
  VALIDATION_ERROR: {
    status: 422,
    result: false,
    message: 'Validation error occurred',
  },
  CLIENT_ERROR: {
    status: 400,
    result: false,
    message: 'Client error occurred',
  },
  SERVER_ERROR: {
    status: 500,
    result: false,
    message: 'Server error occurred on Wompi API',
  },
  NO_RESPONSE: {
    status: 503,
    result: false,
    message: 'No response received from Wompi API',
  },
  REQUEST_SETUP_ERROR: {
    status: 500,
    result: false,
    message: 'Error setting up request',
  },
  CREATE_GATEWAY_TRANSACTION_FAILED: {
    status: 500,
    result: false,
    message: 'Error creating the transaction',
  },
};
