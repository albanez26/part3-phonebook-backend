const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to ', url)

mongoose.connect(url)
  .then(result =>
    console.log('Connected to MongoDB')
  ).catch(error =>
    console.log('error connecting to MongoDB:', error.message )
  )

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    validate:{
      validator: (val) => {
        return /^\d{2,3}-\d{7,8}$/.test(val)
      },
      message: (props) => `${props.value} is not a valid phone number`
    },
    required: [true, 'Phone number is required']
  }
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Person', personSchema)