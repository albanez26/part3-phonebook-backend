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

app.get('/api/persons', (request, response) =>{
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get('/info', (request, response) =>{
    const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>`;

    response.send(info);
});

app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if(person){
        response.json(person);
    }else{
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) =>{
    Person.findByIdAndDelete(request.params.id)
        .then(person => {
            response.status(204).end()
        }).catch(error => next(error))
})

app.post('/api/persons', (request, response) =>{
    const body = request.body;
    if (!body.name || !body.number) {
        return response.status(400).json(
            {error: 'name and number are required'}
        )
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    });
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});