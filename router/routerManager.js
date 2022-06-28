module.exports = function (app,io) {
    const loginRouter=require('./loginRouter');
    const routeSignUp=require('./signUpRouter');
    const routeMessages=require('./messagesRouter');
    const routeContacts=require('./contactsrouter');
    const socketConfig=(req,res,next)=>{
        req.socket=io;
        next();
    }
    app.use(socketConfig);
    app.use('/user-login',loginRouter);
    app.use('/user-signup',routeSignUp);
    app.use('/messages',routeMessages);
    app.use('/contacts',routeContacts);

};
