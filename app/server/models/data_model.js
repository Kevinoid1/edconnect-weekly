class DataModel {
    constructor() {
        this.data = [];
    }

    getAll() {
        return this.data;
    }

    getById(id) {
      let cond = this.data.find((object) =>{
            return object.id === id
        })
        if (cond === undefined){
            return null
        } else return cond
    }

    save(obj) {
        if (this.validate(obj)) {
            this.data.push(obj);
            return true;
        }
        return false;
    }

    update(obj, id) {
        let cond = this.data.find((ob) => {
            return ob.id === id
        })
        if (cond !== undefined){
            for (let key in cond){
                this.data[this.data.indexOf(cond)][key] = obj[key] || this.data[this.data.indexOf(cond)][key]
            }
            
            return true
        } else return false
    }

    delete(id) {
        let len = this.data.length
        this.data = this.data.filter((object) => {
            return object.id !== id
        })
        if(this.data.length < len){
            return true
        } else return false
    }

    // this method will be overriden in the sub classes
    validate(obj) {
        return false;
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = DataModel;