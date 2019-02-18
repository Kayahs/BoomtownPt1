import React from 'react'
import gql from 'graphql-tag'
import { Button } from '@material-ui/core'

const SingleItem = ({
  item: { id, title, description },
  showBorrow = false,
  showReturn = false,
  onClick
}) => {
  return (
    <div key={id}>
      The title of my item is {title} and description is {description}.
      {showBorrow && <Button onClick={onClick}>Borrow</Button>}
      {showReturn && <Button onClick={onClick}>Return</Button>}
    </div>
  )
}

export default SingleItem
