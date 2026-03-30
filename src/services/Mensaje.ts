import { Server as SocketIOServer, Socket } from 'socket.io';
import Logging from '../library/Logging';
import MensajeModel, { IMensajeModel } from '../models/Mensaje';
import { ConnectionManager } from './ConnectionManager';

export class MensajeService {
    private io: SocketIOServer;
    private connectionManager: ConnectionManager;

    constructor(io: SocketIOServer) {
        this.io = io;
        this.connectionManager = new ConnectionManager();
    }

    /**
     * Inicializa los listeners de Socket.io
     */
    public inicializarSockets(): void {
        this.io.on('connection', (socket: Socket) => {
            Logging.info(`Socket conectado: ${socket.id}`);

            /* 
            // Unirse a una sala de organización (DESACTIVADO PARA CHAT GLOBAL)
            socket.on('join-organization', (organizacionId: string) => {
                socket.join(`org-${organizacionId}`);
                Logging.info(`Socket ${socket.id} se unió a organización ${organizacionId}`);
            });
            */
           
           socket.on('user-connect', (data: { usuarioId: string, nombre: string, email: string, organizacion: string }) => { //esta funcion es para que el cliente avise que se ha conectado, y así registrarlo en el ConnectionManager. Recibe un objeto con los datos del usuario (ID, nombre, email, organización).
                this.connectionManager.agregarUsuario(
                    socket.id,
                    data.usuarioId,
                    data.nombre,
                    data.email,
                    data.organizacion 

                   
                );  
                // Difusión: Avisamos a todos del nuevo usuario
                
                 //usuario se conecta + registra  
                // Obtener lista actualizada y emitir a TODOS!!
                const usuariosConectados = this.connectionManager.obtenerTodos();
                this.io.emit('users-list-updated', {
                    usuarios: usuariosConectados,
                    total: this.connectionManager.obtenerTotal(),
                    timestamp: new Date() //un poco de ayuda de ia
                });
                 Logging.info(`Usuarios conectados: ${usuariosConectados.length}`);
            });

             
               
            socket.on('typing', (data: { usuario: string }) => {
                Logging.info(`${data.usuario} está escribiendo...`);
                socket.broadcast.emit('user-typing', data);
            });
            

            socket.on('stop-typing', (data: { usuario: string }) => {
                Logging.info(`${data.usuario} dejó de escribir`);
                socket.broadcast.emit('user-stop-typing', data);
            });
            

            // Escuchar mensajes incoming
            socket.on('message', async (data: { usuario: string, organizacion: string, contenido: string }) => {
                try {
                    Logging.info(`Mensaje recibido de ${data.usuario}`);
                    
                    // Guardar el mensaje en la BD
                    const nuevoMensaje = await this.guardarMensaje(
                        data.contenido,
                        data.usuario,
                        data.organizacion
                    );

                    // Emitir el mensaje a TODOS los clientes conectados (Chat Global)
                    this.io.emit('message', nuevoMensaje);
                } catch (error) {
                    Logging.error(`Error al guardar mensaje: ${error}`);
                    socket.emit('error', { message: 'Error al guardar el mensaje' });
                }
            });

            // Marcar mensaje como leído
            socket.on('mark-as-read', async (mensajeId: string) => {
                try {
                    await MensajeModel.findByIdAndUpdate(mensajeId, { leido: true });
                    Logging.info(`Mensaje ${mensajeId} marcado como leído`);
                } catch (error) {
                    Logging.error(`Error al marcar mensaje como leído: ${error}`);
                }
            });

            //  Solicitar lista de usuarios!!
            socket.on('request-users-list', () => {
                const usuariosConectados = this.connectionManager.obtenerTodos();
                socket.emit('users-list-updated', {
                    usuarios: usuariosConectados,
                    total: this.connectionManager.obtenerTotal(),
                    timestamp: new Date()
                });
            });

            // Desconexión
           socket.on('disconnect', () => {
            Logging.info(`Socket desconectado: ${socket.id}`);
            
            // Movemos esto AQUÍ DENTRO para que el broadcast ocurra al irse el usuario
            const usuarioEliminado = this.connectionManager.eliminarUsuario(socket.id);
            
            if (usuarioEliminado) {
                const usuariosConectados = this.connectionManager.obtenerTodos();
                this.io.emit('users-list-updated', {
                    usuarios: usuariosConectados,
                    total: this.connectionManager.obtenerTotal(),
                    timestamp: new Date()
                });
                Logging.info(`Usuarios restantes: ${usuariosConectados.length}`);
            }
        });
        });
        
    }

    /**
     * Guarda un nuevo mensaje en la base de datos
     */
    public async guardarMensaje(
        contenido: string,
        usuarioId: string,
        organizacionId: string
    ): Promise<IMensajeModel> {
        const mensaje = new MensajeModel({
            contenido,
            usuario: usuarioId,
            organizacion: organizacionId,
            leido: false
        });

        const savedMensaje = await mensaje.save();
        return await savedMensaje.populate('usuario', 'name email');
    }


    /**
     * Obtiene todos los mensajes de una organización
     */
    public async obtenerMensajesPorOrganizacion(organizacionId: string): Promise<IMensajeModel[]> {
        return await MensajeModel.find({ organizacion: organizacionId })
            .populate('usuario', 'name email')
            .sort({ createdAt: -1 });
    }

    /**
     * Obtiene los mensajes no leídos de un usuario
     */
    public async obtenerMensajesNoLeidos(usuarioId: string): Promise<IMensajeModel[]> {
        return await MensajeModel.find({ usuario: usuarioId, leido: false })
            .populate('usuario', 'name email')
            .populate('organizacion', 'name');
    }
}
