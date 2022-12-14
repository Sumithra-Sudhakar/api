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

app.post('/lists', async (req, res) => {
    //create a new list and return the new list document    
    let title = req.body.title;
    let organizer = req.body.organizer;
    let cost = req.body.cost; 
    let date = req.body.date;
    let time = req.body.time;
    let description = req.body.description;
    let mode = req.body.mode;

    let newList = new List({        
        title,
        organizer,
        description,
        mode,
        cost,
        date,
        time,
        
    });

    const listexist =   await List.findOne({title: req.body.title});
    if(listexist){
        res.send("event already exist");
        console.log("event already exist");
    }
    else{
        newList.save().then((listDoc) => {
            //the full list document is returned
            res.send(listDoc);
            console.log("event added");
        })
    }




    
});
app.patch('/lists/:title', (req, res) => {
    //update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    List.findOneAndUpdate({title: req.params.title}, {
        $set: req.body //upate the list that its find with the condition
    }).then(() => {
        res.send("modified");
    })
});
app.delete('/lists/:title', async (req, res) => {
    //delete the specified list (list document with id in the URL)
     
    const taskDeleted = await List.findOne({

        title: req.params.title
   });
    if(taskDeleted){
        List.findOneAndRemove({
            title: req.params.title
        }).then((removedListDoc) => {
            res.send(removedListDoc);
        })
    }
    else{
        res.send("event not found");
    }
});




//now for each and every task 
app.get('/tasks', (req, res) => { 
    console.log(req.params);
    //return all tasks that belong to a specific list (specified by listId)
    Task.find({
        
    }).then((tasks) => {
        res.send(tasks);
    })
});
 
app.post('/tasks', async (req, res) => {
    //create a new task in a list specified by listId
    let newTask = new Task({
        title: req.body.title,
        content: req.body.content,

         
    });

    const taskexist =   await Task.findOne({title: req.body.title, content: req.body.content});
    if(taskexist){
        res.send("task already exist");
        console.log("task already exist");
    }
    else{
        newTask.save().then((newTaskDoc) => {
            //the full task document is returned (incl. id)
            res.send(newTaskDoc);
        })
    }
});
app.patch('/tasks/:title', (req, res) => {
    //update an existing task (specified by taskId)
    console.log("req.params");
    Task.findOneAndUpdate({
        title: req.params.title,
       
    }, {
        $set: req.body
    }).then(() => {
        res.send({message: 'Updated successfully.'});
    })
});
app.delete('/tasks/:title', async (req, res) => {
    console.log(req.params.title);
    //delete the specified list (list document with id in the URL)
   const taskDeleted = await Task.findOne({

        title: req.params.title
   });
    if(taskDeleted){
        Task.findOneAndRemove({
            title: req.params.title
        }).then((removedTaskDoc) => {
            res.send(removedTaskDoc);
        })
    }
    else{
        res.send("notification not found");
    }
      
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});