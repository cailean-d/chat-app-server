const fs = require('fs'); 
const path = require('path');     
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));

let dbconfig;
let mongodb = config.db.mongodb;

if((mongodb.user == '') && (mongodb.password == '')){

    dbconfig = `mongodb://${mongodb.host}:${mongodb.port}/${mongodb.database}`

} else{

    dbconfig = `mongodb://${mongodb.user}:${mongodb.password}@${mongodb.host}:${mongodb.port}/${mongodb.database}`
    
}

module.exports = dbconfig;