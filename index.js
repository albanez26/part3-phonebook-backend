require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('dist'));

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    if(error.name === 'CastError') {
        return res.status(400).send({error: 'bad formatted id'})
    }
    next(error)
}

app.get('/api/persons', (request, response, next) =>{
    Person.find({}).then(persons => {
        response.json(persons);
    }).catch(error => next(error))
})

app.get('/info', (request, response, next) =>{
    Person.find({}).then(persons => {
        const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>`
        response.send(info)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) =>{
    Person.findById(request.params.id).then(person => {
        if (!person) {
            return response.status(404).send({
                error: 'person not found'
            })
        }
        response.json(person);
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) =>{
    const body = request.body;
    if (!body.name || !body.number) {
        return response.status(400).json(
            {error: 'name and number are required'}
        )
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) =>{
    const name = request.body.name
    const number = request.body.number
    if (!name || !number) {
        return response.status(400).send({
            error: 'name and number are required'
        })
    }
    const person = {
        name,
        number
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) =>{
    Person.findByIdAndDelete(request.params.id)
        .then(person => {
            response.status(204).end()
        }).catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})