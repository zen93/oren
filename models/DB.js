const mongoose = require('mongoose');
const config = require('../config');

class DB {
    connect = () => {
        return new Promise((resolve, reject) => {
            const options = {
                user: config.mongoUser,
                pass: config.mongoPassword,
            };
            const mongoUri = `mongodb://${config.mongoHost}:${config.mongoPort}/${config.mongoDb}`;
            
            mongoose.connect(mongoUri, options)
                .then(() => {
                    this.connected = true;
                    console.log(`Connected to db ${config.mongoDb}`);
                    resolve('mongoose connected');
                }) 
                .catch((err) => {
                    console.error(err)
                    console.trace();
                    reject('mongoose error!');
                });
            
            mongoose.connection.on('error', err => {
                console.error('Mongoose connection error:', err);
            });   
            
        });        
    }

    close = () => {
        return new Promise((resolve, reject) => {
            mongoose.disconnect()
            .then(() => {
                this.connected = false;
                console.log('Disconnected from DB');
                resolve('mongoose disconnected');
            })
            .catch((err) => {
                console.error(err);
                console.trace();
                reject('Error disconnecting!');
            });
        });
    }
}

module.exports = DB;