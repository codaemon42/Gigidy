const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const {console} = require('../helpers')


module.exports = (req, res, next) => {
    console("auth is entered");
    if(!req.get('Authorization')){
        console("unauthorized");
        return next(createError(401));
    }
    console("auth before secret");
    const secret = process.env.JWT_SECRET;
    const token = req.get('Authorization').split(' ')[1];
    console("token : ", token);

    try{
        const decode = jwt.verify(token, secret);
        console(decode);
        if(typeof decode.id === 'undefined') return next(createError(401))
        req.user = {id: decode.id, username: decode.username, role: decode.role};
        console("auth");
        next();
    }
    catch(err){
        next(createError(401));
    }
}