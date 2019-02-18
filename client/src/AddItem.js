import React from 'react'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import { Mutation, Query } from 'react-apollo'
import * as Yup from 'yup'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import TagSelect from './TagSelect'

const ADD_ITEM = gql`
  mutation additemMutation($item: NewItemInput!) {
    addItem( input: $item ) {
      id
      title
      description
      tags {
        id
        tagname
      }
    }
  }
`;

const AddItem = ({
  setCSRFToken
  }) => {
  return (
    <Mutation 
      mutation={ADD_ITEM}
      onCompleted={(data) => {
        console.log(data);
      }}
    >
      {(addItem, { loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>There was an error</p>;

        return (
          <Formik
            initialValues={
              {
                title: '',
                description: '',
                tags: [],
              }
            }
            onSubmit={(values, { setSubmitting }) => {
              values = {
                ...values,
                tags: values.tags.map(tag => tag.value)
              }
              console.log(values);
              addItem({
                variables: {
                  item: values 
                }
              })
              setSubmitting(false);
            }}
            validationSchema={Yup.object().shape({
              title: Yup.string()
                .required('Required'),
              description: Yup.string()
                .required('Required'),
              tags: Yup.array()
                .of(
                  Yup.object().shape({
                    label: Yup.string().required(),
                    value: Yup.number().integer(),
                  })
                ),
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
                setFieldValue,
                setFieldTouched,
              } = props;
              return (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    placeholder="What is your item?"
                    type="text"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.title && touched.title ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.title &&
                    touched.title && <div className="input-feedback">{errors.username}</div>}
                  <label htmlFor="description">
                    Description
                  </label>
                  <input
                    id="description"
                    placeholder="Please describe your item."
                    type="text"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.description && touched.description ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.description &&
                    touched.description && <div className="input-feedback">{errors.email}</div>}
                  <TagSelect
                    value={values.tags}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    error={errors.tags}
                    touched={touched.rockets}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </form>
              )
            }}
          </Formik>
        )

      }}
    </Mutation>
  )
}

export default AddItem