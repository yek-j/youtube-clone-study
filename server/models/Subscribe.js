const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps:true})

const Subscribe = mongoose.model('Subscribe', subscriberSchema);


module.exports = { Subscribe }