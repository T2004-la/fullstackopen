// src/App.jsx
import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')

  // ۲.۱۱ و ۲.۱۳: دریافت لیست مخاطبین از سرویس اختصاصی
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // ۲.۱۲ و ۲.۱۵: اضافه کردن مخاطب جدید یا ویرایش شماره مخاطب قبلی
  const addPerson = (event) => {
    event.preventDefault()
    
    // بررسی وجود مخاطب در لیست
    const existingPerson = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      // تمرین ۲.۱۵: اگر مخاطب وجود دارد، تاییدیه بگیر و شماره‌اش را با PUT آپدیت کن
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
      }
    } else {
      // تمرین ۲.۱۲: ایجاد مخاطب جدید روی سرور با POST
      const personObject = {
        name: newName,
        number: newNumber
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  // تمرین ۲.۱۴: حذف مخاطب با DELETE و گرفتن confirm
  const handleDeleteOf = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilterQuery(event.target.value)

  const personsToShow = filterQuery === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filterQuery.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter 
        filterQuery={filterQuery} 
        handleFilterChange={handleFilterChange} 
      />

      <h3>Add a new</h3>

      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons 
        personsToShow={personsToShow} 
        handleDeleteOf={handleDeleteOf} 
      />
    </div>
  )
}

export default App