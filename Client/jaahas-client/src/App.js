import React, { useEffect, useState} from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios'

const listOfRestaurants = [
  {name: "Blanko", url: "http://localhost:3001/blanko"},
  {name: "Di Trevi", url: "http://localhost:3001/ditrevi"},
  {name: "Fontana", url: "http://localhost:3001/fontana"},
  {name: "Tintå", url: "http://localhost:3001/tinta"}
]

function App() {
  const [restaurantData, setRestaurantData] = useState([])

  useEffect(() => {
    listOfRestaurants.forEach(restaurant => {
      axios.get(restaurant.url)
      .then(response => setRestaurantData(oldState => ([...oldState, {...response, name: restaurant.name}])))
    })
  }, [])

const parseMenu = (menuData) => {
  const now = new Date()
  var days = ['su','ma','ti','ke','to','pe','la']
  var day = days[ now.getDay() ]
  const dayMenu = menuData[day]
  return dayMenu
  }

  return (
    <div className="App">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <h1 className="main-title">
          Restaurants
        </h1>
        { restaurantData && restaurantData.map(restaurant => 
        <div key={restaurant.name}>
          <h2>
          {restaurant.name}
        </h2>
        <div>
        {restaurantData.length !== 0 ? 
        parseMenu(restaurant.data).map(row => <p key={row.food}>{row.food} {row.price}</p>)
        : 
        <p>Loading...</p>}
        </div>
        </div>
        )}
    </div>
  );
}

export default App;
