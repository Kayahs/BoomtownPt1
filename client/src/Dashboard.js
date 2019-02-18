import React from 'react'
import DashboardMenu from './DashboardMenu'
import DashboardHeader from './DashboardHeader'
import MyItems from './MyItems'
import Borrowing from './Borrowing'
import ItemLibrary from './ItemLibrary'

import { BrowserRouter as Router, Route, Link } from "react-router-dom"

const Dashboard = ({
  setCSRFToken
}) => {
  const username = localStorage.getItem('username');
  const userID = localStorage.getItem('userID');
  return (
    <div>
      <DashboardHeader username={username} setCSRFToken={setCSRFToken} />
      <DashboardMenu />
      <Route path="/" exact component={MyItems} />
      <Route path="/borrowing" exact component={Borrowing} />
      <Route path="/library" exact component={ItemLibrary} />
    </div>
  )
}

export default Dashboard