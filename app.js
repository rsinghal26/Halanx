var express                 = require("express"),
    app                     = express(),
    Request                 = require("request"),
    bodyParser              = require("body-parser"),
    flash                   = require("connect-flash"),
    cookieParser            = require('cookie-parser');

app.listen(process.env.PORT || 3000,process.env.IP,function(){
    console.log("Connected..........");
});
 
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use(cookieParser('secretString'));
app.use(require("express-session")({
    secret: "taj is the one the famous hotel in india",
    resave:false,
    saveUninitialized: false
}));

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(flash());

app.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
  });
//=============================================================================================
app.get("/",function(req,res){ 
    if(!req.cookies.auth){
        res.render("login",{token:req.cookies.auth});
    }else{
        res.redirect("/dashboard");
    } 
});

app.post("/login",(req,res)=>{

    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://testapi.halanx.com/rest-auth/login/",
        "body": JSON.stringify({
            "username": req.body.username,
            "password": req.body.password
        })
    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }
        // console.log(response.statusCode);
        if(response.statusCode == 200){
            var result = JSON.parse(body);
            res.cookie('auth',result.key);
            res.redirect("/dashboard");
        }else{
            req.flash("error","Invalid details please try again");
            return res.redirect("/");
        }
        
    }); 

});

app.get("/dashboard",(req,res)=>{
    if(req.cookies.auth)
        res.render("dashboard",{token:req.cookies.auth});
    else{
        res.redirect("/");
    }    
})

app.get("/logout", (req,res)=>{
    // console.log(req.cookies.auth);
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://testapi.halanx.com/rest-auth/logout/",
        "body": JSON.stringify({
            "key": req.cookies.auth
        })
    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }
        // console.log(response.statusCode);
        if(response.statusCode == 200){
            res.clearCookie("auth");
            req.flash("success","Successfully logged out");
            return res.redirect("/");
        }
        
    }); 
});

app.use((req, res, next)=>{
    const error  = new Error();
    error.status = 404;
    next(error);
 });
 
 app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
             message: error.message    
        }
    });
 });
 