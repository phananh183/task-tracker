const mongoose = require('mongoose')

const URI = process.env.MONGODB_URI

mongoose.connect(URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(err => console.log(`Error connecting to MongoDB: ${err}`))

const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    time: {
        type: String, 
    }, 
    reminder: {
        type: Boolean
    }
})

taskSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Task', taskSchema)