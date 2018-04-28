const UserModel = require('./../models/user');

class User {

    registerUser(nickname, email, password) {
        user = new UserModel({
            nickname: nickname,
            email: email,
            password: password,
        });
        return user.save();
    }

    deleteUser(id) {
        return UserModel.findOneAndUpdate({id : id}, {$set: {deleted: true}}, { new: true })
    }

    restoreUser(id) {
        return UserModel.findOneAndUpdate({id : id}, {$set: {deleted: false}}, { new: true })
    }

    getUser(id) {
        return UserModel.findOne({id : id});
    }

    getUserByEmail(email) {
        return UserModel.findOne({email : email});
    }

    updateUser(id, data) {
        return UserModel.findOneAndUpdate({id : id}, {$set:data}, { new: true })
    }

    getUsers(offset, limit) {
        return UserModel.find({}).skip(offset).limit(limit).exec();
    }

    getUsersByName(name, offset, limit) {
        let reg = new RegExp(name);
        return UserModel.find({nickname: { $regex: reg, $options: 'i' }}).skip(offset).limit(limit).exec();
    }

    getCount() {
        return UserModel.count({});
    }

    addRoom(room, user) {
        return UserModel.update(
            { id: user },
            { $push: { rooms: room }
        });
    }

    deleteRoom(room, user) {
        return UserModel.update(
            { id: user },
            { $pull: { rooms: room }
        });
    }
}

module.exports = new User();