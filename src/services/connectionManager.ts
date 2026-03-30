export interface IUsuarioConectado {
    socketId: string;
    usuarioId: string;
    nombre: string;
    email: string;
    organizacion: string;
}

export class ConnectionManager {
    obtenerTotal() {
        throw new Error('Method not implemented.');
    }
    private usuarios: Map<string, IUsuarioConectado> = new Map();//usado map para registrar a cada usuario que se conecta, asociando su ID de socket con sus datos (nombre, organización, etc.). esto nos permite saber quién está en linea. 

    // Añadir usuario al estado global.
    public agregarUsuario(socketId: string, datos: any, nombre: string, email: string, organizacion: string): void {
        this.usuarios.set(socketId, {
            socketId,
            usuarioId: datos.usuarioId,
            nombre: datos.nombre,
            email: datos.email,
            organizacion: datos.organizacion
        });
    }

    // Quitar usuario al desconectarse
    public eliminarUsuario(socketId: string): boolean {
        return this.usuarios.delete(socketId);
    }

    // Obtener la lista para enviarla luego
    public obtenerTodos(): IUsuarioConectado[] {
        return Array.from(this.usuarios.values());
    }
}