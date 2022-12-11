const { Router } = require('express');
// const { auth, admin } = require('../../../middleware');
const UserController = require('./User.Controller');
const userRouter = Router();

userRouter
// .get('/', auth, admin, UserController.fetch)
// .put('/admin',auth, admin, UserController.updateUser)
// .post('/admin',auth, admin, UserController.addUser)
// .get('/admin/single/:id', auth, admin, UserController.fetchOneByAdmin)
// .get('/email/:email', auth, admin, UserController.usersByEmail)

// .get('/single', auth, UserController.fetchOne)
.post('/check', UserController.userExists)
.post('/register', UserController.signUp)
.post('/login', UserController.login)
.post('/verify', UserController.verifyUser)
.post('/userType', UserController.setUserType)
.post('/forgot', UserController.forgotPassword)
.post('/forgot/verify', UserController.verifyResetCode)
.post('/forgot/reset', UserController.resetPassword)


module.exports = userRouter;