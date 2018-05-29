const database = require('../database/notification');

class NotificationAPI {

    async getNotifications(req, res){
        try {
            let data = await database.getNitifications(req.user.id);
            res.status(200).json({ status: 200, message: "success", data: data});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }

    async deleteNotification(req, res){
        try {

            if(!req.params.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
    
            if(!/^\d+$/.test(req.params.id)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            req.params.id = Number(req.params.id);

            let data = await database.deleteNotification(req.user.id, req.params.id);

            res.status(200).json({ status: 200, message: "success", data: null});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
}

module.exports = new NotificationAPI();
