const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

app.use(express.json());

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('dist'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) =>{
    response.json(persons);
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
});

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

const getId = () => Math.floor(Math.random() * 1000);

app.post('/api/persons', (request, response) =>{
    const person = request.body;
    if (!person.name || !person.number) {
        return response.status(400).json(
            {error: 'name and number are required'}
        );
    }

    const repeated = persons.some(p => p.name === person.name);
    if(repeated){
        return response.status(409).json(
            {error: `${person.name} is already registered`}
        );
    }

    person.id = getId();
    persons = persons.concat(person);

    response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});