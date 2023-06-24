var mongoose = require('mongoose');
var envs = require('./env')

// mongoose.set('debug', true);

// const uri = `mongodb+srv://${envs.DB_USERNAME}:${envs.DB_PASSWORD}@${envs.DB_CLUSTER}/${envs.DB_DATABASE}?retryWrites=true&w=majority`;

// const uri = `mongodb://localhost:27017/lovealarmy`
var DB = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

DB.once("open", async () => {
    console.log(`Connected to database - ${envs.DB_DATABASE}`);
});

DB.on("error", () => {
    console.log("Error connecting to database");
});

module.exports = DB