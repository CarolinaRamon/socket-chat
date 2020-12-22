


var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');


// referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');


// Funciones para renderizar usuarios
function renderizarUsuarios(personas) { // [{},{},{}] personas es un arreglo de personas

    console.log(personas);

    var html = '';

    //Creo un string con todo el html:
    //Todo este html lo creo de forma automática.
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';//Recibo por parámetro el nombre de la sala.
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {

        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '"  href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';//data-id: atributo personalizado. Por lo general, los atributos personalizados empiezan con la palabra data + guión + un atributo.
    }

    divUsuarios.html(html);//Cambio el elemento con id divUsuarios en el DOM.

}


function renderizarMensajes(mensaje, yo) {//yo: si yo lo envío

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';//Si el msj lo manda el administrador se pone en rojo.
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {

        html += '<li class="animated fadeIn">';

        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';//Si el msj lo envía el administrador no aparece ninguna imagen.
        }

        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }


    divChatbox.append(html);

}

function scrollBottom() {//Para que vaya bajando a medida que se agregan msjs al chat.
    //Este código hace cálculos para ver si la pantalla se tiene que mover hacia abajo o si se tiene que quedar donde está. JQuery. La podemos reutilizar simplemente reemplazando divChatbox por lo que queramos renderizar.

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}




// Listeners
//Cuando se haga click en cualquier anchor tag dentro de divUsuarios se dispara una función:
divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id');//Este id es el id de data-id

    if (id) {
        console.log(id);
    }

});//Este código es simplemente para obtener el ID de los usuarios por consola, para futuros usos.

formEnviar.on('submit', function(e) {//Escucha cuando se hace un submit en el elemento HTML con id formEnviar. 
//e de evento

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {//trim quita los espacios delante y detrás
        return;//Si el msj está vacío no hace nada. Para que no se puedan enviar msjs vacíos.
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();//txtMensaje.val es igual a vacío para que se vacíe la caja de texto. Esto es cuando recibo el msj, lo cual quiere decir que se publicó. focus es para que el cursor titilando activo en la caja de texto.
        renderizarMensajes(mensaje, true);//true, porque cuando envío el msj en el form sí soy "yo" el que lo envía.
        scrollBottom();
    });


});