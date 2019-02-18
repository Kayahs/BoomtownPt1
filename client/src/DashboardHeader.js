import React from 'react'
import {Button} from '@material-ui/core'
import {Link} from 'react-router-dom'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const DashboardHeader = ({
  setCSRFToken,
}) => {
  return (
    <Query
      query={gql`
        query {
          viewer {
            username
          }
        }
      `}
    >
    {({loading, error, data}) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>There was an error</p>
      return (
        <div>
          <span>Signed in as {data.viewer.username}.</span>
          <Link to="/">
            <Button onClick={() => {
              localStorage.removeItem('token')
              setCSRFToken(null)
            }}
            >
              Logout
            </Button>
          </Link>
        </div>
      )
    }}
    </Query>
  )
}

export default DashboardHeader