import React, { useEffect, useState} from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import TimeSelection from './TimeSelection.js';
import './TimeSelection.css';

const listOfRestaurants = [
  {name: "Blanko", url: "http://localhost:3001/blanko", lunchUrl: "https://blanko.net/lounas"},
  {name: "Di Trevi", url: "http://localhost:3001/ditrevi", lunchUrl: "https://ditrevi.fi/lounas/"},
  {name: "Fontana", url: "http://localhost:3001/fontana", lunchUrl: "https://www.fontana.fi/lunch/"},
  {name: "Tintå", url: "http://localhost:3001/tinta", lunchUrl: "https://www.tinta.fi/lounas"}
]



function App() {
  const [restaurantData, setRestaurantData] = useState([])

  useEffect(() => {
    listOfRestaurants.forEach(restaurant => {
      axios.get(restaurant.url)
      .then(response => setRestaurantData(oldState => ([...oldState, {...response, name: restaurant.name, lunchUrl: restaurant.lunchUrl}])))
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
        <div className="restaurants-container">
        { restaurantData && restaurantData.map(restaurant => 
        <div className="restaurant" key={restaurant.name}>
          <h2>
            <a href={restaurant.lunchUrl} rel="nofollow">{restaurant.name}</a>
          </h2>
          <div className="Menu">
            {restaurantData.length !== 0 ? 
            parseMenu(restaurant.data).map(row => <p key={row.food}>{row.food} {row.price}</p>)
            : 
            <p>Loading...</p>}
          </div>
          <button onclick={TimeSelection()}>Select Time</button>
          <div id="myModal" class="modal">
            <div class="modal-content">
              <span class="close">&times;</span>
              <p>Some text in the Modal..</p>
            </div>
          </div>
          
        </div>
        )}
        </div>
    </div>
  );
}

export default App;
