const {gql} = require('apollo-server-express');


const typeDefs = gql`

type Query {
me:User
}

type Mutation {
login(email:String!, password: String!): Auth
addUser(username:String!,email:String!,password: String!): Auth
saveBook(input:savedBookInput):User
removeBook(bookId:String!):User


}



type User {
_id: id
username: String!
email: String!
bookCount: INT
savedBooks: [Book]
}

type Book {
bookId: ID 
authors: [String]
description: String
title:String
image:String
link:String
}

type Auth {
token:ID
user:User
}

`


module.exports = typeDefs