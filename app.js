//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const homeStartingContent = "Hello!! Welcome to the Journaling website. Jot down all your thoughts here daily and we will store it for you, to visti Later. To start writing append '/compose' to this page and get your keyboard working.";
const aboutContent = "This is a personal project and not for commercial use. Please contact the owner of this repo: Pratham Kohli for more info.";
const contactContent = "For any queries feel free to drop us a mail at : support@gmail.com. Happy to help :)";

const app = express();
//let posts=[];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {

  title: String,
  content: String

};
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  //res.send("<h1>Home</h1>");
   Post.find({}, function(err,posts){
    if(!err)
    {
      res.render("home.ejs",{homeCont: homeStartingContent, posts: posts});
      // posts.forEach(function(post){
      //   console.log(post._id);
      // })
    }
  })

});
app.get("/contact", function(req, res){
  //res.send("<h1>Home</h1>");
  res.render("contact.ejs",{contactCont: contactContent});
});
app.get("/about", function(req, res){
  //res.send("<h1>Home</h1>");
  res.render("about.ejs",{aboutCont: aboutContent});
});
app.get("/compose", function(req, res){
  //res.send("<h1>Home</h1>");
  res.render("compose.ejs");
});

app.get("/posts/:postId", function(req, res){
  //let postName = _.lowerCase(req.params.postName);
  //console.log(postName);
  /*posts.forEach(function(post){

      if( _.lowerCase(post.postTitle) === postName)
        {
          console.log("Match found");
          res.render("post.ejs",{postTitle:post.postTitle , postContent:post.postBody});
        }

  });*/
  const requestedPostId = req.params.postId;
  Post.findOne({_id:requestedPostId }, function(err, post){
    if(post)
    {
      res.render("post.ejs",{postTitle:post.title , postContent:post.content});
    }
    else {
      res.redirect("/");
    }
  })

});

app.post("/compose", function(req,res){
  const post = new Post({
    title : req.body.postTitle,
    content : req.body.postBody,
  });
  //posts.push(post);
  post.save(function(err){
    if(!err)
    {
      res.redirect("/");
    }
  });
  //console.log(JSON.stringify(posts));
  //res.redirect("/");
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
