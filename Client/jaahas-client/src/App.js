import React, { useEffect, useState} from 'react';
import './App.css';
import axios from 'axios'
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
  const [foodTrain, setFoodTrain] = useState([])

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
      .post('http://localhost:3001/reservations', {time: time, resta: restaurantName, participants: []})
      .then(() => {
      setCurrentlyOpenModal('')
      setFoodTrain(oldFoodTrain =>
        [...oldFoodTrain, {time: time, resta: restaurantName, participants: []}]
      )})
      //.then((res) => console.log('resdata', res.data))
      .catch(err => {
      console.error(err)
    })
  }

  const joinTrain = (clickedItem) => {
    //clickedItem.participants === undefined ?
    //clickedItem.participants = ['+1']
    const newFoodTrain = foodTrain.map(foodTrainItem => {
      if (foodTrainItem.resta === clickedItem.resta && foodTrainItem.time === clickedItem.time)
        return {...foodTrainItem, participants: [...foodTrainItem.participants, '+1']}
      else 
        return foodTrainItem
    })
    axios
      .post('http://localhost:3001/reservations', newFoodTrain)
      .then(() => setFoodTrain(newFoodTrain))
    //: setFoodTrain(foodTrain => foodTrain, keyA)
    //console.log(keyA.trainList)
    //console.log('key', keyA)
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
        <div className="times-chosen">
          {foodTrain.length !== 0 ?
          foodTrain.map(res => 
          <p key={res.time + res.resta}>{res.resta} at {res.time}- 
          <button onClick={() => joinTrain(res)}>join train</button>{res.participants}
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
          <button onClick={()=>setCurrentlyOpenModal(restaurant.name)}>Select Time</button>
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