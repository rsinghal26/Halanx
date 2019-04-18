var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    flash                   = require("connect-flash"),
    Request                 = require("Request"),
    methodOverride          = require('method-override'),
    cookieParser            = require('cookie-parser');

var authRoutes = require("./routes/auth");
var dashboardRoutes = require("./routes/dashboard");

app.listen(process.env.PORT || 3000,function(){
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
app.use(methodOverride('_method'));

app.use(function(req,res,next){
    res.locals.token = req.cookies.auth;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
  });
//=============================================================================================
app.get("/",function(req,res){ 
    res.redirect("/auth/login");
});

app.use("/auth",authRoutes);
app.use("/dashboard", dashboardRoutes);

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
 