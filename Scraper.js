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

const priceExpression = /\d{1,2},\d{2}\s{0,1}€/g
const foodExpression = /\s\d{1,2},\d{2}\s{0,1}€/g

const Itemifier = (menuTitleDay) => {
      menuItemDay = []
      menuItemDay2 = []
      menuTitleDay.forEach(row => {
        if (row.includes(0)) {
            menuItemDay.push(row)
            menuItemDay2.push(menuItemDay)
            menuItemDay = []
        } else{
            menuItemDay.push(row)
        }
    })
    return menuItemDay2
    }

// const getPrice = (row) => {
//     const price = row
//     return {price}
// }

// const getTitle = (row) => {
//     const title = row
//     return{title}
// }

// const getFoodObject = (title, price) => {title, price}

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
    menuWithoutWeek.forEach(row => { 
        if (row.length === 2) {
            Weekday = row

        } else {
            const food = getTitleAndPrice(row)
            //console.log('food', Food[0], Food[1])
            menuWeekArrays[Weekday].push(food)
        }
    })
    return (menuWeekArrays)
}

const getGetTreviMenu = async() => {
    const axiosResponse = await axios.get("https://ditrevi.fi/lounas")
  
      const $ = await cheerio.load(axiosResponse.data)
      let menuItemTitles = {ma: [], ti: [], ke: [], to: [], pe: []}
      //alkuperäinen tapa jolla hain ruokalistan, en nähnyt mitään tapaa hakea id:tä jälkikäteen, laiton jokaisen päivän erikseen
      //const weekDaySelectors = 
      //$("#ditrevi-ma h5 b, #ditrevi-ti h5 b, #ditrevi-ke h5 b, #ditrevi-to h5 b, #ditrevi-pe h5 b")
      const weekDayMa = $("#ditrevi-ma h5 b")
      const weekDayTi = $("#ditrevi-ti h5 b")
      const weekDayKe = $("#ditrevi-ke h5 b")
      const weekDayTo = $("#ditrevi-to h5 b")
      const weekDayPe = $("#ditrevi-pe h5 b")
      weekDayMa.each((index, row) => menuItemTitles.ma.push(row.firstChild.data))
      weekDayTi.each((index, row) => menuItemTitles.ti.push(row.firstChild.data))
      weekDayKe.each((index, row) => menuItemTitles.ke.push(row.firstChild.data))
      weekDayTo.each((index, row) => menuItemTitles.to.push(row.firstChild.data))
      weekDayPe.each((index, row) => menuItemTitles.pe.push(row.firstChild.data))
      const dayObjectMa = menuItemTitles.ma.map(menuitem => 
        ({price: menuitem.match(priceExpression)[0], food: menuitem.replace(foodExpression, "")}))
        const dayObjectTi = menuItemTitles.ti.map(menuitem => 
            ({price: menuitem.match(priceExpression)[0], food: menuitem.replace(foodExpression, "")}))
            const dayObjectKe = menuItemTitles.ke.map(menuitem => 
                ({price: menuitem.match(priceExpression)[0], food: menuitem.replace(foodExpression, "")}))
                const dayObjectTo = menuItemTitles.to.map(menuitem => 
                    ({price: menuitem.match(priceExpression)[0], food: menuitem.replace(foodExpression, "")}))
                    const dayObjectPe = menuItemTitles.pe.map(menuitem => 
                        ({price: menuitem.match(priceExpression)[0], food: menuitem.replace(foodExpression, "")}))
      let menuItemTitlesTrevi = {ma: dayObjectMa, ti: dayObjectTi, ke: dayObjectKe, to: dayObjectTo, pe: dayObjectPe}
      return menuItemTitlesTrevi
}

const getGetFontanaMenu = async() => {
    const axiosResponse = await axios.get("https://www.fontana.fi/lunch/")
  
      const $ = await cheerio.load(axiosResponse.data)
      let menuItemTitles = {ma: [], ti: [], ke: [], to: [], pe: []}
      const weekDayMa = $("#fontana-ma b, #fontana-ma span")
      const weekDayTi = $("#fontana-ti b, #fontana-ti span")
      const weekDayKe = $("#fontana-ke b, #fontana-ke span")
      const weekDayTo = $("#fontana-to b, #fontana-to span")
      const weekDayPe = $("#fontana-pe b, #fontana-pe span")
      //weekDayMa.each((index, row) => menuItemTitles.ma.push(row.firstChild.data))
      weekDayTi.each((index, row) => menuItemTitles.ti.push(row.firstChild.data))
      weekDayKe.each((index, row) => menuItemTitles.ke.push(row.firstChild.data))
      weekDayTo.each((index, row) => menuItemTitles.to.push(row.firstChild.data))
      weekDayPe.each((index, row) => menuItemTitles.pe.push(row.firstChild.data))
      const DayMa = Itemifier(menuItemTitles.ma)
      menuItemTitles.ma.push(DayMa)
      return menuItemTitles
}

const getGetTintaMenu = async() => {
    const axiosResponse = await axios.get("https://tinta.fi/lounas")
  
      const $ = await cheerio.load(axiosResponse.data)
      let menuItemTitles = []
      $("h2").parent().find("p, h2")
      .each((index, element) => menuItemTitles.push($(element).text().trim()))
      let Weekday = ""
      let menuWeekArrays = {
          ma: [],
          ti: [],
          ke: [],
          to: [],
          pe: []
          }
    menuItemTitles.forEach(row => { 
        if (row.length === 2) {
              Weekday = row.toLowerCase()
        } else if (Weekday !== "") {
              menuWeekArrays[Weekday].push(row)
          }
      })
      
const Combine = (menuWeekArray) => {
    
      const arr = menuWeekArray.filter(menu => menu !== "")

      let newWeekArray = []
      for (let index = 0; index < arr.length; index += 2) {
          const food = arr[index];
          const price = arr[index+1];
          const element = {food, price}
        newWeekArray.push(element)
      }
      return newWeekArray
}
menuWeekArrays.ma = Combine(menuWeekArrays.ma)
menuWeekArrays.ti = Combine(menuWeekArrays.ti)
menuWeekArrays.ke = Combine(menuWeekArrays.ke)
menuWeekArrays.to = Combine(menuWeekArrays.to)
menuWeekArrays.pe = Combine(menuWeekArrays.pe)
    return menuWeekArrays
}

    app.get('/blanko', async function(req, res){
        const blankoMenu = await getBlankoMenu()
    res.send(blankoMenu)

})

    app.get('/ditrevi', async function(req, res){
        const treviMenu = await getGetTreviMenu()
    res.send(treviMenu)
})

    app.get('/tinta', async function(req, res){
        const tintaMenu = await getGetTintaMenu()
    res.send(tintaMenu)
})
    app.get('/fontana', async function(req, res){
        const fontanaMenu = await getGetFontanaMenu()
    res.send(fontanaMenu)
})

app.listen('3001')

console.log('Magic happens on port 3001');

exports = module.exports = app;