const Validator = require("../Validator");

class GigWorkerValidator extends Validator {

    postDto(data){
        return this.joi.object({
            user_id: this.joi.any().optional(),
            first_name: this.joi.any().optional(),
            last_name: this.joi.any().optional(),
            address: this.joi.any().optional(),
            contact_number: this.joi.any().optional(),
            profile_picture: this.joi.any().optional(),
            work_rights: this.joi.any().optional(),
            status: this.joi.any().optional(),
            verified: this.joi.any().optional(),
            gig_types: this.joi.any().optional(),
            available_time: this.joi.any().optional(),
            license: this.joi.any().optional(),
            venue_experience: this.joi.any().optional(),
            certification: this.joi.any().optional(),
            language: this.joi.any().optional(),
            last_login: this.joi.any().optional(),
        }).validate(data);
    }

    updateDto(data){
        return this.joi.object({
            first_name: this.joi.any().optional(),
            last_name: this.joi.any().optional(),
            address: this.joi.any().optional(),
            contact_number: this.joi.any().optional(),
            profile_picture: this.joi.any().optional(),
            work_rights: this.joi.any().optional(),
            status: this.joi.any().optional(),
            verified: this.joi.any().optional(),
            gig_types: this.joi.any().optional(),
            available_time: this.joi.any().optional(),
            license: this.joi.any().optional(),
            venue_experience: this.joi.any().optional(),
            certification: this.joi.any().optional(),
            language: this.joi.any().optional(),
        }).validate(data);
    }

}

module.exports = new GigWorkerValidator();