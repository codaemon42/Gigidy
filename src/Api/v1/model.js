const User = require("./users/user.model");
const UserRole = require("./users/userRole/UserRole.model");
const GigWorkers = require("./gig-worker/gigWorker.model");
const Ratings = require("./ratings/ratings.model");
// const Claim = require('./claim/claim.model');
// const ClaimDetails = require('./claim/claimDetails/claimDetails.model');
// const Transaction = require('./transaction/transaction.model');
// const Settings = require('./settings/settings.model');
// const Notifications = require('./notifications/notifications.model');

// sync
// User.sync({alter: true});
// UserRole.sync({alter: true});
// GigWorkers.sync({alter: true});
// Ratings.sync({alter: true});
// Claim.sync({alter: true})
// ClaimDetails.sync({alter: true})
// Transaction.sync({alter: true})
// Settings.sync({alter: true})
// Notifications.sync({alter: true})


// relations
User.hasOne(UserRole, {
	foreignKey: 'id',
	sourceKey: 'roleId'
});
// GigWorkers.hasMany(Ratings);
// Ratings.belongsTo(GigWorkers);
// User.hasMany(Claim)
// Claim.hasOne(ClaimDetails)
// Claim.belongsTo(User)
// Claim.hasMany(Transaction)


module.exports = {
	User,
	UserRole,
	GigWorkers,
	Ratings
	// Claim,
	// ClaimDetails,
	// Transaction,
	// Settings,
	// Notifications
}