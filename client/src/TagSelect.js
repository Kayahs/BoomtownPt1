import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Select from 'react-select'

const TagSelect = ({
  onChange,
  onBlur,
  value,
  error,
  touched,
}) => {
  const handleChange = value => {
    onChange('tags', value);
  };

  const handleBlur = () => {
    onBlur('tags', true);
  };
  return (
    <Query
      query={gql`
        query {
          tags {
            id
            tagname
          }
        }
      `}>
    {({loading, error, data}) => {
      if (loading) return <p>Loading</p>
      if (error) {
        console.log(error);
        return <p>There was an error</p>
      }
      const options = data.tags.map(tag => ({value: tag.id, label: tag.tagname}))
      return (
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="tags">Please select tags for your Item.</label>
          <Select
            id="tags"
            options={options}
            isMulti
            onChange={handleChange}
            onBlur={handleBlur}
            value={value}
          />
          {error &&
            touched && (
              <div style={{ color: 'red', marginTop: '.5rem' }}>{"There was an error"}</div>
            )}
        </div>
      )
    }}
    </Query>
  )
}

export default TagSelect