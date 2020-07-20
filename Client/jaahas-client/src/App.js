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

  const [restaurantData2, setRestaurantData2] = useState()
  useEffect(() => {
    axios.get(`http://localhost:3001/ditrevi`)
      .then(response => {
        setRestaurantData2(response.data)
        //console.log('2', response.data)
      }).catch(error => {
        console.log(error)
  })
  }, [])

  const [restaurantData3, setRestaurantData3] = useState()
  useEffect(() => {
    axios.get(`http://localhost:3001/fontana`)
      .then(response => {
        setRestaurantData3(response.data)
      }).catch(error => {
        console.log(error)
  })
  }, [])

  const [restaurantData4, setRestaurantData4] = useState()
  useEffect(() => {
    axios.get(`http://localhost:3001/tinta`)
      .then(response => {
        setRestaurantData4(response.data)
      }).catch(error => {
        console.log(error)
  })
  }, [])
//console.log('this', restaurantData)

const parseBlankoMenu = (blankoData) => {
  const now = new Date()
  var days = ['Su','Ma','Ti','Ke','To','Pe','La']
  var day = days[ now.getDay() ]
  const dayMenu = blankoData[day]
  //console.log('that', Object.keys(blankoData).filter(weekday => weekday === day))
  //console.log('this', blankoData)
  //const dayMenu = Object.values(blankoData[Object.keys(blankoData).filter(weekday => weekday === day)])
  //console.log(dayMenu)
  return dayMenu
  }

const parseMenu = (menuData) => {
  console.log('that ditre', menuData)
  const now = new Date()
  var days = ['su','ma','ti','ke','to','pe','la']
  var day = days[ now.getDay() ]
  const dayMenu = menuData[day]
  console.log('that2', Object.keys(menuData).filter(weekday => weekday === day))
  console.log('this2', menuData)
  console.log('ditrevi', dayMenu)
  return dayMenu
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
        parseBlankoMenu(restaurantData).map(row => <p key={row.food}>{row.food} {row.price}</p>)
        : 
        "loading..."}
        </div>
        </>
        
        <>
        <a
          className="App-link"
          href="http://localhost:3001/ditrevi"
          target="_blank"
          rel="noopener noreferrer"
        >
          Di Trevi
        </a>
        </>
        <>
        {restaurantData2 ? 
        parseMenu(restaurantData2).map(row => <p key={row.food}>{row.food} {row.price}</p>)
        : 
        "loading..."}
        </> 

        <>
        <a
          className="App-link"
          href="http://localhost:3001/fontana"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fontana
        </a>
        </>
        <>
        {restaurantData3 ? 
        parseMenu(restaurantData3).map(row => <p key={row.food}>{row.food} {row.price}</p>)
        : 
        "loading..."}
        </> 

        <>
        <a
          className="App-link"
          href="http://localhost:3001/tinta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tintå
        </a>
        </>
        <>
        {restaurantData4 ? 
        parseMenu(restaurantData4).map(row => <p key={row.food}>{row.food} {row.price}</p>)
        : 
        "loading..."}
        </> 
        
      </header>
    </div>
  );
}

export default App;
