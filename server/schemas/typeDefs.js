const typeDefs = `
type User{
_id: ID
username: String
email: String
savedBooks: [Book]
bookCount: Int
}

type Book{
bookId: String
authors: [String]
description: String
title: String
image: String
link: String
}

type Auth{
token: ID!
user: User
}

type Query{
getSingleUser(id: ID, username: String): User
}

type Mutation{
addUser(username: String!, email: String!, password: String!): Auth
login(username: String, email: String, password: String!): Auth
saveBook(bookData: BookInput!): User
deleteBook(bookId: ID!): User
}

input BookInput{
bookId: String
authors: [String]
description: String
title: String
image: String
link: String
}
`

module.exports = typeDefs;