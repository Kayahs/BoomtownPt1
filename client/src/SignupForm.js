import React from 'react'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import * as Yup from 'yup'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

const SIGNUP = gql`
  mutation signupMutation($user: NewUserInput!) {
    signup(input: $user) {
      csrfToken
      user {
        id
        username
        email
        password
      }
    }
  }
`;

const LoginForm = ({
  setCSRFToken
  }) => {
  return (
    <Mutation 
      mutation={SIGNUP}
      onCompleted={(data) => {
        localStorage.setItem('token', data.signup.csrfToken);
        setCSRFToken(data.csrfToken);
      }}
    >
      {(signup, { loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>There was an error</p>;

        return (
          <Formik
            initialValues={
              {
                username: '',
                email: '',
                password: '',
                bio: '',
              }
            }
            onSubmit={(values, { setSubmitting }) => {
              signup({
                variables: {
                  user: values 
                }
              })
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string()
                .required('Required'),
              email: Yup.string()
                .email()
                .required('Required'),
              password: Yup.string()
                .required('Required'),
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
                handleReset,
              } = props;
              return (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    placeholder="Please enter your username"
                    type="text"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.username && touched.username ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.username &&
                    touched.username && <div className="input-feedback">{errors.username}</div>}
                  <label htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    placeholder="Please enter your email"
                    type="text"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.email &&
                    touched.email && <div className="input-feedback">{errors.email}</div>}
                  <label htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.password &&
                  touched.password && <div className="input-feedback">{errors.password}</div>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                  <Link to="/"><button>Login to Existing Account</button></Link>
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