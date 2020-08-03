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

var currentdate = new Date(); 
const isFriday = currentdate.getDay()===5
var datetime =  currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
var splitTime = datetime.split(':')
var secondsCurrent = (+splitTime[0]) * 60 * 60 + (+splitTime[1]) * 60 + (+splitTime[2]);

function App() {
  const [restaurantData, setRestaurantData] = useState([])
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState("")
  //const [nameModal, setNameModal] = useState("")
  const [foodTrain, setFoodTrain] = useState([])
  const [user, setUser] = useState("")
  const [alertTimeOut, setAlertTimeOut] = useState()
  const [showTomorrow, setShowTomorrow] = useState(false)
    
  useEffect(() => {
    listOfRestaurants.forEach(restaurant => {
      if (restaurant.url!=="na")
      axios.get(restaurant.url)
      .then(response => setRestaurantData(oldState => ([...oldState, {...response, name: restaurant.name, lunchUrl: restaurant.lunchUrl}])))
      else
      setRestaurantData(oldState => ([...oldState, {name: restaurant.name, lunchUrl: restaurant.lunchUrl}]))
    })

    axios.get('/reservations').then(
      reservation => setFoodTrain(reservation.data)
    ) 
    const savedUser = localStorage.getItem('userData')
    setUser(savedUser || "");

  }, [])

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
      setCurrentlyOpenModal('')
    })
  .catch(err => {
    console.error(err)
  })
}

const alertClick = () => { 
  if(alertTimeOut) clearTimeout(alertTimeOut)
  if (foodTrain.some(train => train.participants.includes(user)))
  var trackedTrain = foodTrain.find(train => train.participants.includes(user))
  var trackedTime = trackedTrain.time
  //var trackedTimeInt = trackedTime
  var alertTime = alertTimeSplit(trackedTime)-secondsCurrent
  console.log(restaurantData)
  //console.log("time", alertTime)

  setAlertTimeOut(setTimeout(() => {
    addNotification({
    title: 'Jaahas',
    subtitle: 'jotain',
    message: 'Ruokailu at ' + trackedTrain.resta,
    theme: 'darkblue',
    tag: "Jaahas",
    requireInteraction: true,
    native: true // when using native, your OS will handle theming.
})
alert("Syömään!")
}, 
alertTime * 1000 - 180000))

  };

  return (
    <div className="App">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <h1 className="main-title">
          Jaahas
        </h1>
          <button className="show-tomorrow" disabled={isFriday} onClick={() => 
            setShowTomorrow(!showTomorrow)}>{showTomorrow?"today":"tomorrow"}</button>
        {/* renderöi nimen ja listan ruokajunista */}
      <SelectUserName user={user} setUser={setUser}/>
      <FoodTrains user={user} foodTrain={foodTrain} setFoodTrain={setFoodTrain}/>
      <div className="alert-button">
          <button onClick={alertClick} className="button" disabled={!foodTrain.some(train => train.participants.includes(user))}>
           Alert
          </button>
      </div>
      <Restaurants data={restaurantData} onSelectTimeClick={setCurrentlyOpenModal} onTimeButtonClick={onTimeButtonClick} 
      showTomorrow={showTomorrow} allowReservations={user.length>0} currentlyOpenModal={currentlyOpenModal}/>
    </div>
  );
}

export default App;