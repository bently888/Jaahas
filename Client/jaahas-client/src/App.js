import React, { useEffect, useState} from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios'

function App() {
  const [restaurantData, setRestaurantData] = useState()
  useEffect(() => {
    axios.get(`http://localhost:3001/blanko`)
      .then(response => {
        setRestaurantData(response.data)
        //console.log(response.data)
        //return response.data
      }).catch(error => {
        console.log(error)
  })
  }, []) 
console.log('this', restaurantData)

const parseBlankoMenu = (blankoData) => {
  const now = new Date()
  var days = ['su','ma','ti','ke','to','pe','la']
  var day = days[ now.getDay() ]
  //blankoData.map(weekday => weekday+1)
  return day
  }

  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <p>
          Restaurants
        </p>
        <a
          className="App-link"
          href="http://localhost:3001/blanko"
          target="_blank"
          rel="noopener noreferrer"
        >
          Blanko
        </a>
        <>
        <div>
        {restaurantData ? 
        parseBlankoMenu(restaurantData)
        : 
        "loading..."}
        </div>
        </>
      </header>
    </div>
  );
}
//[0].map(food => <li key={food}>{food.food, food.price}</li>


export default App;
