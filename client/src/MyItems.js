import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Button } from '@material-ui/core'
import AddItem from './AddItem'
import SingleItem from './SingleItem'

const MyItems = () => {
  const [showAddItem, setShowAddItem] = useState(false)
  return (
    <Query
      query={gql`
        query {
          viewer {
            items {
              id
              title
              description
            }
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading</p>
        if (error) {
          console.log(error)
          return <p>There was an error</p>
        }
        return (
          <div>
            <Button onClick={() => setShowAddItem(!showAddItem)}>
              Add Item
            </Button>
            {showAddItem && <AddItem />}
            <div className="MyItemsList">
              {data.viewer.items.map(item => {
                return <SingleItem item={item} />
              })}
            </div>
          </div>
        )
      }}
    </Query>
  )
}

export default MyItems
