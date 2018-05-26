const fs = require('fs');  
const database = require('../database/users');
const room = require('../database/rooms');
const uniqid = require('uniqid');
const config = JSON.parse(fs.readFileSync('./conf/config.json', 'utf-8'));

class UploadAPI {

    constructor() {
        const proto = Object.getPrototypeOf(this);
        const names = Object.getOwnPropertyNames(proto);
        for (const i of names) {
            this[i] = this[i].bind(this);
        }
    }
    
    getType(mimetype){
        if (mimetype.indexOf('jpeg') != -1 ){
            return "jpeg";
        } else if(mimetype.indexOf('png') != -1){
            return "png";
        }
    }
    
    async uploadAvatar(req, res){
        try {
            if(!req.files.avatar){
              return  res.status(400).json({ 
                  status: 400, 
                  message: 'File is not uploaded',
                  data: null
                }); 
            }
    
            let type = req.files.avatar.mimetype;
            let id = uniqid();
            let fileType = this.getType(type);
            let filename = `${id}.${fileType}`;
    
            file = req.files.avatar;
    
            if(fileType != 'jpeg' || fileType != 'png'){
                return  res.status(400).json({ 
                    status: 400, 
                    message: 'Please upload jpeg or png image',
                    data: null
                }); 
            }

            let fileFullPath = `assets/images/avatar/${filename}`;
    
            await file.mv(config.client_root + fileFullPath);
            await database.updateUser(req.user.id, {avatar: fileFullPath});
            return res.status(200).json({ status: 200, message: "success", data: fileFullPath});
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error}); 
        }
    }
    
    async uploadRoomImage(req, res){
        try {
            if(!req.files.room_image){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'File is not uploaded!',
                    data: null
                }); 
            }
    
            if(!req.params.room){
                return res.status(400).json({ 
                    status: 400, 
                    message: '-id- is required',
                    data: null
                }); 
            }
    
            if(!/^\d+$/.test(req.params.room)){
                return res.status(400).json({ 
                    status: 400, 
                    message: "-id- must be a number",
                    data: null
                });
            }
    
            req.params.room = Number(req.params.room);
    
            let room = await room.findRoom(req.params.room);
            let user = await database.getUser(req.user.id);
    
            if(!room){
               return res.status(400).json({ 
                   status: 400, 
                   message: 'Room doesnt exist', 
                   data: null
                }); 
            }
    
            if(room.owner != req.user.id){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'room image can be changed only by room owner', 
                    data: null
                 }); 
            }
    
            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User not found', 
                    data: null
                }); 
            }
    
            let rooms_id = user.rooms;
            
            if(rooms_id.indexOf(req.params.room) == -1){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'You are not a member of this room',
                    data: null
                }); 
            }
    
            let type = req.files.room_image.mimetype;
            let id = uniqid();
            let fileType = getType(type);
            let filename = `${id}.${fileType}`;
    
            file = req.files.room_image;
    
            if(fileType != 'jpeg' || fileType != 'png'){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'Please upload jpeg or png image',
                    data: null
                }); 
            }

            let fileFullPath = `assets/images/room_avatar/${filename}`;
    
            await file.mv(config.client_root + fileFullPath);
            await room.setPic(req.params.room, fileFullPath);
            return res.status(200).json({ status: 200, message: "success", data: fileFullPath});
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }

    async uploadFile(req, res) {
        try {

            if(!req.files.file){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'File is not uploaded!',
                    data: null
                }); 
            }
    
            let type = req.files.file.mimetype;
            let id = uniqid();
            let fileType = getType(type);
            let filename = `${id}.${fileType}`;
    
            file = req.files.file;

            let fileFullPath = `assets/files/${filename}`;
    
            await file.mv(config.client_root + fileFullPath);
            await room.setPic(req.params.room, fileFullPath);
            return res.status(200).json({ status: 200, message: "success", data: fileFullPath});
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: error, data: null}); 
        }
    }
    
}

module.exports = new UploadAPI();
