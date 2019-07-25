const   Sequelize = require("sequelize"),
        db = require("../configs/db");

module.exports = db.define("user", {
    nickname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    allowedHours: {
        type: Sequelize.INTEGER,
    },
    activeDays: {
        type: Sequelize.STRING,
    },
    markedSites: {
        type: Sequelize.TEXT,
    }
})
