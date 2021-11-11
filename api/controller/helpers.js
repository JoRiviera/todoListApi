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

function removeDuplicatesFromArray(arr){
    const uniquesFound = new Map();
    const uniquesArray = []
    arr.forEach(ele => {
        if(!uniquesFound.has(ele)) {
            uniquesFound.set(ele, true);
            uniquesArray.push(ele);
        }
    });
    return uniquesArray;
}

module.exports = { respond, removeDuplicatesFromArray };
