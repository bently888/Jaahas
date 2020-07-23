import React, { useState } from 'react'
import app from '../Scraper'

const getFoodTrains = () => {
  const [ foodTrain, setFoodTrain] = useState([
    ""
  ]) 
  const [ newTime, setNewTime ] = useState('')

  return (
    <div>
      
    </div>
  )

}

app.get('/foodTrains', async function(req, res){
    const foodTrains = await getFoodTrains()
    //console.log('fontana', fontanaMenu)
res.send(foodTrains)
})

export default foodTrain