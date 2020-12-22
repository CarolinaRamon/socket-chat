
//Lo puse en un archivo aparte porque lo voy a usar muchas veces. Es una función para enviar mensajes a todos los demás usuarios.

const crearMensaje = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };

}

module.exports = {
    crearMensaje
}