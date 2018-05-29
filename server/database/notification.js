const NotificationModel = require('./../models/notification');

class Room {
 
    addNotification(user, message){
        let notif = new NotificationModel({ 
            user_id: user,
            message: message
        });
        return notif.save(); 
    }
    
    deleteNotification(user, record){
        return NotificationModel.findOneAndRemove({
            $and: [
                { user_id: user },
                { id: record }
            ]
        });
        
    }

    getNitifications(user){
        return NotificationModel.find({user_id : user});
    }

}

module.exports = new Room();