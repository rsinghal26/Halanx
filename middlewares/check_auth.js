module.exports = (req,res,next)=>{
  
  try{
      const token = req.cookies.auth;
      if(token)
        next();
      else
        res.redirect("/auth/login");       
  }catch (error){
    res.status(401).json({message:"Auth failed"});      
  }

};