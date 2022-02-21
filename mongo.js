const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://stephenwayar:${password}@dev.8sp8s.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

const person = new Phonebook({
  name: process.argv[3],
  number: process.argv[4]
})

person.save().then(result => {
  console.log('Added', process.argv[3], 'number:', process.argv[4], 'to phonebook')
  mongoose.connection.close()
})

// Phonebook.find({}).then(result => {
//   result.forEach(person => {
//     console.log(person)
//   })
//   mongoose.connection.close()
// })