var express=require("express");
var app=express();
app.set("view engine","ejs");

var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var methodOverride=require("method-override");
app.use(methodOverride("_method"));

//Database setup
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/blog_database")
var blogSchema=mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var blog=mongoose.model("blog",blogSchema);

app.get("/",function(req,res){
   res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    blog.find({},function(err,data){
       if(err){
       	 console.log("something went wrong");
       }
       else{
       	 res.render("index",{blogs:data});
       }
    });
});
app.get("/blogs/new",function(req,res){
   res.render("new");
});

app.post("/blogs",function(req,res){
   blog.create(req.body.blog,function(err,data){
       if(err){
        console.log("something went wrong");
       }
       else{
        res.redirect("/blogs");
       }
   });
});

app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,data){
      if(err){
        console.log("something went worng");
      }
      else{
        res.render("show",{blogs:data});
      }
    });
});
app.get("/blogs/:id/edit",function(req,res){
     blog.findById(req.params.id,function(err,data){
        if(err){
          res.redirct("/blogs");
        }
        else{
          res.render("edit",{blogs:data});
        }
     });
});

//update route
app.put("/blogs/:id",function(req,res){  //blog here and blogs is been send to other rendered pages
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,data){
       if(err){
        console.log("something went wrong!!");
       }
       else{
        res.redirect("/blogs");
       }       
    });
});

app.delete("/blogs/:id",function(req,res){
     blog.findByIdAndRemove(req.params.id,function(err,data){
           if(err){
            console.log("something went wrong");
           }
           else{
             res.redirect("/blogs");
           }
     });
});

app.listen("3000",function(){
    console.log("Server has started");
});

