const User = require('../model/signUp');
const Login = require('../model/login');
const jwt = require('jsonwebtoken')

module.exports.delete = async function (req, res) {
  let id= req.query.email

  await Login.destroy({where: {Email: id}})
  .then((result)=>{
    res.status(200).json({
        status: true,
        statusCode: 200,
        message: "User is successfully deleted"
    }); 
  })
  .catch((err)=>{
    res.status(300).json({
        status: false,
        statusCode: 300,
        message: "User isn't successfully deleted"
    }); 
      console.log(err)
  });
};


module.exports.index = async function (req, res) {

  const login = await Login.findAll({

  });
  console.log("All login:", JSON.stringify(login, null, 2));
  res.json(login);
};

module.exports.post = async function (req, res) {
  let LoginData = JSON.parse(req.body.Login);

      const user = await User.findOne({
        where: {Email : LoginData.Email}
      });
      
      const login = await Login.findOne({
        where: {Email : LoginData.Email}
      });
      
      try{
        if (user && !login && user.dataValues.Password === LoginData.Password) {
          //işlemleri yap
          const token = jwt.sign(
            {email: LoginData.Email, name :  LoginData.Name},
            process.env.SECRET_TOKEN,
            {
              expiresIn: "365d",
            }
          );
          let loginData = {
            Name: LoginData.Name,
            Email: LoginData.Email,
            Token: token
          };
            
          await Login.create(loginData)
          .then((result)=>{
            res.status(200).json({
                status: true,
                statusCode: 200,
                message: "User is successfully logged in",
                data: loginData,
            }); 
          })
          .catch((err)=>{
            res.status(300).json({
                status: false,
                statusCode: 300,
                message: "User isn't successfully logged in",
                err:err
            }); 
              console.log(err)
          });
          
        }else{
          if (login) {
            res.status(313).json({
              status: false,
              statusCode: 313,
              message: "User is already logged in"
            }); 
          }else if(!user){
            res.status(314).json({
              status: false,
              statusCode: 314,
              message: "User doesn't exist"
            }); 
          }else if(user.dataValues.Password !== LoginData.Password){
            res.status(315).json({
              status: false,
              statusCode: 315,
              message: "Password false"
            }); 
          }else{
            res.status(316).json({
              status: false,
              statusCode: 316,
              message: "I don't know why?"
            }); 
          }
        }
        }catch(err){
            console.log(err)
        }

  

};

