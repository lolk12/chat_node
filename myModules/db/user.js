/**
 * Created by Алеша on 05.06.2017.
 */
let AES = require('crypto-js/AES');
let mongoose = require('./connect.js');
let Schema = mongoose.Schema;



let schema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    vatin: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    create: {
        type: Date,
        default: Date.now()
    }
});
schema.methods.encryptPassword = function(password) {
    this.salt = Math.random(16) + 'asdjkhjkwhjnkhsdhnfdjcyncwhruhnweohnrwehrocnlmhaclhsfslcfnkasdkfganksc';
    return AES.encrypt(password, this.salt);
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


// schema.methods.checkPassword = function(password) {
//     return password === crypto.decrypt(this.hashedPassword, this.salt);
// };
exports.User = mongoose.model('user',schema);