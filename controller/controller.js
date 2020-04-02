const User = require("../models/User");
const bcrypt = require("bcryptjs")
const Controller = {};

Controller.getUsers = async () => {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: "Error Occured"
        }
    }
}

Controller.getUser = async (payLoad) => {
    try {
        let {nickname, password} = payLoad;

        const user = await User.findOne({
            where: {nickname},
            attributes: ['nickname', 'email', "password"]
        });

        if(user){
            if(bcrypt.compareSync(password, user.password)) return user;
            else return {
                status: false,
                message: "Password Incorrect"
            }
        }else return {
            status: false,
            message: "nickname does not exist"
        }

    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: "Error Occured"
        }
    }
}

Controller.getBlockInfo = async (payLoad) => {
    try {
        let {nickname} = payLoad;

        const user = await User.findOne({
            where: {nickname},
            attributes: ['markedSites', 'allowedHours', "activeDays"]
        })
        return user;

    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: "Error Occured"
        }
    }
}

Controller.addUser = async (payLoad) => {
    try {
        let {nickname, email, password} = payLoad;
        password = bcrypt.hashSync(password, 8);

        const user = await User.create({nickname, email, password});

        return user;
    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: "Error Occured"
        }
    }
}

Controller.addBlockInfo = async (payLoad) => {
    try {
        let {allowedHours, activeDays, markedSites, nickname} = payLoad;
        markedSites = markedSites.toLowerCase();

        await User.update(
            { allowedHours, activeDays, markedSites },
            {where: { nickname }
        });

        const user = await User.findOne({
            where: {nickname},
            attributes: ['allowedHours', 'activeDays', "markedSites"]
        })
        return user;
    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: "Error Occured"
        }
    }
}


module.exports = Controller;