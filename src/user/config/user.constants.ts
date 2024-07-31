export const UserConstants = {
  USER_CREATED: (userId: number) => ({
    status: 1,
    result: true,
    id: userId,
    message: "El usuario se creó correctamente.",
  }),
  USER_EXISTS: (userId: number) => ({
    status: 2,
    result: true,
    id: userId,
    message: "El usuario ya existe en el sistema.",
  }),
  EMAIL_INVALID: {
    status: 3,
    result: false,
    message: "El email no es válido."
  },
  ERROR_OCCURRED: {
    status: 0,
    result: false,
    message: "Ocurrió un error."
  }
};