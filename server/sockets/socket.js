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

        let persons = users.addPerson(client.id, data.name, data.group);
        client.broadcast.emit('personList', users.getAllPersons());
        callback(persons);
    });

    client.on('createMessage', (data) => {
        let person = users.getPerson(client.id)
        let message = createMessage(person.name, data.message);
        client.broadcast.emit('createMessage', message)
    });

    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson(client.id);
        //{ user: 'admin', message: `${deletedPerson.name} abandono el chat` }
        client.broadcast.emit('createMessage', createMessage('admin', `${deletedPerson.name} left`));
        client.broadcast.emit('personList', users.getAllPersons());
    });

    client.on('privateMessage', data => {
        let person = users.getPerson(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));
    });
});