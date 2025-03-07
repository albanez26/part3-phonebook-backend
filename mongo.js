const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('password was not provided');
    process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);
const url = `mongodb+srv://edwinalbanez23:${password}@cluster0.co6vk.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    //only password
    Person.find({})
        .then(result => {
            result.forEach(person => console.log(person));
            mongoose.connection.close();
        });

} else if (process.argv.length === 5) {
    //all arguments
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });

    person.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
        mongoose.connection.close();
    });
}else{
    console.log('name and number are required');
    process.exit(1);
}

