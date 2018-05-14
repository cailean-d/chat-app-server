const UserModel = require('./../models/user');

class User {

    registerUser(nickname, email, password) {
        let user = new UserModel({
            nickname: nickname,
            email: email,
            password: password,
            accountType: 'local'
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

    findOrCreate(profile, callback) {

        UserModel.findOne({ [profile.provider + 'Id'] : profile.id}, (err, doc) => {
            if (err) return callback(err, null);
            if (doc) {
                return callback(null, doc);
            } else {
                let user = new UserModel({
                    [profile.provider + 'Id'] : profile.id,
                    nickname:  profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    password: '___',
                    accountType: profile.provider
                });
                user.save().then(() => {
                    return callback(null, user);
                });
            }
        });
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