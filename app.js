// --------------------------------
//      DEPENDANCIES
// --------------------------------

var express           =require("express"),
    bodyParser        =require("body-parser"),
    mongoose          =require("mongoose"),
    methodOverride    =require("method-override"),
    expressSanitizer  =require("express-sanitizer");

// App Configuration
app=express();
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser:true, useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());



// var publicDir=require('path').join(__dirname,'public');
// app.use(express.static(publicDir));

// Database Setup
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);


// Routes
// Index Route
app.get("/",function(req,res){
    res.redirect("/blogs")
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("index",{ blogs:blogs});
        }
    });
});
// New Route
app.get("/blogs/new",function(req,res){
    res.render("new");
});

// Create Route
app.post("/blogs",function(req,res){
    // Create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        } else {
            // redirect to home page
            res.redirect("/blogs");
        }
    });
});

// Show Page
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show",{blog:foundBlog});
        }
    });
});


// Edit
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog:foundBlog});
        }
    })
});

// Update

app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// Destroy Route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

// Server Setup
app.listen(8154,"localhost",function(){
    console.log("Blog app starting at port 8154....");
})