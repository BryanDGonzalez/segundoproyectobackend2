# Ecommerce Backend - Sistema Completo

Backend profesional para proyecto de ecommerce con arquitectura limpia, autenticación JWT, sistema de compras y recuperación de contraseña.

## 🚀 Funcionalidades

### Entrega N°1
- ✅ Modelo de Usuario completo (User)
- ✅ Encriptación de contraseña con bcrypt.hashSync
- ✅ Estrategias de Passport (local, JWT, current)
- ✅ Login con JWT (cookie HTTPOnly + JSON)
- ✅ Ruta /api/sessions/current
- ✅ CRUD completo de Usuarios

### Entrega Final
- ✅ Arquitectura profesional (DAO, DTO, Repository, Services, Controllers)
- ✅ Patrón Repository implementado
- ✅ DTOs para evitar información sensible
- ✅ Sistema de recuperación de contraseña con mailing
- ✅ Middleware de autorización por roles
- ✅ Lógica robusta de compra con Tickets
- ✅ Validación de stock
- ✅ Manejo de compras completas/incompletas

## 🛠️ Tecnologías

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** + **Passport.js** (local, JWT, current)
- **bcrypt** para contraseñas (hashSync/compareSync)
- **nodemailer** para envío de correos
- **Arquitectura limpia** con separación de capas

## 📁 Estructura del Proyecto

```
PrimerProyectoBackendll/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de MongoDB
│   │   └── passport.js          # Estrategias de Passport (local, JWT, current)
│   ├── dao/                     # Data Access Object (acceso a datos)
│   │   ├── userDAO.js
│   │   ├── productDAO.js
│   │   ├── cartDAO.js
│   │   └── ticketDAO.js
│   ├── dto/                     # Data Transfer Object (transferencia de datos)
│   │   ├── userDTO.js
│   │   ├── productDTO.js
│   │   ├── cartDTO.js
│   │   └── ticketDTO.js
│   ├── repository/              # Patrón Repository (lógica de acceso)
│   │   ├── userRepository.js
│   │   ├── productRepository.js
│   │   ├── cartRepository.js
│   │   └── ticketRepository.js
│   ├── services/                # Lógica de negocio
│   │   ├── userService.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   └── ticketService.js
│   ├── controllers/             # Controladores (manejo de requests)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── ticketController.js
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticación
│   │   └── authorization.js     # Middleware de autorización por roles
│   ├── models/                  # Modelos de Mongoose
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Ticket.js
│   ├── routes/                  # Rutas de la API
│   │   ├── sessionRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── ticketRoutes.js
│   │   └── purchaseRoutes.js
│   ├── utils/                   # Utilidades
│   │   ├── jwtUtils.js
│   │   ├── passwordUtils.js
│   │   ├── responseUtils.js
│   │   └── mailer.js
│   └── app.js                   # Configuración de Express
├── config.env                   # Variables de entorno
├── .env.example                 # Ejemplo de variables de entorno
├── package.json                 # Dependencias del proyecto
├── server.js                    # Punto de entrada
├── POSTMAN_TESTING.md           # Guía de testing
└── README.md                    # Este archivo
```

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd PrimerProyectoBackendll
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Copia `config.env` y ajusta los valores:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=24h
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Configuración de correo (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
```

**Nota para Gmail:** Necesitas crear una [contraseña de aplicación](https://myaccount.google.com/apppasswords)

4. **Iniciar MongoDB**
Asegúrate de que MongoDB esté corriendo en tu sistema.

5. **Ejecutar servidor**
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:8080`

## 📚 API Endpoints

### 🔐 Autenticación (`/api/sessions`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/register` | Registrar nuevo usuario | ❌ |
| POST | `/login` | Iniciar sesión | ❌ |
| GET | `/current` | Obtener usuario actual | ✅ |
| POST | `/logout` | Cerrar sesión | ✅ |
| POST | `/request-password-reset` | Solicitar recuperación de contraseña | ❌ |
| POST | `/reset-password` | Resetear contraseña con token | ❌ |

### 👥 Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Autenticación | Rol |
|--------|----------|-------------|---------------|-----|
| POST | `/` | Crear usuario | ❌ | - |
| GET | `/` | Listar usuarios | ✅ | admin |
| GET | `/:id` | Obtener usuario | ✅ | owner/admin |
| PUT | `/:id` | Actualizar usuario | ✅ | owner/admin |
| DELETE | `/:id` | Eliminar usuario | ✅ | admin |
| PUT | `/:id/password` | Cambiar contraseña | ✅ | owner/admin |

### 📦 Productos (`/api/products`)

| Método | Endpoint | Descripción | Autenticación | Rol |
|--------|----------|-------------|---------------|-----|
| GET | `/` | Listar productos (paginado) | ❌ | - |
| GET | `/:id` | Obtener producto | ❌ | - |
| POST | `/` | Crear producto | ✅ | admin/premium |
| PUT | `/:id` | Actualizar producto | ✅ | owner/admin |
| DELETE | `/:id` | Eliminar producto | ✅ | owner/admin |

**Query params para GET `/`:**
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 10)
- `category`: Filtrar por categoría
- `status`: Filtrar por estado (true/false)
- `sort`: Campo para ordenar

