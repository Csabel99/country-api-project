import { useState } from "react";
import "./App.css";

function App() {
  const [country, setCountry] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  const getCountry = async () => {
    const response = await fetch("https://api.first.org/data/v1/countries");
    const result = await response.json();

    const countryCodes = Object.keys(result.data);

    let randomCountry = null;
    let foundCountry = false;
    let tries = 0;

    while (foundCountry === false && tries < 100) {
      let randomNumber = Math.floor(Math.random() * countryCodes.length);
      let code = countryCodes[randomNumber];
      let countryInfo = result.data[code];

      if (
        !banList.includes(countryInfo.region) &&
        !banList.includes(code)
      ) {
        randomCountry = {
          name: countryInfo.country,
          region: countryInfo.region,
          code: code,
          flag: "https://flagcdn.com/w320/" + code.toLowerCase() + ".png",
        };

        foundCountry = true;
      }

      tries++;
    }

    if (foundCountry === true) {
      setCountry(randomCountry);
      setHistory([...history, randomCountry]);
    } else {
      alert("No country found. Remove something from the ban list.");
    }
  };

  const addToBanList = (item) => {
    if (!banList.includes(item)) {
      setBanList([...banList, item]);
    }
  };

  const removeFromBanList = (item) => {
    const newList = banList.filter((banItem) => banItem !== item);
    setBanList(newList);
  };

  return (
    <div className="app">
      <div className="main-section">
        <h1>🌎 Discover Countries</h1>

        <p>Click the button to discover a random country.</p>

        <button className="discover-btn" onClick={getCountry}>
          Discover Country
        </button>

        {country && (
          <div className="country-card">
            <h2>{country.name}</h2>

            <img className="flag" src={country.flag} alt={country.name} />

            <p>
              <strong>Country:</strong> {country.name}
            </p>

            <p>
              <strong>Region:</strong> {country.region}
            </p>

            <p>
              <strong>Country Code:</strong> {country.code}
            </p>

            <button
              className="attribute-btn"
              onClick={() => addToBanList(country.region)}
            >
              Ban Region: {country.region}
            </button>

            <button
              className="attribute-btn"
              onClick={() => addToBanList(country.code)}
            >
              Ban Country Code: {country.code}
            </button>
          </div>
        )}
      </div>

      <div className="ban-section">
        <h2>Ban List</h2>
        <p>Click an item to remove it.</p>

        {banList.length === 0 && <p>No banned attributes yet.</p>}

        {banList.map((item, index) => (
          <button
            className="ban-btn"
            key={index}
            onClick={() => removeFromBanList(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="history-section">
        <h2>History</h2>

        {history.length === 0 && <p>No countries viewed yet.</p>}

        {history.map((item, index) => (
          <p key={index}>{item.name}</p>
        ))}
      </div>
    </div>
  );
}

export default App;