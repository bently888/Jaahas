import React, { useEffect, useState} from 'react';
import './App.css';
import axios from 'axios'
import addNotification from 'react-push-notification';
//import { response } from '../../../Backend/Scraper';

const listOfRestaurants = [
  {name: "Blanko", url: "/blanko", lunchUrl: "https://blanko.net/lounas"},
  {name: "Di Trevi", url: "/ditrevi", lunchUrl: "https://ditrevi.fi/lounas/"},
  {name: "Fontana", url: "/fontana", lunchUrl: "https://www.fontana.fi/lunch/"},
  {name: "Tintå", url: "/tinta", lunchUrl: "https://www.tinta.fi/lounas"}
]

const hours = ["10", "11", "12", "13"]
const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]
const times = hours.map(hour => minutes.map(minute => hour + ":" + minute)).flat()
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
      axios.get(restaurant.url)
      .then(response => setRestaurantData(oldState => ([...oldState, {...response, name: restaurant.name, lunchUrl: restaurant.lunchUrl}])))
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
      //console.log(foodTrain)
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

  const joinTrain = (clickedItem) => {
    //Tähän nimen syöttö
    //if (user.length<1) return setNameModal("open")
    if (foodTrain.some(train => train.participants.includes(user)))
      alert("You are already in another lunch train")
    else
    axios
      .post('/join', {time: clickedItem.time, resta: clickedItem.resta, user: user})
      .then(response => setFoodTrain(response.data))
  }

  const deleteName = () => {
    if (foodTrain.some(train => train.participants.indexOf(user)>-1))
    //alert("Try to delete from train")
    var arr = foodTrain.find(train => train.participants.indexOf(user)>-1)
    //console.log(arr.participants)
    var index = arr.participants.indexOf(user);
        arr.participants.splice(index, 1);
    axios
      .post('/delete', {user: user})
      .then(response => setFoodTrain(response.data))
  }

const parseMenu = (menuData) => {
  const now = new Date()
  const days = ['su','ma','ti','ke','to','pe','la']
  const dayIndex = now.getDay()
  const day = showTomorrow && isFriday===false  ? days[ dayIndex+1 ] : days[ dayIndex ]
  const dayMenu = menuData[day]
  return dayMenu
  }

  const alertTimeSplit = (timeOfAlert) => {
    var splitAlertTime = timeOfAlert.split(':')
    var secondsAlert = (+splitAlertTime[0]) * 60 * 60 + (+splitAlertTime[1]) * 60;
    return (secondsAlert)
  }

const alertClick = () => { 
  if(alertTimeOut) clearTimeout(alertTimeOut)
  if (foodTrain.some(train => train.participants.includes(user)))
  var trackedTrain = foodTrain.find(train => train.participants.includes(user))
  var trackedTime = trackedTrain.time
  //var trackedTimeInt = trackedTime
  var alertTime = alertTimeSplit(trackedTime)-secondsCurrent
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
          Jaahas App
        </h1>
          <button className="show-tomorrow" disabled={isFriday} onClick={() => setShowTomorrow(!showTomorrow)}>{showTomorrow?"today":"tomorrow"}</button>
        {/* renderöi nimen ja listan ruokajunista */}
        <div className="selectUserName">
          <h3>Set Username</h3>
            <div className="name-input">
              <input type="text" name="name" value={user} onChange={e => {localStorage.setItem('userData', e.target.value);
              setUser(e.target.value)}}/>
              {/*<button onClick={}/>*/}
            </div>
          </div>
        <div className="times-chosen">
          {foodTrain.length !== 0 ?
          foodTrain.map(res => 
          <p key={res.time + res.resta}>{res.resta} at {res.time}- 
          <button onClick={() => joinTrain(res)} 
          disabled={user.length<1 
          || foodTrain.some(train => train.participants.indexOf(user)>-1)
          }>
            join train</button>{res.participants.join(", ")}
          </p>) : ""}
          <button onClick={() => deleteName(user)} disabled={!foodTrain.some(train => train.participants.includes(user))}>delete</button>
        </div>
        <div className="alert-button">
          <button onClick={alertClick} className="button" disabled={!foodTrain.some(train => train.participants.includes(user))}>
           Alert
          </button>
      </div>
        <div className="restaurants-container">
        { restaurantData && restaurantData.map(restaurant => 
        <div className="restaurant" key={restaurant.name}>
          <h2>
            <a href={restaurant.lunchUrl} rel="nofollow">{restaurant.name}</a>
          </h2>
          <div className="Menu" id="Menu">
            {
            parseMenu(restaurant.data).map(row => <p key={row.food}>{row.food} {row.price}</p>)
            }
          </div>
          <button onClick={()=>setCurrentlyOpenModal(restaurant.name)} disabled={user.length<1}>Select Time</button>
          {currentlyOpenModal===restaurant.name && <div className="selectModal">
          <h2>Select Time</h2>
            <div className="time-buttons">
              {times.map(time => <button key={time} className="time-button" id={time} 
              disabled={alertTimeSplit(time)<secondsCurrent}
              onClick={() => 
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