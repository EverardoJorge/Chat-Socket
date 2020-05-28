var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('group')) {
    window.location = 'index.html';
    throw new Error('The name and group are required');
}

var user = {
    name: params.get('name'),
    group: params.get('group')
}

socket.on('connect', function() {
    socket.emit('enterChat', user, function(resp) {
        console.log('Users Connected:', resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/**
 socket.emit('createMessage', {
    usuario: 'Everardo Jorge',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

 */

// Escuchar información
socket.on('createMessage', function(mensaje) {

    console.log('Servidor:', mensaje);

});

socket.on('personList', function(persons) {
    console.log(persons);
});


/// Private Messages
socket.on('privateMessage', function(message) {
    console.log('Private Message ', message);
});