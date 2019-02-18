/**
 *  @TODO: Handling Server Errors
 *
 *  Once you've completed your pg-resource.js methods and handled errors
 *  use the ApolloError constructor to capture and return errors from your resolvers.
 *
 *  Throwing ApolloErrors from your resolvers is a nice pattern to follow and
 *  will help you easily debug problems in your resolving functions.
 *
 *  It will also help you control th error output of your resource methods and use error
 *  messages on the client! (More on that later).
 *
 *  The user resolver has been completed as an example of what you'll need to do.
 *  Finish of the rest of the resolvers when you're ready.
 */
const { ApolloError } = require('apollo-server-express')

// @TODO: Uncomment these lines later when we add auth
const jwt = require('jsonwebtoken')
const authMutations = require('./auth')
// -------------------------------
const { UploadScalar, DateScalar } = require('../custom-types')
const authenticate = require('../authenticate')

module.exports = app => {
  return {
    // Upload: UploadScalar,
    // Date: DateScalar,

    Query: {
      // LATER
      async viewer(parent, args, { req, pgResource }) {
        /**
         * @TODO: Authentication - Server
         *
         *  If you're here, you have successfully completed the sign-up and login resolvers
         *  and have added the JWT from the HTTP cookie to your resolver's context.
         *
         *  The viewer is what we're calling the current user signed into your application.
         *  When the user signed in with their username and password, an JWT was created with
         *  the user's information cryptographically encoded inside.
         *
         *  To provide information about the user's session to the app, decode and return
         *  the token's stored user here. If there is no token, the user has signed out,
         *  in which case you'll return null
         */
        const userID = authenticate(app, req)
        const user = await pgResource.getUserById(userID)

        return user
      },
      // NOW
      async user(parent, { id }, { req, pgResource }, info) {
        authenticate(app, req)
        try {
          const user = await pgResource.getUserById(id)
          return user
        } catch (e) {
          throw new ApolloError(e)
        }
      },
      // NOW List of all items in the database
      async items(parent, { idToOmit }, { req, pgResource }) {
        authenticate(app, req)
        try {
          const items = await pgResource.getItems(idToOmit)
          return items
        } catch (e) {
          throw new ApolloError(e)
        }
        // -------------------------------
      },
      // NOW List of all the tags
      async tags(parent, {}, { req, pgResource }, info) {
        authenticate(app, req)
        try {
          const tags = await pgResource.getTags()
          return tags
        } catch (e) {
          throw new ApolloError(e)
        }
      }
    },

    User: {
      /**
       *  @TODO: Advanced resolvers
       *
       *  The User GraphQL type has two fields that are not present in the
       *  user table in Postgres: items and borrowed.
       *
       *  According to our GraphQL schema, these fields should return a list of
       *  Items (GraphQL type) the user has lent (items) and borrowed (borrowed).
       *
       */
      // @TODO: Uncomment these lines after you define the User type with these fields
      // NOW
      async items(user, {}, { req, pgResource }, info) {
        // @TODO: Replace this mock return statement with the correct items from Postgres
        authenticate(app, req)
        try {
          const items = await pgResource.getItemsForUser(user.id)
          return items
        } catch (e) {
          throw new ApolloError(e)
        }
        // -------------------------------
      },
      // NOW
      async borrowed(user, {}, { req, pgResource }, info) {
        // @TODO: Replace this mock return statement with the correct items from Postgres
        authenticate(app, req)
        try {
          const items = await pgResource.getBorrowedItemsForUser(user.id)
          return items
        } catch (e) {
          throw new ApolloError(e)
        }
        // -------------------------------
      }
      // -------------------------------
    },

    Item: {
      /**
       *  @TODO: Advanced resolvers
       *
       *  The Item GraphQL type has two fields that are not present in the
       *  Items table in Postgres: itemowner, tags and borrower.
       *
       * According to our GraphQL schema, the itemowner and borrower should return
       * a User (GraphQL type) and tags should return a list of Tags (GraphQL type)
       *
       */
      // @TODO: Uncomment these lines after you define the Item type with these fields
      // NOW
      async owner(item, {}, { req, pgResource }, info) {
        // @TODO: Replace this mock return statement with the correct user from Postgres
        try {
          const owner = pgResource.getUserById(item.ownerid)
          return owner
        } catch (e) {
          throw new ApolloError(e)
        }
        //   // -------------------------------
      },
      // NOW
      async tags(item, {}, { req, pgResource }, info) {
        // @TODO: Replace this mock return statement with the correct tags for the queried Item from Postgres
        try {
          const tags = pgResource.getTagsForItem(item.id)
          return tags
        } catch (e) {
          throw new ApolloError(e)
        }
        // -------------------------------
      },
      // NOW
      async borrower(item, {}, { req, pgResource }, info) {
        /**
         * @TODO: Replace this mock return statement with the correct user from Postgres
         * or null in the case where the item has not been borrowed.
         */
        const borrower = pgResource.getUserById(item.borrowerid)
        return borrower
        // -------------------------------
      }
    },

    Mutation: {
      // @TODO: Uncomment this later when we add auth
      ...authMutations(app),
      // -------------------------------

      async addItem(parent, args, { req, pgResource }, info) {
        /**
         *  @TODO: Destructuring
         *
         *  The 'args' and 'context' parameters of this resolver can be destructured
         *  to make things more readable and avoid duplication.
         *
         *  When you're finished with this resolver, destructure all necessary
         *  parameters in all of your resolver functions.
         *
         *  Again, you may look at the user resolver for an example of what
         *  destructuring should look like.
         */

        //image = await image;
        //const user = await jwt.decode(context.token, app.get('JWT_SECRET'));
        args.input.ownerid = authenticate(app, req)
        const newItem = await pgResource.saveNewItem(args.input)
        return newItem
      },

      async borrowItem(parent, args, { req, pgResource }, info) {
        const borrowerid = authenticate(app, req)
        const originalItem = await pgResource.getItemById(args.input);
        if (originalItem.ownerid === borrowerid) {
          throw new Error('You can\'t borrow your own item.')
        }
        const item = await pgResource.borrowItem({
          borrowerid,
          itemID: args.input
        });
        return item
      },

      async returnItem(parent, args, { req, pgResource }, info) {
        authenticate(app, req)
        const item = await pgResource.returnItem({
          itemID: args.input
        });
        return item
      }

    }
  }
}
