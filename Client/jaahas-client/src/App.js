import React, { useEffect, useState} from 'react';
import './App.css';
import axios from 'axios'
//import { response } from '../../../Backend/Scraper';
//import Login from "./Login";
//import foodTrain from '../foodTrain'
//import TimeSelection from './TimeSelection.js';
//import './TimeSelection.css';

const listOfRestaurants = [
  {name: "Blanko", url: "http://localhost:3001/blanko", lunchUrl: "https://blanko.net/lounas"},
  {name: "Di Trevi", url: "http://localhost:3001/ditrevi", lunchUrl: "https://ditrevi.fi/lounas/"},
  {name: "Fontana", url: "http://localhost:3001/fontana", lunchUrl: "https://www.fontana.fi/lunch/"},
  {name: "Tintå", url: "http://localhost:3001/tinta", lunchUrl: "https://www.tinta.fi/lounas"}
]

const hours = ["10", "11", "12", "13"]
const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]
const times = hours.map(hour => minutes.map(minute => hour + ":" + minute)).flat()

function App() {
  const [restaurantData, setRestaurantData] = useState([])
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState("")
  //const [nameModal, setNameModal] = useState("")
  const [foodTrain, setFoodTrain] = useState([])
  const [user, setUser] = useState([], () => {
    const localData = localStorage.getItem('userData');
    return localData ? JSON.parse(localData) : [];
});
  useEffect(() => {
    listOfRestaurants.forEach(restaurant => {
      axios.get(restaurant.url)
      .then(response => setRestaurantData(oldState => ([...oldState, {...response, name: restaurant.name, lunchUrl: restaurant.lunchUrl}])))
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:3001/reservations').then(
      reservation => setFoodTrain(reservation.data)
    ) 
  }, [])
  const onTimeButtonClick = (time, restaurantName) => {
    foodTrain.some(foodTrainItem => foodTrainItem.resta === restaurantName && foodTrainItem.time === time) ?
      alert("already included")
      :
      axios
      .post('http://localhost:3001/reservations', {time: time, resta: restaurantName, participants: [user]})
      .then(response => {
        setFoodTrain(response.data)
      setCurrentlyOpenModal('')
      // setFoodTrain(oldFoodTrain =>
      //   [...oldFoodTrain, {time: time, resta: restaurantName, participants: []}]
      // )
    })
      //.then((res) => console.log('resdata', res.data))
      .catch(err => {
      console.error(err)
    })
  }

  const joinTrain = (clickedItem) => {
    //Tähän nimen syöttö
    //if (user.length<1) return setNameModal("open")
    axios
      .post('http://localhost:3001/join', {time: clickedItem.time, resta: clickedItem.resta, user: user})
      .then(response => setFoodTrain(response.data))
  }

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
        {/* renderöi listan ruokajunista */}
        <div className="selectUserName">
          <h3>Set Username</h3>
            <div className="name-input">
              <input type="text" name="name" onChange={e => setUser(e.target.value)}/>
              {/*<button onClick={}/>*/}
            </div>
          {/* <button onClick={()=>setNameModal("")}>close</button> */}
          </div>
        <div className="times-chosen">
          {foodTrain.length !== 0 ?
          foodTrain.map(res => 
          <p key={res.time + res.resta}>{res.resta} at {res.time}- 
          <button onClick={() => joinTrain(res)} disabled={user.length<1}>join train</button>{res.participants}
          </p>) : ""}
        </div>
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
          <button onClick={()=>setCurrentlyOpenModal(restaurant.name)} disabled={user.length<1}>Select Time</button>
          {currentlyOpenModal===restaurant.name && <div className="selectModal">
          <h2>Header</h2>
            <div className="time-buttons">
              {times.map(time => <button key={time} id={time} onClick={() => 
                onTimeButtonClick(time, restaurant.name)
                }
                >
                {time}
                </button>
              )}
            </div>
          <button onClick={()=>setCurrentlyOpenModal("")}>close</button>
          </div>
          }
        </div>
        )}
        </div>
    </div>
  );
}

export default App;