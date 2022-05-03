require('dotenv').config()
const mongoose = require('mongoose')

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: Number,
    required: true,
    min: 8,
    // validate: {
    //   validator: function(v) {
    //     return /\+\d{8}/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid phone number!`
    // },
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)