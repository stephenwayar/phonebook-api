require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const Phonebook = require('./models/phonebook')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

//routes

app.get('/', (req, res) => {
  res.send(`<h1>App root</h1>`)
})

app.get('/api/persons', (req, res) => {
  Phonebook.find({}).then((notes) => {
    res.json(notes)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Phonebook.findById(req.params.id).then(note => {
    res.json(note)
  })
})

// app.get('/api/info', (req, res) => {
//   res.status(200).send(`<h3>Phonebook has info for ${persons.length} people.</h3> <br> ${date}`)
// })

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(body === undefined){
    return(res.status(400).json({
      erroMessage: "Content Missing"
    })
    )
  }

  const person = new Phonebook({
    name: body.name,
    number: body.number
  })

  person.save().then((person) => {
    res.json(person)
    console.log("Person saved!")
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Phonebook.findByIdAndDelete(req.params.id).then(() => {
    res.status(200).end()
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`)
})