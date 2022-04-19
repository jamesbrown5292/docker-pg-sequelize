const express = require('express');
const sequelize = require('./util/database');
const User = require('./models/users')
const app = express();

//use body parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//set access headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

//use routes
app.use('/user', require('./routes/user'));

//connect to DB
( async () => {try {
    await sequelize.sync(
        {force: false}
    )
    console.log("Server connected")
    app.listen(process.env.EXTERNAL_PORT || 3001)
} catch (error) {
    console.error(error)
}})();