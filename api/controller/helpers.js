const mongoose = require("mongoose");

function respond(err, result, res, next) {
    if (err) {
        if(err instanceof mongoose.Error.ValidationError){
            err.status = 400;
        }
        return next(err);
    }
    return res.json(result);
}

module.exports = { respond };
