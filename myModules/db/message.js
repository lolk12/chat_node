let AES = require('crypto-js/AES');
let mongoose = require('./connect.js');
let Schema = mongoose.Schema;


let schemaMessage = Schema({
    hashedText: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    create: {
        type: Date,
        default: Date.now()
    }
});

schemaMessage.methods.encryptMessage = function (text) {
    this.salt = Math.random(16) + 'sadasdsdjhskdfhkasdhfwnefhsdkjnfkaewfsfnidsjfnhewhuhefjkhdjkshfjkds';
    return AES.encrypt(text, this.salt);
};
schemaMessage.virtual('text')
    .set(function(text) {
        this._plainText = text;
        this.hashedText = this.encryptMessage(text);
    })
    .get(function() { return this._plainText; });

exports.Message = mongoose.model('message',schemaMessage);