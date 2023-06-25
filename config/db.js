var mongoose = require('mongoose');
var envs = require('./env')

// mongoose.set('debug', true);

const uri = `mongodb+srv://${envs.DB_USERNAME}:${envs.DB_PASSWORD}@${envs.DB_CLUSTER}/${envs.DB_DATABASE}?retryWrites=true&w=majority`;

// const uri = `mongodb://localhost:27017/lovealarm`
var DB = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((data) => {
    const db = data.connection;
    console.log('Connected to MongoDB: ', db.name);
    // console.log('Database host:', db.host);
    // console.log('Database port:', db.port);
    // console.log('Database name:', db.name);
})
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });;


module.exports = DB