# 🧪 Guía de Testing con Postman

Esta guía te ayudará a probar todas las funcionalidades de la API usando Postman.

## 📋 Configuración Inicial

### 1. Configurar Variables de Entorno en Postman

Crea un entorno en Postman con estas variables:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `base_url` | `http://localhost:8080` | URL base del servidor |
| `token` | (vacío inicialmente) | Token JWT para autenticación |

### 2. Configurar Headers Globales

En la pestaña "Headers" de tu colección, agrega:
- `Content-Type: application/json`

## 🔐 Autenticación

### 1. Registro de Usuario

**Endpoint:** `POST {{base_url}}/api/sessions/register`

**Body (JSON):**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com",
      "age": 25,
      "role": "user",
      "_id": "...",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ Importante:** Copia el `token` de la respuesta y guárdalo en la variable `token` de Postman.

### 2. Login

**Endpoint:** `POST {{base_url}}/api/sessions/login`

**Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com",
      "age": 25,
      "role": "user",
      "_id": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Obtener Usuario Actual

**Endpoint:** `GET {{base_url}}/api/sessions/current`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario actual obtenido",
  "data": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "_id": "..."
  }
}
```

### 4. Cambiar Contraseña

**Endpoint:** `PUT {{base_url}}/api/sessions/change-password`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

### 5. Logout

**Endpoint:** `POST {{base_url}}/api/sessions/logout`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

## 👥 Gestión de Usuarios

### 1. Crear Usuario (Público)

**Endpoint:** `POST {{base_url}}/api/users`

**Body (JSON):**
```json
{
  "first_name": "María",
  "last_name": "García",
  "email": "maria@example.com",
  "age": 30,
  "password": "password123"
}
```

### 2. Obtener Mi Perfil

**Endpoint:** `GET {{base_url}}/api/users/profile`

**Headers:**
```
Authorization: Bearer {{token}}
```

### 3. Actualizar Mi Perfil

**Endpoint:** `PUT {{base_url}}/api/users/profile`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "first_name": "Juan Carlos",
  "last_name": "Pérez López",
  "age": 26
}
```

### 4. Obtener Usuario por ID

**Endpoint:** `GET {{base_url}}/api/users/{{user_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

### 5. Actualizar Usuario por ID

**Endpoint:** `PUT {{base_url}}/api/users/{{user_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "first_name": "María Elena",
  "age": 31
}
```

## 👑 Funciones de Administrador

### Crear Usuario Admin

Para probar las funciones de admin, primero necesitas crear un usuario con rol admin. Puedes hacerlo directamente en la base de datos o modificar temporalmente el código.

**Endpoint:** `GET {{base_url}}/api/users` (Solo Admin)

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Endpoint:** `DELETE {{base_url}}/api/users/{{user_id}}` (Solo Admin)

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

## 🧪 Casos de Prueba

### 1. Validaciones de Registro

**Email inválido:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "email-invalido",
  "age": 25,
  "password": "password123"
}
```

**Edad inválida:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 150,
  "password": "password123"
}
```

**Contraseña muy corta:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "123"
}
```

### 2. Autenticación Fallida

**Login con credenciales incorrectas:**
```json
{
  "email": "juan@example.com",
  "password": "password-incorrecta"
}
```

**Acceso sin token:**
Hacer cualquier request protegido sin el header `Authorization`.

### 3. Acceso No Autorizado

**Usuario normal intentando acceder a funciones de admin:**
```
GET {{base_url}}/api/users
Authorization: Bearer {{user_token}}
```

## 📊 Códigos de Respuesta

| Código | Significado |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado exitosamente |
| 400 | Error de validación |
| 401 | No autorizado |
| 403 | Prohibido (sin permisos) |
| 404 | No encontrado |
| 500 | Error del servidor |

## 🔧 Scripts de Postman

### Script para guardar automáticamente el token

En la pestaña "Tests" de las requests de login/registro, agrega:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.token) {
        pm.environment.set("token", response.data.token);
    }
}
```

### Script para verificar respuesta exitosa

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success true", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});
```

## 🚀 Colección Completa

Puedes importar esta colección completa en Postman:

```json
{
  "info": {
    "name": "Ecommerce Backend API",
    "description": "Colección completa para testing de la API"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8080"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

## 💡 Tips de Testing

1. **Orden de pruebas:** Siempre registra/login antes de probar rutas protegidas
2. **Tokens:** Los tokens expiran, si recibes 401, haz login nuevamente
3. **IDs:** Usa los IDs reales de la base de datos en las pruebas
4. **Limpieza:** Borra usuarios de prueba después de las pruebas
5. **Variables:** Usa variables de entorno para facilitar el cambio entre ambientes


