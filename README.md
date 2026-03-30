# Chat App con WebSockets - Backend & Frontend

Aplicación de chat en tiempo real que permite la comunicación entre usuarios conectados, con gestión de estado global de conexiones y broadcasting automático de listas de usuarios.

## 🚀 Características

- ✅ **Chat en tiempo real** con Socket.io
- ✅ **Gestión de estado global** de conexiones de usuarios
- ✅ **Broadcasting automático** de listas de usuarios conectados
- ✅ **Sincronización reactiva** entre backend y frontend
- ✅ **API REST** completa con documentación Swagger
- ✅ **Autenticación JWT** y validación con Joi
- ✅ **Base de datos MongoDB** con Mongoose
- ✅ **Arquitectura modular** (MVC + Services)

## 🛠️ Tecnologías Utilizadas

### Backend (Node.js/TypeScript)
- **Express.js** - Framework web
- **Socket.io** - Comunicación en tiempo real
- **MongoDB + Mongoose** - Base de datos
- **JWT** - Autenticación
- **Joi** - Validación de datos
- **Swagger** - Documentación API
- **TypeScript** - Tipado fuerte

### Frontend (Angular)
- **Angular 21** - Framework SPA
- **Socket.io-client** - Cliente WebSocket
- **RxJS** - Programación reactiva
- **TypeScript** - Tipado fuerte

## 🏗️ Arquitectura

```
📁 Backend_Websockets- (Node.js/TypeScript)
├── 📁 src/
│   ├── 📁 config/          # Configuración
│   ├── 📁 controllers/     # Controladores REST
│   ├── 📁 models/          # Modelos MongoDB
│   ├── 📁 routes/          # Rutas API
│   ├── 📁 services/        # Lógica de negocio
│   │   ├── 📄 ConnectionManager.ts  # 👈 GESTIÓN ESTADO GLOBAL
│   │   └── 📄 Mensaje.ts            # 👈 BROADCASTING
│   ├── 📁 middleware/      # Middlewares
│   ├── 📁 utils/           # Utilidades
│   └── 📄 server.ts        # Punto de entrada
└── 📄 package.json

📁 EA_Sem7_Socket (Angular)
├── 📁 src/app/
│   ├── 📁 models/
│   │   └── 📄 UserConnection.ts     # 👈 MODELOS CONEXIONES
│   ├── 📁 services/
│   │   ├── 📄 chat.ts               # 👈 SOCKET CLIENTE
│   │   └── 📄 connection-state.ts   # 👈 ESTADO REACTIVO
│   └── 📁 components/     # Componentes UI
└── 📄 package.json
```

## 📋 Requisitos Previos

- **Node.js** >= 16.0.0
- **MongoDB** >= 4.0
- **npm** >= 8.0.0
- **Angular CLI** >= 21.0.0

## 🚀 Instalación y Configuración

### 1. Clonar y configurar Backend

```bash
# Instalar dependencias
cd Backend_Websockets-
npm install

# Variables de entorno (.env)
MONGO_URI=mongodb://localhost:27017/chatdb
SERVER_PORT=1337
JWT_SECRET=your-secret-key
```

### 2. Configurar Frontend

```bash
# Instalar dependencias
cd EA_Sem7_Socket
npm install
```

### 3. Iniciar servicios

```bash
# Terminal 1: Backend
cd Backend_Websockets-
npm run dev  # o npm start

# Terminal 2: Frontend
cd EA_Sem7_Socket
ng serve
```

## 📖 Uso

### Conexión de Usuario

```typescript
// En componente Angular
constructor(private chatService: Chat) {}

ngOnInit() {
  // Conectar usuario
  this.chatService.conectarUsuario(
    'user-123',
    'Juan Pérez',
    'juan@email.com',
    'org-001'
  );

  // Observar usuarios conectados
  this.chatService.onUsersListUpdated().subscribe(data => {
    console.log('Usuarios conectados:', data.usuarios);
    console.log('Total:', data.total);
  });
}
```

### Envío de Mensajes

```typescript
// Enviar mensaje
this.chatService.sendMessage({
  usuario: 'user-123',
  organizacion: 'org-001',
  contenido: 'Hola a todos!'
});

// Escuchar mensajes entrantes
this.chatService.getMessages().subscribe(mensaje => {
  console.log('Nuevo mensaje:', mensaje);
});
```

