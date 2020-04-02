const   express = require("express"), app = express(),
        bodyParser = require("body-parser"),
        // route = require("./routes/route"),
        db = require("./configs/db"),
        User = require("./models/User"),
        { ApolloServer } = require('apollo-server-express'),
        { typeDefs, resolvers} = require("./schema");

db.authenticate()
    .then(() => {
        User.findAll()
            .then(user => console.log("Server Connected to Postgresql database"))
            .catch(err => db.sync())
    })
    .catch(err => console.log("Error :" + err))

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});

app.set("port", process.env.PORT || 2020); 

app .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(bodyParser.json({ type: 'application/json'}))
    .use(require("./configs/cors")) 

// route(express, app);
server.applyMiddleware({ app });

app.listen(app.get("port"), ()=>console.log(`Server listening on http://localhost:${app.get("port")}${server.graphqlPath}`));

module.exports = app;