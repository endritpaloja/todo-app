const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const mongo = require('mongodb').MongoClient;
const dbUrl = 'mongodb://localhost:27017/todoapp';
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

mongo.connect(dbUrl, function(err,client) {
  if (err) {
    console.log('error connecting to db');
  }else {
    console.log('connection to db was successful');
    todos = client.db('todolistapp').collection('todos');
  }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/todo/add',function(req,res) {
  todos.insert({title: req.body.title, description: req.body.description}, function(err,result) {
    if (err) {
      console.log(err);
    }
      res.redirect('/');
  });
});

app.get('/',function(req,res) {
  todos.find({}).toArray(function(err,docs) {
    if (err) {
      console.log(err);
    }
    res.render('index',{docs:docs});
  });
});

app.get('/todo/:id', function(req,res) {
  console.log(req.params.id);
  todos.findOne({_id: ObjectId(req.params.id)},function(err,doc) {
    if (err) {
      console.log(err);
    }
    res.render('show', {doc:doc});
  });
});

app.get('/todo/edit/:id', function(req,res) {
  console.log(req.params.id);
  todos.findOne({_id: ObjectId(req.params.id)},function(err,doc) {
    if (err) {
      console.log(err);
    }
    res.render('edit', {doc:doc});
  });
});

app.post('/todo/update/:id', function(req,res) {
  todos.updateOne({_id: ObjectId(req.params.id)},{$set: {title:req.body.title, description:req.body.description}},
  function(err, doc) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

app.get('/todo/delete/:id', function(req,res) {
  todos.deleteOne({_id: ObjectId(req.params.id)},
  function(err, doc) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

app.get('/', (req,res) => {
  res.render('index');
});

app.listen(3000,'localhost',(err) => {
  if (err) {
    console.log('err');
  }else {
    console.log('server started listening');
  }
});

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
