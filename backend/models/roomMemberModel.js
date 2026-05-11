const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        name: String,
        role: String,
        room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
        in: Boolean
    },
    {
        timestamps: true
    }
)

memberSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}

const Member = mongoose.model('Member', memberSchema)

module.exports = Member