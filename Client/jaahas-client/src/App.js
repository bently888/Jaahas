import React, { useEffect, useState} from 'react';
import './App.css';
import axios from 'axios'
//import TimeSelection from './TimeSelection.js';
//import './TimeSelection.css';

const listOfRestaurants = [
  {name: "Blanko", url: "http://localhost:3001/blanko", lunchUrl: "https://blanko.net/lounas"},
  {name: "Di Trevi", url: "http://localhost:3001/ditrevi", lunchUrl: "https://ditrevi.fi/lounas/"},
  {name: "Fontana", url: "http://localhost:3001/fontana", lunchUrl: "https://www.fontana.fi/lunch/"},
  {name: "Tintå", url: "http://localhost:3001/tinta", lunchUrl: "https://www.tinta.fi/lounas"}
]

function App() {
  const [restaurantData, setRestaurantData] = useState([])
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState("")
  const [newNote, setNewNote] = useState(
    'Submit2'
  )

  useEffect(() => {
    listOfRestaurants.forEach(restaurant => {
      axios.get(restaurant.url)
      .then(response => setRestaurantData(oldState => ([...oldState, {...response, name: restaurant.name, lunchUrl: restaurant.lunchUrl}])))
    })
  }, [])

const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}

const handleSubmit = (event) => {
    event.preventDefault();
    console.log('button clicked', event.target, newNote)
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
        <p>{console.log(FormData)}</p>
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
          <h2>HTML Forms</h2>
                <form 
                onSubmit={handleSubmit}
                >
                <label htmlFor="appt">Choose a time for your lunch:</label>
                  <input
                  value="Name"
                  onChange={handleNoteChange}
                  />
                  <input type="submit" value="Submit"
                  //value={newNote}
                  />
                </form> 
                <h1>The datalist element</h1>

                <form action="/action_page.php" method="get">
                  <label for="time">Choose your time from the list:</label>
                  <input list="times" name="time" id="time"/>
                    <datalist id="times">
                      <option value="10:00"/>
                      <option value="10:05"/>
                      <option value="10:10"/>
                      <option value="10:15"/>
                      <option value="10:20"/>
                      <option value="10:25"/>
                      <option value="10:30"/>
                      <option value="10:35"/>
                      <option value="10:40"/>
                      <option value="10:45"/>
                      <option value="10:50"/>
                      <option value="10:55"/>
                      <option value="11:00"/>
                      <option value="11:05"/>
                      <option value="11:10"/>
                      <option value="11:15"/>
                      <option value="11:20"/>
                      <option value="11:25"/>
                      <option value="11:30"/>
                      <option value="11:35"/>
                      <option value="11:40"/>
                      <option value="11:45"/>
                      <option value="11:50"/>
                      <option value="11:55"/>
                      <option value="12:00"/>
                      <option value="12:05"/>
                      <option value="12:10"/>
                      <option value="12:15"/>
                      <option value="12:20"/>
                      <option value="12:25"/>
                      <option value="12:30"/>
                      <option value="12:35"/>
                      <option value="12:40"/>
                      <option value="12:45"/>
                      <option value="12:50"/>
                      <option value="12:55"/>
                      <option value="13:00"/>
                    </datalist>
                  <input type="submit"/>
                </form>
                <p>If you click the "Submit" button, the form-data will be ....</p>
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
