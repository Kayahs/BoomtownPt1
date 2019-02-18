const { gql } = require('apollo-server-express')

/**
 *  @TODO: Boomtown Schema
 *
 * Define the types in your GraphQL schema here.
 * For each type, remove the `_: Boolean` placeholder and add the
 * fields as directed. Be sure to finish writing resolvers for all types
 * and any relational fields, where required.
 *
 * We will create the custom Date scalar together.
 */
module.exports = gql`
  # scalar Upload

  # scalar Date

  type Item {
    id: ID!
    title: String!
    imageURL: String
    description: String!
    owner: User!
    borrower: User
    tags: [Tag!]
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    bio: String
    items: [Item]
    borrowed: [Item]
  }

  type Tag {
    id: ID!
    tagname: String!
  }

  input NewItemInput {
    title: String!
    imageURL: String
    description: String!
    borrowerid: ID
    tags: [ID!]
  }

  input NewUserInput {
    username: String!
    email: String!
    bio: String
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    user(id: ID!): User
    viewer: User
    items(filter: ID): [Item]
    tags: [Tag!]!
  }

  type LoginResponse {
    csrfToken: String!
    user: User!
  }

  type Mutation {
    addItem(input: NewItemInput!): Item!
    signup(input: NewUserInput!): LoginResponse!
    login(input: LoginInput!): LoginResponse!
    borrowItem(input: ID!): Item!
    returnItem(input: ID!): Item!
  }
`
