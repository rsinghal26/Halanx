var express  = require("express");
var router   = express.Router();
var authController = require("../controllers/authController");

router.get("/login",(req,res)=>{
    if(!req.cookies.auth){
        res.render("login",{token:req.cookies.auth});
    }else{
        res.redirect("/dashboard");
    }    
});

router.post("/login",authController.user_login); 
router.get("/logout",authController.user_logout);


module.exports = router;