var Request  = require("request");

exports.user_login = (req,res)=>{
    
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

        if(response.statusCode == 200){
            var result = JSON.parse(body);
            res.cookie('auth',result.key);
            res.redirect("/dashboard");
        }else{
            req.flash("error","Invalid details please try again");
            return res.redirect("/auth/login");
        }
        
    });
};


exports.user_logout =  (req,res)=>{
    
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

        if(response.statusCode == 200){
            res.clearCookie("auth");
            req.flash("success","Successfully logged out");
            return res.redirect("/auth/login");
        }
        
    }); 
};