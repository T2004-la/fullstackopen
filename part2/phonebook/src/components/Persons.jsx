 // src/components/Persons.jsx
const Persons = ({ personsToShow, handleDeleteOf }) => {
  return (
    <ul>
      {personsToShow.map(person => (
        <li key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => handleDeleteOf(person.id, person.name)}>delete</button>
        </li>
      ))}
    </ul>
  )
}

export default Persons