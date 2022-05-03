require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const Phonebook = require('./models/phonebook')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan("tiny"))

//MongoDB connect

console.log("Connecting to mongoDB...")

const url = process.env.MONGODB_URI

mongoose.connect(url).then(() => {
  console.log("Successfully connected to MongoDB")
}).catch(err => {
  console.log("Failed to connect to mongoDB:", err)
})

//routes

app.get('/', (req, res) => {
  res.send(`<h1>App root</h1>`)
})

app.get('/api/info', (req, res) => {
  const date = new Date()

  Phonebook.find({}).then(persons => {
    res.send(`
      <div>
        <h2>Phonebook has info for ${persons.length} people</h2>

        <p>${date}</p>
      </div>
      `
    )
  })
})

app.get('/api/persons', (req, res) => {
  Phonebook.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Phonebook.findById(req.params.id).then(person => {
    res.json(person)
  }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Phonebook({
    name: body.name,
    number: body.number
  })

  person.save().then((person) => {
    res.json(person)
    console.log("Person saved!")
  }).catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
  Phonebook.findByIdAndDelete(req.params.id).then(() => {
    res.status(200).end()
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Phonebook.findByIdAndUpdate(
    req.params.id, person,
    { new: true, runValidators: true, context: 'query' }
  ).then(updatedPerson => {
    res.json(updatedPerson)
  }).catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ erroMessage: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log("ERROR: ", error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`)
})