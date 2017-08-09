let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testDB');
module.exports = mongoose;
