import React from 'react'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import * as Yup from 'yup'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Grid } from '@material-ui/core'

const LOGIN = gql`
  mutation loginMutation($login: LoginInput!) {
    login(input: $login) {
      user {
        id
        username
      }
      csrfToken
    }
  }
`

const LoginForm = ({ setCSRFToken }) => {
  return (
    <Mutation
      mutation={LOGIN}
      onCompleted={data => {
        localStorage.setItem('token', data.login.csrfToken)
        setCSRFToken(data.login.csrfToken)
      }}
    >
      {(login, { loading, error, data }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>There was an error</p>

        return (
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            onSubmit={(values, { setSubmitting }) => {
              login({
                variables: {
                  login: values
                }
              })
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email()
                .required('Required'),
              password: Yup.string().required('Required')
            })}
          >
            {props => {
              const {
                values,
                touched,
                errors,
                dirty,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset
              } = props
              return (
                <form onSubmit={handleSubmit}>
                  <Grid direction="column">
                    <label htmlFor="email">
                      <div>Email</div>
                    </label>
                    <input
                      id="email"
                      placeholder="Please enter your email"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.email && touched.email
                          ? 'text-input error'
                          : 'text-input'
                      }
                    />
                    {errors.email && touched.email && (
                      <div className="input-feedback">{errors.email}</div>
                    )}
                    <label htmlFor="password">
                      <div>Password</div>
                    </label>
                    <input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.password && touched.password
                          ? 'text-input error'
                          : 'text-input'
                      }
                    />
                    {errors.password && touched.password && (
                      <div className="input-feedback">{errors.password}</div>
                    )}
                    <button type="submit" disabled={isSubmitting}>
                      Submit
                    </button>
                    <Link to="/signup">
                      <button>Create an account</button>
                    </Link>
                  </Grid>
                </form>
              )
            }}
          </Formik>
        )
      }}
    </Mutation>
  )
}

export default LoginForm
