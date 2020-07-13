const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio')
const app     = express();

const getTitleAndPrice = (row) => {
    const len = row.length
    const price = row.substring(len-5)
    const food = row.substring(0, len-5)
    return {food, price}
    }

const getBlankoMenu = async() => {
    const axiosResponse = await axios.get("https://blanko.net/lounas")

    const $ = await cheerio.load(axiosResponse.data)
    const menuItemTitles = []
    $(".menu-item-title").each((index, element) => menuItemTitles.push(element.firstChild.data))
    const menuWithoutWeek = menuItemTitles.filter(menu => menu !== menuItemTitles[0])
    //const [head, ...tail] = menuItemTitles
    let Weekday = ""
    let menuWeekArrays = {
        Ma: [],
        Ti: [],
        Ke: [],
        To: [],
        Pe: []
        }
    //const Food = getTitleAndPrice(row).Food
    menuWithoutWeek.forEach(row => { 
        if (row.length === 2) {
            Weekday = row

        } else {
            const food = getTitleAndPrice(row)
            //console.log('food', Food[0], Food[1])
            menuWeekArrays[Weekday].push(food)
            //menuWeekArrays[Weekday] = menuWeekArrays[Weekday] + row
        }
    })
    //menuItemTitles.forEach(row => )
    return (menuWeekArrays)
}

    app.get('/blanko', async function(req, res){
        const blankoMenu = await getBlankoMenu()
    res.send(blankoMenu)

})

app.get('/ditrevi', async function(req, res){

    //All the web scraping magic will happen here
    const axiosResponse = await axios.get("https://ditrevi.fi/lounas")
  
      const $ = await cheerio.load(axiosResponse.data)
      const menuItemTitles = []
      const weekDaySelectors = 
      $("div.elementor-widget-container div.elementor-element div.elementor-widget-container h2.elementor-heading-title, h5 b")
      const menuItemSelectors = 
      $("h5 b")
      //const weekDayTitles = weekDaySelectors.find(".elementor-heading-title.elementor-size-default")
      weekDaySelectors.each(row => menuItemTitles.push(row))
      const menuWithoutRandomText = menuItemTitles.filter(menu => menu !== menuItemTitles[0] && menuItemTitles[1])
      console.log(menuItemTitles)
      //weekDaySelectors.each((i, title) => {
          //console.log(title.firstChild.data)
      //})
      res.send(weekDaySelectors.toString())
})

app.listen('3001')

console.log('Magic happens on port 3001');

exports = module.exports = app;