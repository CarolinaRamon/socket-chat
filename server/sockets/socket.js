const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {


        if (!data.nombre || !data.sala) {//Si no viene el nombre o la data:
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios.'
            });
        }

        client.join(data.sala);//Instrucción para conectar a un usuario a una sala.

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));//Evento listaPersona: Cuando una persona entra o sale del chat envía un mensaje a todos los demás usuarios de la sala, en el que se listan todas las personas conectadas.
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));

        callback(usuarios.getPersonasPorSala(data.sala));//Retorno las personas que están conectadas.

    });

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);//Envío el msj que acabo de crear.

        callback(mensaje);//retorno el msj para avisar que se hizo la publicación del msj
    });


    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);//Tengo que borrar a la persona que se desconecta, porque si volviera a entrar se clonaría.

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`));//Aviso que un usuario salió del chat.
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));


    });

    // Mensajes privados (el servidor escucha y recibe la data)
    client.on('mensajePrivado', data => {
        
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));//para es el id de la persona a quien le quiero enviar el msj

    });

});