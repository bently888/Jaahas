import React from 'react';
import axios from 'axios'

const joinTrain = (clickedItem, foodTrain, user, setFoodTrain, setTrainLeaveTime) => {
    //Tähän nimen syöttö
    //if (user.length<1) return setNameModal("open")
    if (foodTrain.some(train => train.participants.includes(user)))
      alert("You are already in another lunch train")
    else
    axios
      .post('/join', {time: clickedItem.time, resta: clickedItem.resta, user: user})
      .then(response => {
        setFoodTrain(response.data) 
        foodTrain.some(train => train.participants.includes(user)) && setTrainLeaveTime(clickedItem.time)
      })
      //johtuuko siitä että food train ei ole vielä ehtinyt asettua?
  }

  const deleteName = (user, foodTrain, setFoodTrain, setTrainLeaveTime, alertTimeOut) => {
    if (foodTrain.some(train => train.participants.indexOf(user)>-1))
    //alert("Try to delete from train")
    var arr = foodTrain.find(train => train.participants.indexOf(user)>-1)
    //console.log(arr.participants)
    var index = arr.participants.indexOf(user);
        arr.participants.splice(index, 1);
    axios
      .post('/delete', {user: user})
      .then(response => {
        setTrainLeaveTime(null)
        setFoodTrain(response.data)
      })
  }

function FoodTrains(props) {
  return (
    <div className="times-chosen">
        {props.foodTrain.length !== 0 ?
        props.foodTrain.map(res => 
        <p key={res.time + res.resta}>{res.resta} at {res.time}- 
        <button onClick={() => joinTrain(res, props.foodTrain, props.user, props.setFoodTrain, props.setTrainLeaveTime)} 
        disabled={props.user.length<1 
        || props.foodTrain.some(train => train.participants.indexOf(props.user)>-1)
        }>
          join train</button>{res.participants.join(", ")}
        </p>) : ""}
        <button onClick={() => deleteName(props.user, props.foodTrain, props.setFoodTrain, props.setTrainLeaveTime, props.alertTimeOut)} 
        disabled={!props.foodTrain.some(train => train.participants.includes(props.user))}>delete</button>
    </div>
  );
}

export default FoodTrains;