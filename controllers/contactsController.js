const Contact = require('../model/contacts');
const Messages = require('../model/messages');
const { Op } = require("sequelize");


module.exports.index = async function (req, res) {

  const contact = await Contact.findAll({
    where: {ToEmail : req.query.ToEmail}
  });
  console.log("All contact:", req.query.ToEmail);
  res.json(contact);
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
              contact.update({ToName:updateData?.Name}, {where:{Email:updateData.Email}})
              //ToName 'i güncelle updateData.Name ile
            }else if(msg.dataValues.ToEmail === loginEmail){
              msg.update({Name:updateData?.Name}, {where:{Email:updateData.Email}})
              contact.update({Name:updateData?.Name}, {where:{Email:updateData.Email}})
              //Name 'i güncelle updateData.Name ile
            }
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

      
      try{
        if (!contact) {
          let contactData = {
            Name: ContactData.Name,
            Email: ContactData.Email,
            ToName: ContactData.ToName,
            ToEmail: ContactData.ToEmail,
          };
            
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
          res.status(313).json({
            status: false,
            statusCode: 313,
            message: "Contact is already added in"
          }); 
        }
        }catch(err){
            console.log(err)
        }

  

};

