module.exports = (express, app) => {
    const   bcrypt = require('bcryptjs'),
            User = require("../models/User"),
            router = express.Router();

    router.route("/allUsers").get((req, res) => {
        User.findAll()
            .then(users => res.json(users))
            .catch(err => console.log(err))
    })

    router.route("/addUser").post((req, res) => {
        let {nickname, email, password} = req.body;
        password = bcrypt.hashSync(password, 8),

        User.create({nickname, email, password})
            .then(user => res.sendStatus(200))
            .catch(err => {
                res.json({
                    status: false,
                    message: err.errors[0].type,
                    path: err.errors[0].path
                })
                console.log("ERROR:", err.errors[0].type +" ==> "+ err.errors[0].path)
            }) 
    })

    router.route("/getUser").post((req, res) => {
        let {nickname, password} = req.body;

        User.findOne({
            where: {nickname},
            attributes: ['nickname', 'email', "password"]
        })
        .then(user => {
            if(user){
                if(bcrypt.compareSync(password, user.password)) res.json(user)
                else res.json({
                    status: false,
                    message: "Password Incorrect"
                })
            }else res.json({
                status: false,
                message: "nickname does not exist"
            })
        })
        .catch(err => {
            res.sendStatus(404)
            console.log(err)
        })
    })

    router.route("/blockInfo").post((req, res) => {
        let {allowedHours, activeDays, markedSites, nickname} = req.body;
        markedSites = markedSites.toLowerCase();

        User.update(
            { allowedHours, activeDays, markedSites },
            {where: { nickname }})
            .then(() =>{
                User.findOne({
                    where: {nickname},
                    attributes: ['allowedHours', 'activeDays', "markedSites"]
                })
                .then(user=> res.json(user))
                .catch(err => {
                    res.sendStatus(400)
                    console.log("ERROR:", err)
                })
            })
            .catch(err => {
                res.sendStatus(403)
                console.log(err)
            })
    })

    router.route("/getBlockInfo").post((req, res) => {
        let {nickname} = req.body;

        User.findOne({
            where: {nickname},
            attributes: ['markedSites', 'allowedHours', "activeDays"]
        })
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.sendStatus(404)
            console.log(err)
        })
    })

    app .use("/", router);
}