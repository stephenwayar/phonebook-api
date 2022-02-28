require('dotenv').config()

const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log("Connecting to mongoDB...")

mongoose.connect(url).then(() => {
  console.log("Successfully connected to MongoDB")
}).catch(err => {
  console.log("Failed to connect to mongoDB:", err)
})

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)