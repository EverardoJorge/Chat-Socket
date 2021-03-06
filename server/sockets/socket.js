const { io } = require('../server');
const { Users } = require('../classes/users')
const { createMessage } = require('../utilities/utility')

const users = new Users;

io.on('connection', (client) => {
    client.on('enterChat', (data, callback) => {
        if (!data.name || !data.group) {
            return callback({
                err: true,
                message: 'The name or group are required'
            });
        }

        client.join(data.group);

        users.addPerson(client.id, data.name, data.group);
        client.broadcast.to(data.group).emit('personList', users.getAllPersonsByGroup(data.group));
        client.broadcast.to(data.group).emit('createMessage', createMessage('admin', `${data.name} joined the chat`));
        callback(users.getAllPersonsByGroup(data.group));
    });

    client.on('createMessage', (data, callback) => {
        let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.group).emit('createMessage', message);
        callback(message);
    });

    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson(client.id);
        console.log(deletedPerson);
        client.broadcast.to(deletedPerson.group).emit('createMessage', createMessage('admin', `${deletedPerson.name} left the chat`));
        client.broadcast.to(deletedPerson.group).emit('personList', users.getAllPersonsByGroup(deletedPerson.group));
    });

    client.on('privateMessage', data => {
        let person = users.getPerson(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));
    });
});