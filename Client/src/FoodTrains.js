import React from "react";
import axios from "axios";

const joinTrain = (
  clickedItem,
  foodTrain,
  user,
  setFoodTrain,
  setTrainLeaveTime
) => {
  if (foodTrain.some((train) => train.participants.includes(user)))
    alert("You are already in another lunch train");
  else
    axios
      .post("/join", {
        time: clickedItem.time,
        resta: clickedItem.resta,
        user: user,
      })
      .then((response) => {
        setFoodTrain(response.data);
        setTrainLeaveTime(clickedItem.time);
      });
};

const deleteName = (user, foodTrain, setFoodTrain, setTrainLeaveTime) => {
  if (foodTrain.some((train) => train.participants.includes(user)))
    axios.post("/delete", { user: user }).then((response) => {
      setTrainLeaveTime(null);
      setFoodTrain(response.data);
    });
};

function FoodTrains(props) {
  return (
    <div className="times-chosen">
      {props.foodTrain.length !== 0 &&
        props.foodTrain.map((res) => (
          <p key={res.time + res.resta}>
            {res.resta} at {res.time}-
            <button
              onClick={() =>
                joinTrain(
                  res,
                  props.foodTrain,
                  props.user,
                  props.setFoodTrain,
                  props.setTrainLeaveTime
                )
              }
              disabled={
                props.user.length < 1 ||
                props.foodTrain.some(
                  (train) => train.participants.indexOf(props.user) > -1
                )
              }
            >
              join train
            </button>
            {res.participants.join(", ")}
          </p>
        ))}
      <button
        onClick={() =>
          deleteName(
            props.user,
            props.foodTrain,
            props.setFoodTrain,
            props.setTrainLeaveTime
          )
        }
        disabled={
          !props.foodTrain.some((train) =>
            train.participants.includes(props.user)
          )
        }
      >
        delete
      </button>
    </div>
  );
}

export default FoodTrains;
