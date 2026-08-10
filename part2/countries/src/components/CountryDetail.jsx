 // src/components/CountryDetail.jsx
import Weather from './Weather'

const CountryDetail = ({ country }) => {
  const languages = country.languages ? Object.values(country.languages) : []
  const capital = country.capital ? country.capital[0] : null

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {capital}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {languages.map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img 
        src={country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        width="150" 
      />

      {capital && <Weather capital={capital} />}
    </div>
  )
}

export default CountryDetail