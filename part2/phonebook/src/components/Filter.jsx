 // src/components/Filter.jsx
const Filter = ({ filterQuery, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filterQuery} onChange={handleFilterChange} />
    </div>
  )
}

export default Filter