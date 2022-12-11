const { Router } = require('express');
const GigWorkerController = require('./GigWorker.Controller');
// const { auth, admin } = require('../../../middleware');
const gigWorkerRouter = Router();

gigWorkerRouter
// .get('/', auth, admin, UserController.fetch)
// .put('/admin',auth, admin, UserController.updateUser)
// .post('/admin',auth, admin, UserController.addUser)
// .get('/admin/single/:id', auth, admin, UserController.fetchOneByAdmin)
// .get('/email/:email', auth, admin, UserController.usersByEmail)

// .get('/single', auth, UserController.fetchOne)
.get("/", GigWorkerController.fetch)
.get("/:id", GigWorkerController.findOne)
.post("/", GigWorkerController.create)
.put("/:id", GigWorkerController.update)
.delete("/:id", GigWorkerController.delete)


module.exports = gigWorkerRouter;