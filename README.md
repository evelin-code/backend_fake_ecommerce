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
- **200 OK**
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
- **email obligatorio**
  ```json
    {
      "email": "nuevo.usuario@example.com"
    }

**Respuestas:**
- **200 OK**
  ```json
  // Posible respuesta 1
  {
    "status": 1,
    "result": true,
    "id": 1,
    "message": "El usuario se creó correctamente."
  }

  // Posible respuesta 2
  {
    "status": 2,
    "result": true,
    "id": 1,
    "message": "El usuario ya existe en el sistema."
  }

  // Posible respuesta 3
  {
    "status": 3,
    "result": false,
    "message": "El email no es válido."
  }

  // Posible respuesta 4
  {
    "status": 0,
    "result": false,
    "message": "Ocurrió un error."
  }