const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema(
    {
        name: String,
        owner: Schema.Types.ObjectId,
        files: [{name: String, _id: String, folder: String, body: String}],
        folders: [{name: String, _id: String, folder: String}]
    },
    {
        timestamps: true
    }
)

// {'/': { 'dirname': { 'dirname2': { files:[] }, files:[] }, files: [ '123456', '1234567' ] }}

const Room = mongoose.model('Room', roomSchema);

module.exports = Room