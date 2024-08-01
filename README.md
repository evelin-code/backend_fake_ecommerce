# Proyecto de Fake Ecommerce

Este proyecto es una simulación de un comercio electrónico que utiliza NestJS y TypeORM para gestionar distintos servicios. Está diseñado para demostrar cómo se pueden integrar estas tecnologías en un entorno de desarrollo real, utilizando Supabase como plataforma de gestión de bases de datos PostgreSQL. Es ideal para desarrolladores que buscan aprender más sobre el desarrollo de aplicaciones del lado del servidor con NestJS y TypeORM.


## Índice

1. [Herramientas Utilizadas](#Herramientas-Utilizadas)
2. [Uso de la API](#Uso-de-la-API)
3. [Pruebas](#Pruebas)
4. [Despliegue](#Despliegue)
5. [Recursos Adicionales](#Recursos-Adicionales)

## Herramientas Utilizadas

- **NestJS:** Elegido por su arquitectura modular y escalable, lo que facilita la organización del código y la gestión de dependencias en aplicaciones grandes.
- **TypeORM:** Utilizado para simplificar las interacciones con la base de datos PostgreSQL, ofreciendo un enfoque orientado a objetos para trabajar con los datos.
- **PostgreSQL:** Seleccionado por su robustez y flexibilidad como sistema de gestión de bases de datos relacional, ideal para proyectos que requieren alta disponibilidad y escalabilidad.
- **Supabase:** Utilizado como plataforma de backend para gestionar la base de datos PostgreSQL, proporcionando una interfaz moderna y fácil de usar para la administración de datos, autenticación y almacenamiento en tiempo real.

## Uso de la API

Este proyecto ofrece varios servicios RESTful para gestionar usuarios, ordenes, productos y pagos. A continuación, se detallan estos servicios, incluyendo sus URLs, métodos HTTP, descripciones y posibles respuestas.

### Obtener Todos los Usuarios

**URL:** `/user`  
**Método HTTP:** `GET`  
**Descripción:** Obtiene una lista de todos los usuarios registrados.

**Respuestas:**
- **200 code http**
  ```json
  [
    {
      "id": 1,
      "email": "usuario1@example.com",
      "created_at": "2024-07-30T12:34:56Z"
    },
    {
      "id": 2,
      "email": "usuario2@example.com",
      "created_at": "2024-07-30T12:34:56Z"
    }
  ]

### Crear un Nuevo Usuario

**URL:** `/user`  
**Método HTTP:** `POST`  
**Descripción:** Crea un nuevo usuario con el correo electrónico proporcionado.

**Body:**
- **json**
  ```json
    {
      "email": "nuevo.usuario@example.com"
    }

**Respuestas:**

- **200 code http**
  ```json
  {
    "status": 1,
    "result": true,
    "id": 1,
    "message": "El usuario se creó correctamente."
  }

- **200 code http**
  ```json
  {
    "status": 2,
    "result": true,
    "id": 1,
    "message": "El usuario ya existe en el sistema."
  }

- **200 code http**
  ```json
  {
    "status": 3,
    "result": false,
    "message": "El email no es válido."
  }

- **200 code http**
  ```json
  {
    "status": 0,
    "result": false,
    "message": "Ocurrió un error."
  }


### Obtener Todos los Productos

**URL:** `/product`  
**Método HTTP:** `GET`  
**Descripción:** Obtiene una lista de todos los productos registrados.

**Respuestas:**
- **200 code http**
  ```json
  [
    {
      "id": 1,
      "name": "Producto 1",
      "description": "Producto 1",
      "stock": 40,
      "url_img": "url",
      "price": "600000.00"
    },
    {
      "id": 2,
      "name": "Producto 2",
      "description": "producto 2",
      "stock": 22,
      "url_img": "url",
      "price": "45600.00"
    }
  ]


### Obtener el Stock de un Producto

**URL:** `/product/{idProduct}/stock`  
**Método HTTP:** `GET`  
**Descripción:** Obtiene el stock de un producto en particular.

**Respuestas:**
- **200 code http**
  ```json
  {
    "status": 1,
    "result": true,
    "stock": 43,
    "message": "El stock del producto se recuperó correctamente."
  }

- **200 code http**
  ```json
  {
    "status": 2,
    "result": false,
    "message": "El producto no se encontró."
  }

- **200 code http**
  ```json
  {
    "status": 3,
    "result": false,
    "message": "No se pudo recuperar el stock del producto.",
  }


### Obtener el Subtotal

**URL:** `/product/calculate`  
**Método HTTP:** `POST`  
**Descripción:** Obtiene el subtotal de una lista predeterminada de productos (calcula el subtotal).

**Body:**
- **json**
  ```json
  {
    "items": [
      {
        "productId": 1,
        "quantity": 1
      },
      {
        "productId": 2,
        "quantity": 1
      }
    ]
  }

**Respuestas:**
- **200 code http**
  ```json
  {
    "status": 5,
    "result": true,
    "total": 2445600,
    "message": "El valor total se calculó correctamente."
  }

- **200 code http**
  ```json
  {
    "status": 4,
    "result": false,
    "products": [
      1
    ],
    "message": "No hay stock de algunos productos."
  }

- **200 code http**
  ```json
  {
    "status": 2,
    "result": false,
    "message": "El producto no se encontró."
  }

- **200 code http**
  ```json
  {
    "status": 6,
    "result": false,
    "message": "No se pudo calcular el valor total.",
  }


### Crear una Orden de Compra

**URL:** `/order`  
**Método HTTP:** `POST`  
**Descripción:** Crea una nueva orden de compra con la lista de productos proporcionada.

**Body:**
- **json**
  ```json
  {
    "user_id": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 1
      },
      {
        "productId": 2,
        "quantity": 1
      }
    ]
  }

**Respuestas:**

- **200 code http**
  ```json
  {
    "status": 1,
    "result": true,
    "id": 2,
    "message": "La orden se creó correctamente."
  }

- **200 code http**
  ```json
  {
    "status": 2,
    "result": false,
    "message": "El usuario no se encontró."
  }

- **200 code http**
  ```json
  {
    "status": 5,
    "result": false,
    "message": "No se pudo crear la orden."
  }


### Actualizar estado de la Orden

**URL:** `/order/{idOrder}/status`  
**Método HTTP:** `PATCH`  
**Descripción:** Actualiza el estado de la orden a Pagado.

**Respuestas:**

- **200 code http**
  ```json
  {
    "status": 7,
    "result": true,
    "id": 2,
    "message": "El estado de la orden se actualizó correctamente."
  }

- **200 code http**
  ```json
  {
    "status": 10,
    "result": false,
    "message": "El estado de la transacción no es válido para actualizar la orden."
  }

- **200 code http**
  ```json
  {
    "status": 9,
    "result": false,
    "message": "La transacción no se encontró."
  }

- **200 code http**
  ```json
  {
    "status": 6,
    "result": false,
    "message": "La orden no se encontró."
  }

- **200 code http**
  ```json
  {
    "status": 8,
    "result": false,
    "message": "No se pudo actualizar el estado de la orden."
  }


### Crear una transacción

**URL:** `/pay/createTransaction/{idOrder}`  
**Método HTTP:** `POST`  
**Descripción:** Crea una nueva transacción de una orden.

**Respuestas:**

- **200 code http**
  ```json
  {
    "status": 1,
    "result": true,
    "idTransaction": 1,
    "reference": "1",
    "message": "La transacción se creó correctamente."
  }

- **200 code http**
  ```json
  {
    "status": 2,
    "result": false,
    "message": "La orden no se encontró."
  }

- **200 code http**
  ```json
  {
    "status": 3,
    "result": false,
    "message": "Ocurrió un error al crear la transacción."
  }


### Obtener Token de Aceptación por Parte de la Pasarela

**URL:** `/pay/getAcceptanceToken`  
**Método HTTP:** `GET`  
**Descripción:** Obtiene un token de aceptación válido para el proceso de pago con la pasarela.

**Respuestas:**

- **200 code http**
  ```json
  {
    "acceptance_token": "token-example",
    "permalink": "url-pdf"
  }

- **200 code http**
  ```json
  {
    "status": 4,
    "result": false,
    "message": "Fallo al recuperar el token de aceptación."
  }

### Obtener Tokenización de la Tarjeta de Crédito

**URL:** `/pay/tokenizeCard`  
**Método HTTP:** `POST`  
**Descripción:** Obtiene la tokenización de la tarjeta de crédito para el proceso de pago con la pasarela.

**Body:**
- **json**
  ```json
  {
    "number": "4242424242424242",
    "cvc": "123",
    "exp_month": "08",
    "exp_year": "28",
    "card_holder": "José Pérez"
  }

**Respuestas:**
- **200 code http**
  ```json
  {
    "id": "token-example"
  }

- **200 code http**
  ```json
  {
    "status": 10,
    "result": false,
    "message": "Número de tarjeta inválido. Debe ser un número de 16 dígitos."
  }

- **200 code http**
  ```json
  {
    "status": 11,
    "result": false,
    "message": "CVC inválido. Debe ser un número de 3 o 4 dígitos."
  }

- **200 code http**
  ```json
  {
    "status": 12,
    "result": false,
    "message": "Mes de expiración inválido. Debe estar entre 01 y 12."
  }

- **200 code http**
  ```json
  {
    "status": 13,
    "result": false,
    "message": "Año de expiración inválido. Debe ser un número de 2 o 4 dígitos."
  }

- **200 code http**
  ```json
  {
    "status": 14,
    "result": false,
    "message": "El nombre del titular de la tarjeta es requerido."
  }

### Crear Transacción en la Pasarela.

**URL:** `/pay/createGatewayTransaction`  
**Método HTTP:** `POST`  
**Descripción:** Crea la transacción en la pasarela.

**Body:**
- **json**
  ```json
  {
    "reference": "referencia",
    "installments": 2,
    "acceptance_token": "token-example",
    "id_tokenizacion": "token-example"
  }

**Respuestas:**
- **200 code http**
  ```json
  {
    "id": "15113-1722447534-72768"
  }

- **200 code http**
  ```json
  {
    "status": 422,
    "result": false,
    "message": "Validation error occurred",
    "details": {
      "reference": [
        "La referencia ya ha sido usada"
      ]
    }
  }

### Consultar Transacción a la Pasarela.

**URL:** `/pay/details`  
**Método HTTP:** `POST`  
**Descripción:** Consulta los detalles de la transacción a la pasarela.

**Body:**
- **json**
  ```json
  {
    "idTransaction": "1"
  }

**Respuestas:**
- **200 code http**
  ```json
  {
    "reference": "reference-example",
    "type": "CARD",
    "finalized_at": "2024-07-31T20:00:42.296Z",
    "brand": "VISA",
    "id": "15-15",
    "status": "APPROVED"
  }

- **200 code http**
  ```json
  {
    "status": "PENDING",
  }

### Actualizar los Detalles de la Transacción.

**URL:** `/pay/updateTransaction`  
**Método HTTP:** `POST`  
**Descripción:** Actualiza los detalles de la transacción en la base de datos.

**Body:**
- **json**
  ```json
  {
    "reference": "reference-example",
    "type": "CARD",
    "finalized_at": "2024-07-31T20:00:42.296Z",
    "brand": "VISA",
    "id": "15-15",
    "status": "APPROVED"
  }

**Respuestas:**
- **200 code http**
  ```json
  {
    "status": 8,
    "result": true,
    "message": "La transacción se actualizó correctamente."
  }

- **200 code http**
  ```json
  {
    "status": 9,
    "result": false,
    "message": "Error al actualizar la transacción."
  }

## Pruebas

Los resultados de las pruebas para el proyecto son los siguientes:

### Resultados de Pruebas por Archivo

- **src/order/test/order.service.spec.ts**: PASS (6.334 s)
- **src/product/test/product.service.spec.ts**: PASS (6.378 s)
- **src/user/test/user.service.spec.ts**: PASS (6.595 s)
- **src/order/test/order.controller.spec.ts**: PASS
- **src/user/test/user.controller.spec.ts**: PASS
- **src/pay/test/pay.service.spec.ts**: PASS (7.239 s)
- **src/pay/test/pay.controller.spec.ts**: PASS (7.229 s)
- **src/product/test/product.controller.spec.ts**: PASS

### Resumen de Pruebas

- **Test Suites:** 8 pasados, 8 totales
- **Tests:** 46 pasados, 46 totales
- **Snapshots:** 0 totales
- **Tiempo Total de Ejecución:** 7.714 s (estimado: 8 s)
- **Resultado:** Todas las pruebas se han ejecutado exitosamente y no se han encontrado errores.

## Despliegue

El proyecto ha sido desplegado utilizando [Railway](https://railway.app/).

### URL Pública

- **Backend:** [https://nombre-de-tu-backend.railway.app](https://nombre-de-tu-backend.railway.app)


## Recursos Adicionales

- **Colección Postman**: [Visitar](https://drive.google.com/file/d/1s9RGMTpb7_uLijmRVZsfocgkGjoxVOxO/view?usp=sharing)

- **Esquema de la base de datos**: [Visitar](https://drive.google.com/file/d/1nFAC-Cj6drLDHzSnZuGsTVeJNONqun0p/view?usp=sharing)
