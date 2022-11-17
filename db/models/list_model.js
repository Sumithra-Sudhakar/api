const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({

    title: {
        type:String,
    required: true,
    minlength: 1,
    trim: true
    },
    organizer:{
        type:String,
        required: true,
        minlength: 1,
    },
    fee:{   
        type:Number,
        
        minlength: 1,
    },
    date:{
        type:Date,
        required: true,
        minlength: 1,
    },
    time:{
        type:String,
        required: true,
        minlength: 1,
    },
   description:{
        type:String,
        required: true,
        minlength: 1,
    },

});

const List = mongoose.model('List', ListSchema);

module.exports = { List };