const { CAN_NOT_CHANGE_PASSWORD, INVALID_RESET_CODE, EXPIRED_RESET_CODE } = require("../config/error.message");

module.exports = isResetCodeValid = (userResetCode, dbResetCode, validityDate) => {
	let result = {
		valid: true,
		message: 'Password changed successfully...'
	}
	if(dbResetCode === null || dbResetCode === "") {
		result.valid = false,
		result.message = CAN_NOT_CHANGE_PASSWORD
		return result;
	}
	if(userResetCode !== dbResetCode) {
		result.valid = false;
		result.message = INVALID_RESET_CODE;
		return result;
	}
	const now = new Date();
    const future = new Date(validityDate);
	if(future < now) {
		result.valid = false;
		result.message = EXPIRED_RESET_CODE;
	}
    return result;
}