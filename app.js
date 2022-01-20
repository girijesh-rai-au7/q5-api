//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/escaleDB", {useNewUrlParser: true});

const userSchema = {
  name: String,
  email: String,
  bio:String
};
const businessSchema = {
  name:String,
  email:String,
  registrationNo:Number

}

const User = mongoose.model("User", userSchema);

app.route("/users")

.get(function(req, res){
  User.find(function(err, foundUser){
    if (!err) {
      res.send(foundUser);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newUser = new User({
    name: req.body.name,
    email: req.body.email
  });

  newUser.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  User.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/users/:useremail")

.get(function(req, res){

  User.findOne({email: req.params.userEmail}, function(err, foundUser){
    if (foundUser) {
      res.send(foundUser);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){

  User.update(
    {name: req.params.name},
    {email: req.body.email, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})

.patch(function(req, res){

  User.update(
    {name: req.params.userName},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  User.deleteOne(
    {name: req.params.userEmail},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
