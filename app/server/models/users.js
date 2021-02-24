const DataModel = require('./data_model');

class User {
    constructor(id, firstname, lastname, email, password, matricNumber, program, graduationYear) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.matricNumber = matricNumber;
        this.program = program;
        this.graduationYear = graduationYear;
    }

    getFullName() {
        return this.firstname + ' ' + this.lastname
    }
}

class Users extends DataModel {
    authenticate(email, password) {
        let cond = this.data.find((object) =>{
            return ((email === object.email) && (password === object.password))
        })
        if(cond !== undefined){
            return true
        } else return false
    }

    getByEmail(email) {
        let cond = this.data.find((object) =>{
            return object.email === email
        })
        if (cond !== undefined){
            return cond
        } else return null
    }

    getByMatricNumber(matricNumber) {
        let cond = this.data.find((object) =>{
            return object.matricNumber === matricNumber
        })
        if (cond !== undefined){
            return cond
        } else return null
    }

    validate(obj) {
        let cond = this.data.find((object) => ((object.email === obj.email) || (object.matricNumber === obj.matricNumber)))
           
        if (obj.id && obj.firstname && obj.lastname && obj.email
            && obj.password && obj.matricNumber && obj.program && obj.graduationYear && (obj.password.length>=7) && (cond === undefined) ){
                return true;
            } else {
                return false;
            }
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    User,
    Users
};