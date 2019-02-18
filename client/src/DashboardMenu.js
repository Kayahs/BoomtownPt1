import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

const DashboardMenu = () => {
  return (
    <React.Fragment>
      <Link to="/">My Items</Link>
      <Link to="/borrowing">Borrowing</Link>
      <Link to="/library">Library</Link>
    </React.Fragment>
  )
}

export default DashboardMenu