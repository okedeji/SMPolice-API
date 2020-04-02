const { gql } = require('apollo-server-express');
const { getUsers, getUser, getBlockInfo, addUser, addBlockInfo } = require("./controller/controller")

const typeDefs = gql `
    type User {
        nickname: String!
        email: String!
        password: String!
        allowedHours: Int!
        activeDays: String!
        markedSites: String!
    }

    type Query {
        getUsers: [User]
        getUser(nickname: String!, password: String!): User
        getBlockInfo(nickname: String!): User
    }

    type Mutation {
        addUser(nickname: String!, email: String!, password: String!): User
        addBlockInfo(allowedHours: Int!, activeDays: String!, markedSites: String!): User
    }
`

const resolvers = {
    Query: {
        getUsers: async (parent, args) => {
            return await getUsers();
        },
        getUser: async (parent, args) => {
            return await getUser(args);
        },
        getBlockInfo: async (parent, args) => {
            return await getBlockInfo(args);
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            return await addUser(args)
        },
        addBlockInfo: async (parent, args) => {
            return await addBlockInfo(args)
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}