// src/App.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  // دریافت لیست تمام کشورها در اولین رندر
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
    setSelectedCountry(null) // با تغییر جستجو، انتخاب قبلی ریست می‌شود
  }

  const filteredCountries = query === '' 
    ? [] 
    : countries.filter(c => 
        c.name.common.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div style={{ padding: '20px' }}>
      <div>
        find countries <input value={query} onChange={handleQueryChange} />
      </div>

      <div style={{ marginTop: '15px' }}>
        {selectedCountry ? (
          <div>
            <button onClick={() => setSelectedCountry(null)}>back to list</button>
            <CountryDetail country={selectedCountry} />
          </div>
        ) : filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filteredCountries.length > 1 ? (
          <ul>
            {filteredCountries.map(country => (
              <li key={country.cca3}>
                {country.name.common}{' '}
                <button onClick={() => setSelectedCountry(country)}>show</button>
              </li>
            ))}
          </ul>
        ) : filteredCountries.length === 1 ? (
          <CountryDetail country={filteredCountries[0]} />
        ) : query !== '' ? (
          <p>No matches found</p>
        ) : null}
      </div>
    </div>
  )
}

export default App