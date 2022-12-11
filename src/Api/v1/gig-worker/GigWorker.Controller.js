const { PERMISSION_DENIED } = require("../../../config/error.message");
const { console } = require("../../../helpers");
const Controller = require("../Controller");
const GigWorkerService = require("./GigWorker.Service");
const GigWorkerValidtor = require("./GigWorker.validtor");

class GigWorkerController extends Controller {
    
    constructor(){
        super(GigWorkerValidtor, GigWorkerService)
        console('GigWorkerController controller created');
    }

    async create(req, res, next) {
		try{
			const data = req.body;

			const validation = this.validation.postDto(data);
			const validationHandler = isValid(validation);
			if(!validationHandler.valid) return next(validationHandler.error);

			const userIdExist = await GigWorkerService.findByUserId(data.user_id);
			if(userIdExist) return res.status(403).json(prepare(false, PERMISSION_DENIED, false));

			const result = await GigWorkerService.create(data);

			return res.status(201).json(prepare(result, `${result.title} category created successfully`));
		} catch(err) {
			console(err.message);
			return next(createError(500))
		}
	}
}

module.exports = new GigWorkerController();