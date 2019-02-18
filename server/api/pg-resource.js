const strs = require('stringstream')

function tagsQueryString(tags, itemid, result) {
  /**
   * Challenge:
   * This function is recursive, and a little complicated.
   * Can you refactor it to be simpler / more readable?
   */
  const length = tags.length
  return length === 0
    ? `${result};`
    : tags.shift() &&
        tagsQueryString(
          tags,
          itemid,
          `${result}($${tags.length + 1}, ${itemid})${length === 1 ? '' : ','}`
        )
}

module.exports = postgres => {
  return {
    // LATER
    async createUser({ username, email, password, bio }) {
      const newUserInsert = {
        text:
          'INSERT INTO users (username, email, password, bio) values ($1, $2, $3, $4) RETURNING *;', // @TODO: Authentication - Server
        values: [username, email, password, bio]
      }
      try {
        const user = await postgres.query(newUserInsert)
        return user.rows[0]
      } catch (e) {
        switch (true) {
          case /users_username_key/.test(e.message):
            throw 'An account with this username already exists.'
          case /users_email_key/.test(e.message):
            throw 'An account with this email already exists.'
          default:
            throw new Error(e)
        }
      }
    },
    // LATER
    async getUserAndPasswordForVerification(email) {
      const findUserQuery = {
        text: 'SELECT * FROM users WHERE email = $1;', // @TODO: Authentication - Server
        values: [email]
      }
      const user = await postgres.query(findUserQuery)
      return user.rows[0]
    },

    // NOW
    async getUserById(id) {
      /**
       *  @TODO: Handling Server Errors
       *
       *  Inside of our resource methods we get to determine when and how errors are returned
       *  to our resolvers using try / catch / throw semantics.
       *
       *  Ideally, the errors that we'll throw from our resource should be able to be used by the client
       *  to display user feedback. This means we'll be catching errors and throwing new ones.
       *
       *  Errors thrown from our resource will be captured and returned from our resolvers.
       *
       *  This will be the basic logic for this resource method:
       *  1) Query for the user using the given id. If no user is found throw an error.
       *  2) If there is an error with the query (500) throw an error.
       *  3) If the user is found and there are no errors, return only the id, email, fullname, bio fields.
       *     -- this is important, don't return the password!
       *
       *  You'll need to complete the query first before attempting this exercise.
       */

      const findUserQuery = {
        text: 'SELECT *  FROM users WHERE id = $1;', // @TODO: Basic queries
        values: [id]
      }

      /**
       *  Refactor the following code using the error handling logic described above.
       *  When you're done here, ensure all of the resource methods in this file
       *  include a try catch, and throw appropriate errors.
       *
       *  Here is an example throw statement: throw 'User was not found.'
       *  Customize your throw statements so the message can be used by the client.
       */

      const user = await postgres.query(findUserQuery)
      if (user.rows.length < 1) throw `User ${id} was not found.`

      return user.rows[0]
      // -------------------------------
    },

    // NOW
    async getItems(idToOmit) {
      const items = await postgres.query({
        /**
         *  @TODO: Advanced queries
         *
         *  Get all Items. If the idToOmit parameter has a value,
         *  the query should only return Items were the ownerid column
         *  does not contain the 'idToOmit'
         *
         *  Hint: You'll need to use a conditional AND and WHERE clause
         *  to your query text using string interpolation
         */

        text: `SELECT * FROM items ${idToOmit ? 'WHERE NOT id = $1' : ''};`,
        values: idToOmit ? [idToOmit] : []
      })
      return items.rows
    },
    async getItemById(id) {
      const items = await postgres.query({
        text: 'SELECT * FROM items WHERE id=$1',
        values: [id]
      })

      return items.rows[0]
    },
    // NOW
    async getItemsForUser(id) {
      const items = await postgres.query({
        /**
         *  @TODO: Advanced queries
         */
        text: 'SELECT * FROM items WHERE items.ownerid = $1',
        values: [id]
      })
      return items.rows
    },
    // NOW
    async getBorrowedItemsForUser(id) {
      const items = await postgres.query({
        /**
         *  @TODO: Advanced queries
         */
        text: `SELECT * FROM items WHERE items.borrowerid = $1;`,
        values: [id]
      })
      return items.rows
    },
    async borrowItem({ borrowerid, itemID }) {
      const items = await postgres.query({
        text: `UPDATE items SET borrowerid=$1 WHERE id=$2 AND borrowerid IS NULL RETURNING *;`,
        values: [borrowerid, itemID]
      })
      if (items.rows.length < 1) {
        throw new Error('This item is already being borrowed.')
      }
      return items.rows[0]
    },
    async returnItem({itemID}) {
      const items = await postgres.query({
        text: `UPDATE items SET borrowerid=null WHERE id=$1 RETURNING *;`,
        values: [itemID]
      })

      return items.rows[0]
    },
    // NOW
    async getTags() {
      const tags = await postgres.query('SELECT * FROM tags;')
      return tags.rows
    },
    // NOW
    async getTagsForItem(id) {
      const tagsQuery = {
        text: `SELECT * FROM tags INNER JOIN items_tags ON items_tags.tagid = tags.id WHERE itemid = $1;`, // @TODO: Advanced queries
        values: [id]
      }
      const tags = await postgres.query(tagsQuery)
      return tags.rows
    },

    // NOW
    async saveNewItem({
      title,
      imageURL,
      description,
      ownerid,
      borrowerid,
      tags = []
    }) {
      /**
       *  @TODO: Adding a New Item
       *
       *  Adding a new Item to Posgtres is the most advanced query.
       *  It requires 3 separate INSERT statements.
       *
       *  All of the INSERT statements must:
       *  1) Proceed in a specific order.
       *  2) Succeed for the new Item to be considered added
       *  3) If any of the INSERT queries fail, any successful INSERT
       *     queries should be 'rolled back' to avoid 'orphan' data in the database.
       *
       *  To achieve #3 we'll ue something called a Postgres Transaction!
       *  The code for the transaction has been provided for you, along with
       *  helpful comments to help you get started.
       *
       *  Read the method and the comments carefully before you begin.
       */

      /**
       * Begin transaction by opening a long-lived connection
       * to a client from the client pool.
       * - Read about transactions here: https://node-postgres.com/features/transactions
       */

      const client = await postgres.connect()
      try {
        // Begin postgres transaction
        await client.query('BEGIN')

        // Insert new Item
        // @TODO
        // -------------------------------
        const itemResult = await client.query({
          text:
            'INSERT INTO items (title, imageURL, description, ownerid, borrowerid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          values: [title, imageURL, description, ownerid, borrowerid]
        })

        const newItemID = itemResult.rows[0].id
        // const newID = await client.query({
        //   text: 'SELECT SCOPE_INDENTITY()'
        // });

        // console.log(itemResult);
        // console.log(newID);
        // Insert tags
        // @TODO
        // -------------------------------
        if (tags.length) {
          tags = tags.map(tag =>
            client.query({
              text: 'INSERT INTO items_tags (itemid, tagid) VALUES ($1, $2)',
              values: [newItemID, tag]
            })
          )

          await Promise.all(tags)
        }
        // Commit the entire transaction!
        await client.query('COMMIT')

        return itemResult.rows[0]
      } catch (e) {
        // Something went wrong
        client.query('ROLLBACK', err => {
          if (err) {
            throw err
          }
          // release the client back to the pool
        })
        throw e
      }
    }
  }
}
