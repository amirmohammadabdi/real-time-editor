class Room{
    constructor(payload){
        this.room = payload.room
        this.users = [{
            _id: payload._id,
            name: payload.name,
            color: payload.color,
            role: payload.role
        }]
        this.history = ''
        this.files = []
        this.folders = []
        this.selected = ''
    }
    addUser(payload){
        this.users.push({
            _id: payload._id,
            name: payload.name,
            color: payload.color,
            role: payload.role
        })
    }
    removeUser(_id){
        this.users = this.users.filter(user => user._id != _id)
    }
    getUsers(){
        return this.users
    }
    getHistory(){
        return {folders: this.folders, files:this.files, selected: this.selected}
    }
    addFile(data){
        this.files.push(data)
    }
    addFolder(data){
        // console.log(this.folders, data)
        this.folders.push(data)
    }
    delFile(id){
        this.files = this.files.filter(f => f._id != id)
        if(id == this.selected){
            this.selected = ''
        }
    }
    delFolder(id){
        this.folders = this.folders.filter(f => f._id != id)
        let newFiles = []
        this.files.forEach(f => {
            if(f.folder != id){
                newFiles.push(f)
            }else{
                if(this.selected = f._id){
                    return true
                }
            }
        })
        this.files = newFiles;
        return false
    }
    getFile(){
        console.log(this.selected, this.files)
        for(let i=0; i<this.files.length; i++){
            if(this.files[i]._id == this.selected){
                return this.files[i].body
            }
        }
        return ''
    }
    changeFile(value){
        this.files.forEach(f => {
            if(f._id == this.selected){
                f.body = value
            }
        })
    }
    userAlreadyIn(id){
        for(let i=0; i<this.users.length; i++){
            if(this.users[i]._id == id){
                return true
            }
        }
        return false
    }
}

module.exports = Room