import React from "react";
import { alertTimeSplit } from "./App.js";

const currentdate = new Date();
const isFriday = currentdate.getDay() === 5;
const hours = ["10", "11", "12"];
const testMinutes =  Array.from(Array(60).keys())
const times = hours
  .map((hour) => testMinutes.map((minute) => hour + ":" + minute))
  .flat();
const datetime =
  currentdate.getHours() +
  ":" +
  currentdate.getMinutes() +
  ":" +
  currentdate.getSeconds();
const splitTime = datetime.split(":");
const secondsCurrent =
  +splitTime[0] * 60 * 60 + +splitTime[1] * 60 + +splitTime[2];

const parseMenu = (menuData, showTomorrow) => {
  const now = new Date();
  const days = ["su", "ma", "ti", "ke", "to", "pe", "la"];
  const dayIndex = now.getDay();
  const day =
    showTomorrow && isFriday === false ? days[dayIndex + 1] : days[dayIndex];
  const dayMenu = menuData[day];
  return dayMenu;
};

const compareRestaurants = (restaurantA, restaurantB) => {
  if (restaurantA.name > restaurantB.name) return 1;
  else return -1;
};

function Restaurants(props) {
  //console.log("getseconds", DateTime())
  return (
    <div className="restaurants-container">
      {props.data &&
        props.data.sort(compareRestaurants).map((restaurant) => (
          <div className="restaurant" key={restaurant.name}>
            <h2>
              <a href={restaurant.lunchUrl} rel="nofollow">
                {restaurant.name}
              </a>
            </h2>
            <div className="Menu" id="Menu">
              {restaurant.data &&
                parseMenu(restaurant.data, props.showTomorrow).map((row) => (
                  <p key={row.food}>
                    {row.food} {row.price}
                  </p>
                ))}
            </div>
            <button
              onClick={() => props.onSelectTimeClick(restaurant.name)}
              disabled={!props.allowReservations}
            >
              Select Time
            </button>
            {props.currentlyOpenModal === restaurant.name && (
              <div className="selectModal">
                <h2>Select Time</h2>
                <div className="time-buttons">
                  {times.map((time) => (
                    <button
                      key={time}
                      className="time-button"
                      id={time}
                      disabled={alertTimeSplit(time) < secondsCurrent}
                      onClick={() =>
                        props.onTimeButtonClick(time, restaurant.name)
                      }
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <button onClick={() => props.onSelectTimeClick("")}>
                  close
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

export default Restaurants;
