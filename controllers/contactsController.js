const Contact = require('../model/contacts');
const Messages = require('../model/messages');
const SignUps = require('../model/signUp');
const { Op } = require("sequelize");


module.exports.index = async function (req, res) {

  const contact = await Contact.findAll({
    where: {ToEmail : req.query.ToEmail}
  });
  //console.log("All contact:", contact);
  res.json(contact);
};


module.exports.delete = async function (req, res) {
  let contact= req.query.toEmail
  let user= req.query.email

  try {
    await Contact.destroy(
      {where: 
        {
          Email: contact,
          ToEmail: user
        }
      }
      )
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
  } catch (error) {
    console.log(error)
  }
};

module.exports.put = async function(req, res){
  let email= req.query.email //güncellenecek mail
  let loginEmail= req.query.loginEmail //kim tarafından güncelleniyor?
  let updateData = JSON.parse(req.body.Update);
  const contact = await Contact.findOne({
      where: {
        Email : email,
        ToEmail : loginEmail
      }
  });
  const contactMsg = await Messages.findAll({
    where: {
      [Op.or]: [
        {  Email : req.query.email  ,
          ToEmail: req.query.loginEmail},
        {  Email : req.query.loginEmail,
          ToEmail: req.query.email }
      ]
    }
  });

console.log("msg:", JSON.stringify(contactMsg, null, 2))
  try{
      if(contact){
        if(contactMsg){
          contactMsg.forEach(msg => {
            if(msg.dataValues.Email === loginEmail){
              msg.update({ToName:updateData?.Name}, {where:{Email:updateData.Email}})
              contact.update({Name:updateData?.Name}, {where:{Email:updateData.Email}})
              //ToName 'i güncelle updateData.Name ile
            }
            // else if(msg.dataValues.ToEmail === loginEmail){
            //   msg.update({Name:updateData?.Name}, {where:{Email:updateData.Email}})
            //   contact.update({Name:updateData?.Name}, {where:{Email:updateData.Email}})
            //   //Name 'i güncelle updateData.Name ile
            // }
          console.log("----")           
          console.log(msg.dataValues)           
          console.log("----")           
          })
        }
      await contact.update(updateData, {where:{Email:updateData.Email}})
      .then((result)=>{
      res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Contact is successfully updated",
          data: updateData,
      }); 
      })
      .catch((err)=>{
      res.status(300).json({
          status: false,
          statusCode: 300,
          message: "Contact isn't successfully updated",
          err:err
      }); 
          console.log(err)
      });
      }else{
      res.status(312).json({
          status: false,
          statusCode: 312,
          message: "This Contact isn't registered"
      }); 
      }
  }catch(err){
      console.log(err)
  }

};

module.exports.post = async function (req, res) {
  let ContactData = JSON.parse(req.body.Contacts);

      const contact = await Contact.findOne({
        where: { 
          [Op.and]: [
          {  Email : ContactData.Email } ,
          {  ToEmail: ContactData.ToEmail}
        ]}
      });

      const signUps = await SignUps.findOne({
        where: {
          Email : ContactData.Email
        }
      });

      try{
        if (!contact && signUps) {
          let contactData = {
            Name: ContactData.Name,
            Email: ContactData.Email,
            ToName: ContactData.ToName,
            ToEmail: ContactData.ToEmail,
          };
            console.log("121212")
            console.log(contactData)
            console.log("151515")
            await Contact.create(contactData)
            .then((result)=>{
              res.status(200).json({
                  status: true,
                  statusCode: 200,
                  message: "Contact is successfully added in",
                  data: contactData,
              }); 
            })
            .catch((err)=>{
              res.status(300).json({
                  status: false,
                  statusCode: 300,
                  message: "contact isn't successfully added in",
                  err:err
              }); 
                console.log(err)
            });
          
        }else{
          if(contact){
            res.status(313).json({
              status: false,
              statusCode: 313,
              message: "Contact is already added in"
            }); 
          }else if(!signUps){
            res.status(314).json({
              status: false,
              statusCode: 314,
              message: "User didn't use application"
            }); 
          }
          
        }
        }catch(err){
            console.log(err)
        }

  

};

