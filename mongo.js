const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const url = process.env.MONGODB_URI

mongoose.connect(url).then(() => {
  console.log("Successfully connected to MongoDB")
}).catch(err => {
  console.log("Failed to connect to mongoDB:", err)
})

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

const person = new Phonebook({
  name: process.argv[3],
  number: process.argv[4]
})

person.save().then(() => {
  console.log('Added', process.argv[3], 'number:', process.argv[4], 'to phonebook')
  mongoose.connection.close()
})

// Phonebook.find({}).then(result => {
//   result.forEach(person => {
//     console.log(person)
//   })
//   mongoose.connection.close()
// })