### 🛒 Carritos (`/api/carts`)

| Método | Endpoint | Descripción | Autenticación | Rol |
|--------|----------|-------------|---------------|-----|
| GET | `/` | Obtener mi carrito | ✅ | user |
| POST | `/products/:pid` | Agregar producto | ✅ | user |
| PUT | `/products/:pid` | Actualizar cantidad | ✅ | user |
| DELETE | `/products/:pid` | Eliminar producto | ✅ | user |
| DELETE | `/` | Vaciar carrito | ✅ | user |

### 🎫 Tickets (`/api/tickets`)

| Método | Endpoint | Descripción | Autenticación | Rol |
|--------|----------|-------------|---------------|-----|
| GET | `/` | Obtener tickets | ✅ | user/admin |
| GET | `/:id` | Obtener ticket por ID | ✅ | user/admin |

### 💳 Compras (`/api/carts`)

| Método | Endpoint | Descripción | Autenticación | Rol |
|--------|----------|-------------|---------------|-----|
| POST | `/purchase` | Procesar compra | ✅ | user |

## 🔒 Seguridad y Autorización

### Roles
- **user**: Usuario normal (puede comprar, usar carrito)
- **admin**: Administrador (acceso completo)
- **premium**: Usuario premium (puede crear productos)

### Middleware de Autorización

- `authenticateJWT`: Verifica token JWT
- `validateCurrentUser`: Valida usuario actual (estrategia "current")
- `requireAdmin`: Solo admin
- `requireAdminOrPremium`: Admin o premium
- `requireOwnershipOrAdmin`: Propietario o admin

### Reglas de Negocio

1. **Productos:**
   - Solo admin/premium pueden crear productos
   - Solo el owner o admin pueden editar/eliminar

2. **Carritos:**
   - Solo usuarios autenticados pueden usar carritos
   - Cada usuario tiene su propio carrito

3. **Compras:**
   - Se valida stock antes de procesar
   - Se generan tickets para productos disponibles
   - Productos sin stock quedan en el carrito

## 🔑 Sistema de Recuperación de Contraseña

1. Usuario solicita recuperación: `POST /api/sessions/request-password-reset`
2. Se envía correo con link (válido por 1 hora)
3. Usuario hace clic en link y resetea: `POST /api/sessions/reset-password`
4. Validaciones:
   - Token válido y no expirado
   - Nueva contraseña diferente a la anterior
   - Contraseña cumple requisitos de seguridad

## 🧪 Testing

Para probar la API, consulta el archivo `POSTMAN_TESTING.md` con ejemplos detallados.

### Ejemplo de uso con cURL:

**Registro:**
```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Obtener usuario actual:**
```bash
curl -X GET http://localhost:8080/api/sessions/current \
  -H "Authorization: Bearer <tu_token>"
```

## 📝 Notas Importantes

1. **Variables de entorno:** Nunca subas `config.env` a GitHub. Usa `.env.example` como plantilla.

2. **JWT Token:** Se envía tanto en cookie HTTPOnly como en la respuesta JSON.

3. **Contraseñas:** Se encriptan con `bcrypt.hashSync` antes de guardar.

4. **Stock:** Se valida antes de cada compra. Los productos sin stock quedan en el carrito.

5. **Tickets:** Se generan con código único automático.

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura limpia** con separación de responsabilidades:

1. **DAO (Data Access Object):** Acceso directo a la base de datos
2. **DTO (Data Transfer Object):** Formato de datos para transferencia
3. **Repository:** Abstracción del acceso a datos
4. **Service:** Lógica de negocio
5. **Controller:** Manejo de requests/responses
6. **Routes:** Definición de endpoints

Esta estructura permite:
- ✅ Fácil mantenimiento
- ✅ Testeo unitario
- ✅ Escalabilidad
- ✅ Reutilización de código


