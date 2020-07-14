class Users {
    constructor() {
        this.persons = [];
    }

    addPerson(id, name, group) {
        let person = { id, name, group };
        this.persons.push(person);
        return this.persons;
    }

    getPerson(id) {
        let person = this.persons.filter(person => person.id === id)[0];
        return person;
    }

    getAllPersons() {
        return this.persons;
    }

    getAllPersonsByGroup(group) {
        let personOnGroup = this.persons.filter(person => person.group === group);
        return personOnGroup;
    }

    deletePerson(id) {
        let deletedPerson = this.getPerson(id);
        this.persons = this.persons.filter(person => {
            return person.id != id;
        });
        return deletedPerson;
    }
}

module.exports = {
    Users
};