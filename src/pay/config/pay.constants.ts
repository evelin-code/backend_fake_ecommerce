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
    message: "La orden no se encontró.",
  },
  TRANSACTION_CREATION_FAILED: {
    status: 3,
    result: false,
    message: "Ocurrió un error al crear la transacción.",
  },
  REQUEST_ACCEPTANCE_TOKEN_FAILED: {
    status: 4,
    result: false,
    message: "Fallo al recuperar el token de aceptación.",
  },
  CARD_TOKENIZATION_FAILED: {
    status: 5,
    result: false,
    message: "Fallo al tokenizar la tarjeta de crédito.",
  },
  CREATE_GATEWAY_TRANSACTION_FAILED: {
    status: 6,
    result: false,
    message: "Fallo al crear la transacción en la pasarela.",
  },
  TRANSACTION_NOT_FOUND: {
    status: 7,
    result: false,
    message: "La transacción no se encontró.",
  },
  TRANSACTION_UPDATE_SUCCESS: {
    status: 8,
    result: true,
    message: "La transacción se actualizó correctamente.",
  },
  TRANSACTION_UPDATE_FAILED: {
    status: 9,
    result: false,
    message: "Error al actualizar la transacción.",
  },
  CARD_NUMBER_INVALID: {
    status: 10,
    result: false,
    message: "Número de tarjeta inválido. Debe ser un número de 16 dígitos.",
  },
  CVC_INVALID: {
    status: 11,
    result: false,
    message: "CVC inválido. Debe ser un número de 3 o 4 dígitos.",
  },
  EXP_MONTH_INVALID: {
    status: 12,
    result: false,
    message: "Mes de expiración inválido. Debe estar entre 01 y 12.",
  },
  EXP_YEAR_INVALID: {
    status: 13,
    result: false,
    message: "Año de expiración inválido. Debe ser un número de 2 o 4 dígitos.",
  },
  CARD_HOLDER_REQUIRED: {
    status: 14,
    result: false,
    message: "El nombre del titular de la tarjeta es requerido.",
  },
};

export const ErrorConstants = {
  VALIDATION_ERROR: {
    status: 422,
    result: false,
    message: 'Ocurrió un error de validación.',
  },
  CLIENT_ERROR: {
    status: 400,
    result: false,
    message: 'Ocurrió un error del cliente.',
  },
  SERVER_ERROR: {
    status: 500,
    result: false,
    message: 'Ocurrió un error en el servidor de la API de Wompi.',
  },
  NO_RESPONSE: {
    status: 503,
    result: false,
    message: 'No se recibió respuesta de la API de Wompi.',
  },
  REQUEST_SETUP_ERROR: {
    status: 500,
    result: false,
    message: 'Error al configurar la solicitud.',
  },
  CREATE_GATEWAY_TRANSACTION_FAILED: {
    status: 500,
    result: false,
    message: 'Error al crear la transacción.',
  },
};
