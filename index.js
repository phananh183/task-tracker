const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const Task = require('./modules/task')

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/tasks', (req, res) => {
    Task.find({}).then(tasks => {
        return res.json(tasks)
    })
    .catch(err => console.log(err))
})

app.get('/api/tasks/:id', (req, res, next) => {
    Task.findById(req.params.id)
        .then(task => {
        if (task) {
            res.json(task)
        } else {
            res.status(404).end()
        }
        })
        .catch(err => next(err))
})

app.delete('/api/tasks/:id', (req, res, next) => {
    Task.findByIdAndDelete(req.params.id)
        .then((task => {
            if (task) {
                res.status(204).end()
            } else {
                res.status(404).end()
            }
        }))
        .catch(err => next(err))
})

app.post('/api/tasks', (req, res, next) => {
    const body = req.body
    console.log(body)
    
    const newTask = new Task({
        text: body.text,
        time: body.time,
        reminder: body.reminder,
    })

    newTask.save().then(() => {
        res.json(newTask)
    })
    .catch(err => next(err))
})

app.put('/api/tasks/:id', (req, res, next) => {
    const body = req.body

    const updatedTask = {
        text: body.text,
        time: body.time,
        reminder: body.reminder
    }

    Task.findByIdAndUpdate(req.params.id, updatedTask, {new: true, runValidators: true, context: 'query'}, )
        .then(updated => {
            if (updated) {
                res.json(updated)
            } else {
                res.status(404).end()
            }
        })
        .catch(err => next(err))
    })

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})
