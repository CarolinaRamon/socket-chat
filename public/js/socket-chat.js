var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {//Si en los parámetros no viene el nombre o la sala:
    window.location = 'index.html';//Redirecciona.
    throw new Error('El nombre y la sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};



socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {//El usuario es el que recibo por parámetro.
        // console.log('Usuarios conectados', resp);//Si entro al chat, recibo una respuesta del servidor.
        renderizarUsuarios(resp);//Renderización: Representación gráfica.
    });

});

socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información al servidor:
// socket.emit('crearMensaje', {
//     nombre: 'Carolina', //Innecesario porque lo recibo por otro lado.
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });//Lo comenté para que no me aparezca a cada rato el msj mientras hago el código.

// Escuchar mensajes del servidor:
socket.on('crearMensaje', function(mensaje) {
    // console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);//false porque el que envía el mensaje no soy "yo", sino el otro usuario.
    scrollBottom();
});

// Escuchar cambios de usuarios:
// (cuando un usuario entra o sale del chat)
socket.on('listaPersona', function(personas) {
    renderizarUsuarios(personas);
});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje Privado:', mensaje);

});