## 🔌 API REST Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api` | Documentación Swagger |
| GET | `/organizaciones` | Listar organizaciones |
| POST | `/organizaciones` | Crear organización |
| GET | `/usuarios` | Listar usuarios |
| POST | `/usuarios` | Crear usuario |
| GET | `/mensajes` | Listar mensajes |
| POST | `/mensajes` | Crear mensaje |

## 📡 Eventos Socket.io

### Eventos Emitidos por Cliente

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `user-connect` | `{usuarioId, nombre, email, organizacion}` | Usuario se conecta |
| `message` | `{usuario, organizacion, contenido}` | Enviar mensaje |
| `typing` | `{usuario}` | Usuario escribiendo |
| `stop-typing` | `{usuario}` | Usuario dejó de escribir |
| `request-users-list` | - | Solicitar lista usuarios |

### Eventos Emitidos por Servidor

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `users-list-updated` | `{usuarios[], total, timestamp}` | Lista actualizada |
| `message` | `Mensaje` | Nuevo mensaje recibido |
| `user-typing` | `{usuario}` | Usuario escribiendo |
| `user-stop-typing` | `{usuario}` | Usuario dejó de escribir |

## 🔄 Gestión de Estado Global

### ConnectionManager (Backend)

```typescript
// Gestión automática de conexiones
const connectionManager = new ConnectionManager();

// Al conectar usuario
connectionManager.agregarUsuario(socketId, usuarioId, nombre, email, org);

// Al desconectar
connectionManager.eliminarUsuario(socketId);

// Broadcasting automático
io.emit('users-list-updated', {
  usuarios: connectionManager.obtenerTodos(),
  total: connectionManager.obtenerTotal(),
  timestamp: new Date()
});
```

### ConnectionStateService (Frontend)

```typescript
// Estado reactivo con RxJS
private usuariosConectadosSubject = new BehaviorSubject<UserConnection[]>([]);
public usuariosConectados$ = this.usuariosConectadosSubject.asObservable();

// Actualización automática desde sockets
this.socket.on('users-list-updated', (data) => {
  this.connectionStateService.actualizarUsuariosConectados(data);
});
```

## 🤖 Soporte con IA

Este proyecto ha sido desarrollado con el apoyo de **GitHub Copilot** y **Google Gemini** para guiarme y ara arreglar el codigo ( no he conseguido arreglarlo)


## 📝 Scripts Disponibles

### Backend
```bash
npm start      # Iniciar servidor producción
npm run dev    # Iniciar con nodemon (desarrollo)
npm run build  # Compilar TypeScript
```

### Frontend
```bash
ng serve       # Servidor desarrollo
ng build       # Build producción
ng test        # Ejecutar tests
```

## 🔧 Configuración Avanzada

### Variables de Entorno (.env)

```env
# Base de datos
MONGO_URI=mongodb://localhost:27017/chatdb

# Servidor
SERVER_PORT=1337

# JWT
JWT_SECRET=your-super-secret-jwt-key

# CORS (opcional)
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000
```

### Configuración Socket.io

```typescript
// En server.ts
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});
```

## 📊 Base de Datos

### Modelos Principales

- **Usuario**: name, email, password, organizacion
- **Organizacion**: name, description
- **Mensaje**: contenido, usuario, organizacion, leido, timestamps

### Relaciones

```
Usuario → Organizacion (1:N)
Mensaje → Usuario (N:1)
Mensaje → Organizacion (N:1)
```

## 🚨 Manejo de Errores

- ✅ Validación de datos con Joi
- ✅ Manejo de errores de Socket.io
- ✅ Logging estructurado
- ✅ Respuestas de error consistentes

## 🔐 Seguridad

- ✅ Autenticación JWT
- ✅ Validación de entrada
- ✅ Sanitización de datos
- ✅ CORS configurado
- ✅ Rate limiting (recomendado)

## 📈 Próximas Mejoras

- [ ] Autenticación OAuth
- [ ] Mensajes privados
- [ ] Grupos de chat
- [ ] Archivos adjuntos
- [ ] Notificaciones push
- [ ] Tests unitarios e integración

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.

---

**Desarrollado con ❤️ usando Node.js, Angular y WebSockets**
