# Proyecto de Fake Ecommerce

Este proyecto es una simulación de un comercio electrónico que utiliza NestJS y TypeORM para gestionar distintos servicios. Está diseñado para demostrar cómo se pueden integrar estas tecnologías en un entorno de desarrollo real, utilizando PostgreSQL como sistema de gestión de bases de datos. Es ideal para desarrolladores que buscan aprender más sobre el desarrollo de aplicaciones del lado del servidor con NestJS y TypeORM.


## Herramientas Utilizadas

- **NestJS:** Elegido por su arquitectura modular y escalable, lo que facilita la organización del código y la gestión de dependencias en aplicaciones grandes.
- **TypeORM:** Utilizado para simplificar las interacciones con la base de datos PostgreSQL, ofreciendo un enfoque orientado a objetos para trabajar con los datos.
- **PostgreSQL:** Seleccionado por su robustez y flexibilidad como sistema de gestión de bases de datos relacional, ideal para proyectos que requieren alta disponibilidad y escalabilidad.

## Servicios

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