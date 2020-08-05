import React, { useEffect, useState} from 'react';
import './App.css';
import axios from 'axios'
import addNotification from 'react-push-notification';
import Restaurants from './Restaurants';
import FoodTrains from './FoodTrains';
import SelectUserName from './SelectUserName';
//import { response } from '../../../Backend/Scraper';

const listOfRestaurants = [
  {name: "Blanko", url: "/blanko", lunchUrl: "https://blanko.net/lounas"},
  {name: "Di Trevi", url: "/ditrevi", lunchUrl: "https://ditrevi.fi/lounas/"},
  {name: "Fontana", url: "/fontana", lunchUrl: "https://www.fontana.fi/lunch/"},
  {name: "Tintå", url: "/tinta", lunchUrl: "https://www.tinta.fi/lounas"},
  {name: "Dennis", url: "na", lunchUrl: "https://dennis.fi/pizzeria-ravintolat/turku-linnankatu/"},
  {name: "Niska", url: "na", lunchUrl: "https://www.niskaturku.com/fi/Lounas"},
  {name: "Kawaii", url: "na", lunchUrl: "https://www.ravintolakawaii.com/"}
]

export const alertTimeSplit = (timeOfAlert) => {
  var splitAlertTime = timeOfAlert.split(':')
  var secondsAlert = (+splitAlertTime[0]) * 60 * 60 + (+splitAlertTime[1]) * 60;
  return (secondsAlert)
}

const currentDate = new Date() 
const isFriday = currentDate.getDay()===5

const calculateSecondsCurrent=(date) => {
  const datetime =  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
  const splitTime = datetime.split(':')
  return (+splitTime[0]) * 60 * 60 + (+splitTime[1]) * 60 + (+splitTime[2]);
}

function App() {
  const [restaurantData, setRestaurantData] = useState([])
  const [filteredRestaurantData, setFilteredRestaurantData] = useState([])
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState("")
  //const [nameModal, setNameModal] = useState("")
  const [foodTrain, setFoodTrain] = useState([])
  const [user, setUser] = useState("")
  const [alertTimeOut, setAlertTimeOut] = useState()
  const [showTomorrow, setShowTomorrow] = useState(false)
  const [newFilter, setNewFilter] = useState('')
  const [trainLeaveTime, setTrainLeaveTime] = useState()

  const filterOnChange = (event) => {    
    setNewFilter(event.target.value)
  }

  useEffect (() => {
    setFilteredRestaurantData(
      restaurantData.filter(restaurant => restaurant.name.toLowerCase().includes(newFilter.toLowerCase()))
      //.filter(restaurant) filtteröi kaikki vanhat varaukset pois
    )
    //console.log("user",user)
  }, [restaurantData, newFilter])
    
  useEffect(() => {
    listOfRestaurants.forEach(restaurant => {
      if (restaurant.url!=="na")
      axios.get(restaurant.url)
      .then(response => setRestaurantData(oldState => ([...oldState, {...response, name: restaurant.name, lunchUrl: restaurant.lunchUrl}])))
      else
      setRestaurantData(oldState => ([...oldState, {name: restaurant.name, lunchUrl: restaurant.lunchUrl}]))
    })
    const savedUser = localStorage.getItem('userData')
    axios.get('/reservations').then(
      reservation => {
        setFoodTrain(reservation.data)
        const userTrain = reservation.data.find(train => train.participants.includes(savedUser))
        if (userTrain)
          setTrainLeaveTime(userTrain.time)
      }
      ) 
    setUser(savedUser || "");
      
  }, [])

  useEffect(() => {
    const userTrain = foodTrain.find(train => train.participants.includes(user))
        if (userTrain)
          setTrainLeaveTime(userTrain.time)
        else
          setTrainLeaveTime(null)
  }, [user, foodTrain])

  useEffect(() => {
    if(!trainLeaveTime) return
  const trackedTrain = foodTrain.find(train => train.participants.includes(user))
  if (trackedTrain) {
      const trackedTime = trackedTrain.time
      const alertTime = alertTimeSplit(trackedTime)-calculateSecondsCurrent(new Date())
      //console.log("time", alertTime)
    const notificationFunction = () => {
      addNotification({
      title: 'Jaahas',
      subtitle: 'jotain',
      message: 'Ruokailu at ' + trackedTrain.resta,
      theme: 'darkblue',
      tag: "Jaahas",
      requireInteraction: true,
      native: true // when using native, your OS will handle theming.
      })
      alert('Ruokailu at ' + trackedTrain.resta)
    }

    if (!alertTimeOut || alertTimeOut.alertedTime!==alertTime)
      setAlertTimeOut({
        timeout: setTimeout(notificationFunction,alertTime * 1000 - 180000),
        alertedTime:alertTime
      })
  }

  return () => clearTimeout(alertTimeOut)
  }, [trainLeaveTime, foodTrain, user, alertTimeOut])

const onTimeButtonClick = (time, restaurantName) => {
  foodTrain.some(foodTrainItem => foodTrainItem.resta === restaurantName && foodTrainItem.time === time) ?
    alert("Trat lunch train already exists")
    :
    foodTrain.some(train => train.participants.indexOf(user)>-1) ?
    alert("You are already in another lunch train")
    :
    axios
    .post('/reservations', {time: time, resta: restaurantName, participants: [user]})
    .then(response => {
        setFoodTrain(response.data)
        setTrainLeaveTime(time)
      setCurrentlyOpenModal('')
    })
  .catch(err => {
    console.error(err)
  })
}

  return (
    <div className="App">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <h1 className="main-title">
          Jaahas
        </h1>
          {/* oikealla */}
          <button className="show-tomorrow" disabled={isFriday} onClick={() => 
            setShowTomorrow(!showTomorrow)}>{showTomorrow?"today":"tomorrow"}</button>
          {/* vasemmalla */}
            <p className="set-filter"><input onChange={filterOnChange} type="search"/>filter restaurants</p>
          {/* keskellä */}
          {trainLeaveTime ? <p className="alert-text">Alert will be shown 3 minutes before {trainLeaveTime}</p> : <p className="alert-text">no alert</p>}
        {/* renderöi nimen ja listan ruokajunista */}
      <SelectUserName user={user} setUser={setUser}/>
      <FoodTrains user={user} foodTrain={foodTrain} setFoodTrain={setFoodTrain} 
      setTrainLeaveTime={setTrainLeaveTime}/>
      {/* <div className="alert-button">
          <button onClick={alertClick} className="button" disabled={!foodTrain.some(train => train.participants.includes(user))}>
           Alert
          </button>
      </div> */}
      <Restaurants data={filteredRestaurantData} onSelectTimeClick={setCurrentlyOpenModal} onTimeButtonClick={onTimeButtonClick} 
      showTomorrow={showTomorrow} allowReservations={user.length>0} currentlyOpenModal={currentlyOpenModal} user={user}/>
    </div>
  );
}

export default App;