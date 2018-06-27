const ConfirmModel = require('./../models/confirm');

class Confirm {
 
    addHash(user, hash){
        let confirm = new ConfirmModel({ 
            user_id: user,
            hash: hash
        });
        return confirm.save(); 
    }
    
    deleteHash(user){
        return ConfirmModel.findOneAndRemove({
            $and: [
                { user_id: user },
            ]
        });
    }

    getHash(hash){
        return ConfirmModel.findOne({
            $and: [
                { hash: hash }
            ]
        });
    }

}

module.exports = new Confirm();