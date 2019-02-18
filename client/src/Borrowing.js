import React from 'react'
import gql from 'graphql-tag'
import { Mutation, Query } from 'react-apollo'
import SingleItem from './SingleItem'

const RETURN_ITEM = gql`
  mutation returnItemMutation($item: ID!) {
    returnItem(input: $item) {
      id
      title
      description
      tags {
        id
        tagname
      }
    }
  }
`

const Borrowing = () => {
  return (
    <Query
      query={gql`
        query {
          viewer {
            borrowed {
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
            <ul>
              {data.viewer.borrowed.map(item => {
                return (
                  <Mutation
                    mutation={RETURN_ITEM}
                    onCompleted={data => {
                      console.log(data)
                    }}
                  >
                    {(returnItem, { loading, error, data }) => {
                      if (loading) return <p>Loading...</p>
                      if (error) {
                        console.log(error)
                        return <p>There was an error</p>
                      }

                      return (
                        <SingleItem
                          item={item}
                          showReturn={true}
                          onClick={() =>
                            returnItem({
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

export default Borrowing
