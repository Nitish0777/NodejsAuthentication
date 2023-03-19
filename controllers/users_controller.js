const User = require('../models/user');
const bcrypt =require('bcrypt');



// render the sign up page
module.exports.signUp=function(req,res){
    return res.render('user_sign_up',{
        title:'User | SignUp'
    })
    
}

// render the sign in page
module.exports.signIn=function(req,res){
    return res.render('user_sign_in',{
        title:'User | SignIn'
    })
}
module.exports.changePasswordPage=function(req,res){
    return res.render('change_password_page',{
        title:'User | Change_password_page'
    })
}





// creating the user in the database
module.exports.create = async  function(req,res){
    try{
        const { name, email, password, password_confirmation } = req.body;
        const user = await User.findOne({ email: email });
        if(user){
            return res.status(200).json({
                status: "failed",
                message: "Email already exists",
            });
        } 
        else{
            if(name && email && password && password_confirmation){
                if(password === password_confirmation) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    // bcrypt.hash(password,10)
                    // .then((hashedPassword)=>{
                    //     User.create({
                    //         name: name,
                    //         email: email,
                    //         password: hashedPassword,
                            
                    //     });
                    // })
                    await User.create({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        
                    });
                    return res.redirect('/users/sign-in')

                }
                else{
                    return res.status(400).json({
                        status: "failed",
                        message: "Password and confirm password do not match",
                    });
                }
            }
            else{
                return res.status(200).json({
                    status: "failed",
                    message: "All fields are required",
                });
            }
        }
    } 
    catch(err){
        return res.status(200).json({
            status: "failed",
            message: "inside catch",
            error: err,
        });
    }
}


// creating the session for the user
// getting the sign in data and creating a session for the user
module.exports.createSession=function(req,res){
    return res.redirect("/");
}



module.exports.destroySession = function(req, res, next) {
    // This function is given to req by passport.js
    req.logout(function(err) {
      if (err) { 
        // Handle error
        return next(err); 
      }
      return res.redirect('/');
    });
}


module.exports.changeUserPassword = async (req,res)=>{
    const {old_password,new_password, new_password_confirmation} = req.body;
    
    if(old_password && new_password && new_password_confirmation){

        try {
            let user = await User.findOne({email:req.user.email});
            if(user){
                const isMatch = await bcrypt.compare(old_password, user.password);
                if(isMatch){
                    // console.log("yes Old Password matched");
                    if(new_password === new_password_confirmation){
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(new_password, salt);
            
                        // below three methodology are achieving the same goal at the end but I want to know the difference between them
            
                        // 1st one
                        // let user = await UserModel.findById(req.user._id);
                        // user.password=hashedPassword;
                        // user.save();
            
            
                        // 2nd one
                        // await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: hashedPassword }});
            
            
                        // 3rd one
                        await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
                        // console.log("Password updated");
                        return res.redirect('/');
            
            
                    }else{
                        return res.status(200).json({
                            message:'New password and New confirm password do not match'
                        })
                    }
                }else{

                    // console.log("Old Password Entered is wrong");
                    return res.status(200).json({
                        message:'Old Password Entered is wrong'
                    })  
                }
            }else{
                // console.log("Not a valid user");
                return res.status(200).json({
                    message:'Not a valid user'
                })
    
            }
        }catch (error) {
            return res.status(200).json({
                message:'Inside catch',
                error:error
            })
        }
     
    }else{
        return res.status(200).json({
            message:'All fields are required'
        })
    }
}
  


