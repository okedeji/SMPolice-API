const   express = require("express"), app = express(),
        bodyParser = require("body-parser"),
        uuid = require("uuid/v4"),
        route = require("./routes/route"),
        Sequelize = require('sequelize'),
        db = require("./configs/db"),
        User = require("./models/User");

db.authenticate()
    .then(() => {
        User.findAll()
            .then(user => console.log("Server Connected to Postgresql database"))
            .catch(err => db.sync())
    })
    .catch(err => console.log("Error :" + err))



app.set("port", process.env.PORT || 2020); 

app .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(bodyParser.json({ type: 'application/json'}))
    .use(require("./configs/cors")) 

route(express, app);

app.listen(app.get("port"), ()=>console.log(`Server listening on IP: 127.0.0.1:${app.get("port")}`));

module.exports = app;