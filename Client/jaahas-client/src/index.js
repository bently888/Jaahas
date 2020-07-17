import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
//import axios from 'axios'

//const restaurantList = () => 
{/*
  const [restaurantData, setRestaurantData] = useState([])

  const fetchRestaurantData = (restaurant) => {
    return axios.get(`http://localhost:3001/blanko`)
      .then(response => {
        setRestaurantData(response);
      }).catch(error => {
        console.log(error);
      })
  }
  fetchRestaurantData()
  console.log(restaurantData)
  return (
    <div>
      {restaurantData}
    </div>
  )
  */}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
