const User = require('../model/signUp');
const { Op } = require("sequelize");
module.exports.index = async function (req, res) {
    const user = await User.findAll({
        
    });
    console.log("All user:", JSON.stringify(user, null, 2));
    res.json(user);
};

module.exports.put = async function(req, res){
    let id= req.query.email
    let updateData = JSON.parse(req.body.Update);
    const user = await User.findOne({
        where: {Email : id}
    });

    try{
        if(user){
        await user.update(updateData, {where:{Email:updateData.Email}})
        .then((result)=>{
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "User is successfully updated",
            data: updateData,
        }); 
        })
        .catch((err)=>{
        res.status(300).json({
            status: false,
            statusCode: 300,
            message: "User isn't successfully updated",
            err:err
        }); 
            console.log(err)
        });
        }else{
        res.status(312).json({
            status: false,
            statusCode: 312,
            message: "This user isn't registered"
        }); 
    }
    }catch(err){
        console.log(err)
    }

};

module.exports.post = async function (req, res) {
    let LoginData = JSON.parse(req.body.SignUp);

    const user = await User.findOne({
        //     attributes: ['email', ['name', 'isim']],
        where: {Email : LoginData.Email}
    });


    let loginData = {
        Name: LoginData.Name,
        Email: LoginData.Email,
        Password: LoginData.Password,
    };


    try{
        if(!user)
        {
        await User.create(loginData)
        .then((result)=>{
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "User is successfully created",
            data: loginData,
        }); 
        })
        .catch((err)=>{
        res.status(300).json({
            status: false,
            statusCode: 300,
            message: "User isn't successfully created",
            err:err
        }); 
            console.log(err)
        });
    }else{
        res.status(312).json({
            status: false,
            statusCode: 312,
            message: "User is exits"
        }); 
    }
    }catch(err){
        console.log(err)
    }


    

};