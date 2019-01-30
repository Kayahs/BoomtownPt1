const { gql } = require('apollo-server-express');

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
    ownerid: ID!
    borrowerid: ID
    tags: [ID!]
  }

  type Query {
    user(id: ID!): User
    viewer: User
    items(filter: ID): [Item]
    tags: [Tag!]!
  }

  type Mutation {
    addItem(input: NewItemInput!): Item!
  }
`;
  