const { Router } = require('express');
const gigWorkerRouter = require('./gig-worker/gigWorker.router');
const userRouter = require('./users/user.router');
// const claimRouter = require('./claim/claim.router');
// const settingsRouter = require('./settings/settings.router');
// const transactionRouter = require('./transaction/transaction.router');
// const notificationsRouter = require('./notifications/notifications.router');
const router = Router();

router
.use('/users', userRouter)
.use('/gig-workers', gigWorkerRouter)
// .use('/claims', claimRouter)
// .use('/settings', settingsRouter)
// .use('/settings', settingsRouter)
// .use('/transaction', transactionRouter)
// .use('/notifications', notificationsRouter)
.get('/', (req, res, next) => {

		res.send('hello world, are you bold ? ')
})


module.exports = router;