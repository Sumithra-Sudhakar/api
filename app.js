const express = require('express');
const app = express();
const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');
//load in the mongoose modules
const {List, Task} = require('./db/models');

//load middleware

app.use(bodyParser.json());
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration
app.get('/lists', (req, res) => {        
    //return array of all the lists in the database
    List.find({}).then((lists) => {
        res.send(lists);
    })
});

app.post('/lists', (req, res) => {
    //create a new list and return the new list document    
    let title = req.body.title;
    let organizer = req.body.organizer;
    let fee = req.body.fee;
    let date = req.body.date;
    let time = req.body.time;
    let description = req.body.description;

    let newList = new List({        
        title,
        organizer,
        description,

        fee,
        date,
        time,
        
    });
    newList.save().then((listDoc) => {
        //the full list document is returned
        res.send(listDoc);
    })
});
app.patch('/lists/:id', (req, res) => {
    //update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    List.findOneAndUpdate({_id: req.params.id}, {
        $set: req.body //upate the list that its find with the condition
    }).then(() => {
        res.sendStatus(200);
    })
});
app.delete('/lists/:id', (req, res) => {
    //delete the specified list (list document with id in the URL)
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    })
});

//now for each and every task 
app.get('/lists/:listId/tasks', (req, res) => { 
    console.log(req.params);
    //return all tasks that belong to a specific list (specified by listId)
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});
app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    //return the specified task (task document with id in the URL)
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
});
app.post('/lists/:listId/tasks', (req, res) => {
    //create a new task in a list specified by listId
    let newTask = new Task({
        title: req.body.title,
        content: req.body.content,

        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
});
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    //update an existing task (specified by taskId)
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
    }).then(() => {
        res.send({message: 'Updated successfully.'});
    })
});
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    //delete a task (specified by taskId)
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
});
app.listen(3000, () => {
    console.log('Server started on port 3000');
});