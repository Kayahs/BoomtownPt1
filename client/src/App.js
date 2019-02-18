import React, { Component, useState } from 'react'
import logo from './logo.svg'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import './App.css'
import Title from './Title'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import apolloClient from './ApolloClient'
import Dashboard from './Dashboard'
import {
  MuiThemeProvider,
  createMuiTheme,
  Button,
  Grid
} from '@material-ui/core'
import { unstable_Box as Box } from '@material-ui/core/Box'
import { ThemeProvider } from '@material-ui/styles'
// import styled from 'styled-components'
// import { palette, spacing, typography } from '@material-ui/system'

const initialCSRFToken = localStorage.getItem('token')

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ccc'
    }
  }
})

const App = () => {
  const [csrfToken, setCSRFToken] = useState(initialCSRFToken)

  return (
    <Router>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          {csrfToken == null && (
            <Box color="primary.main">
              <Title />
              <Route
                path="/"
                exact
                render={() => <LoginForm setCSRFToken={setCSRFToken} />}
              />
              <Route
                path="/signup"
                render={() => <SignupForm setCSRFToken={setCSRFToken} />}
              />
            </Box>
          )}
          {csrfToken != null && (
            <Route
              path="/"
              render={() => <Dashboard setCSRFToken={setCSRFToken} />}
            />
          )}
        </ThemeProvider>
      </ApolloProvider>
    </Router>
  )
}

export default App
