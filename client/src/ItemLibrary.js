import React from 'react'
import gql from 'graphql-tag'
import { Mutation, Query } from 'react-apollo'
import SingleItem from './SingleItem'

const BORROW_ITEM = gql`
  mutation borrowItemMutation($item: ID!) {
    borrowItem(input: $item) {
      id
      title
    }
  }
`

const ItemLibrary = () => {
  return (
    <Query
      query={gql`
        query {
          items {
            id
            title
            description
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading</p>
        if (error) {
          return <p>There was an error</p>
        }
        return (
          <div>
            <ul>
              {data.items.map(item => {
                return (
                  <Mutation
                    mutation={BORROW_ITEM}
                    onCompleted={data => {
                      console.log(data)
                    }}
                  >
                    {(borrowItem, { loading, error, data }) => {
                      if (loading) return <p>Loading...</p>
                      if (error) return <p>There was an error</p>

                      return (
                        <SingleItem
                          item={item}
                          showBorrow={true}
                          onClick={() =>
                            borrowItem({
                              variables: { item: item.id }
                            })
                          }
                        />
                      )
                    }}
                  </Mutation>
                )
              })}
            </ul>
          </div>
        )
      }}
    </Query>
  )
}

export default ItemLibrary
