var Request      = require("request");


exports.get_stores = (req,res)=>{

    Request.get({
        "headers": { "Authorization": "Token "+req.cookies.auth},
        "url": "http://testapi.halanx.com/stores/",

    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }

        if(response.statusCode == 200){
            var result = JSON.parse(body);
            res.render("stores",{store:result});
        }          
    });    
};

exports.get_timings = (req,res)=>{

    Request.get({
        "headers": { "Authorization": "Token "+req.cookies.auth},
        "url": "http://testapi.halanx.com/places/place/"+req.params.id+"/openinghours/",

    }, (error, response, body) => {

        if(error) {
            return console.log(error);
        }
        
        if(response.statusCode == 200){
            var result = JSON.parse(body);
            res.render("placeOpening",{data:result});
        }else if(response.statusCode == 401){
            req.flash("error","Please login with Your account to access");
            res.redirect("/auth/login");
        }else if( response.statusCode == 404){
            req.flash("error","Data not found");
            res.redirect("/dashboard");
        }else{
            req.flash("error","Something went wrong!! try again later");
            res.redirect("/dashboard");
        } 

    }); 
};


exports.update_timings = (req,res)=>{

    var fHour = req.body.oTime.toString()+":00";
    var tHour = req.body.cTime.toString()+":00";
    var str =  req.body.day;
    var array = str.split("-");

    Request.patch({
        "headers": { 
            "Authorization": "Token "+req.cookies.auth,
            "content-type": "application/json"
         },
        "url": "http://testapi.halanx.com/places/place/"+req.body.place_id+"/openinghours/",
        "body": JSON.stringify([
                {
                    "id": array[1],
                    "weekday": array[0],
                    "from_hour": fHour,
                    "to_hour": tHour,
                    "place": req.body.place_id
                }
            ])
    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }
        if(response.statusCode == 200){
            req.flash("success",array[0]+" timing has been updated");
            res.redirect("/dashboard/place/"+req.body.place_id+"/openinghours");
        }else if(response.statusCode == 401){
            req.flash("error","Please login with Your account to access");
            res.redirect("/auth/login");
        }else if( response.statusCode == 404){
            req.flash("error","Data not found");
            res.redirect("/dashboard");
        }else{
            req.flash("error","Something went wrong!! try again later");
            res.redirect("/dashboard");
        }  
    }); 
};

exports.get_plot_page = (req,res)=>{
    res.render("viewPlots",{place_id:req.params.id, dates:0, counts:0});
};

exports.view_plot = (req,res)=>{
   // console.log(req.query.from_date);
    Request.get({
        "headers": { "Authorization": "Token "+req.cookies.auth},
        "url": "http://testapi.halanx.com/stores/dashboard/plots/?visits=true&from_date="+req.query.from_date+"&to_date="+req.query.to_date,

    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }

        if(response.statusCode == 200){
            var result = JSON.parse(body);
            var count = [];
            var date = [];
            result.visits.forEach(element => {
                count.push(element.count);
                date.push(element.date);
            });
            res.render("viewPlots",{place_id:req.params.id, dates:date, counts:count});
        }else if(response.statusCode == 401){
            req.flash("error","Please login with Your account to access");
            res.redirect("/auth/login");
        }else if( response.statusCode == 404){
            req.flash("error","Data not found");
            res.redirect("/dashboard");
        }else{
            req.flash("error","Something went wrong!! try again later");
            res.redirect("/dashboard");
        }          
    }); 
};