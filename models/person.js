const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('Connectiong to ', url);

mongoose.connect(url)
    .then(result => 
        console.log('Connected to MongoDB')
    ).catch(error => 
        console.log('error connecting to MongoDB:', error.message )
    )

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
});

personSchema.set('toJSON', {
    transform: (doc, ret) =>{
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v
    }
});

module.exports = mongoose.model('Person', personSchema);