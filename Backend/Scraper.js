const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio')
const app     = express();

// const getHomePage = async() => {
//     const listResponse = await app.get("/")
//     console.log(listResponse)
//     const $ = await cheerio.load(listResponse.data)

//   return listResponse
// }

const getTitleAndPrice = (row) => {
    const len = row.length
    const price = row.substring(len-5)
    const food = row.substring(0, len-5)
    return {food, price}
    }

const priceExpression = /\d{1,2},\d{2}\s{0,1}/g
const foodExpression = /\s\d{1,2},\d{2}\s{0,1}€/g

const itemifier = (ItemDay) => {
    menuItemDay = ""
    menuTitleDay = ItemDay
    menuTitleDay2 = []
    menuTitleDay.forEach(row => {
      if (row.includes(0)) {
          menuItemDay += row
          menuTitleDay2.push(menuItemDay)
          menuItemDay = ""
      } else {
          menuItemDay += row + " "
      }
    })
    //console.log(menuTitleDay2)
    return menuTitleDay2
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

const getTreviMenu = async() => {
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

const handleFontanaFoodRow = (row) => {
    let foodAndPrices = []
    row.each((i, foodRow) => {
        if (foodRow.children.length > 1) {
            foodRow.children.forEach(innerFoodRow => {
                if (innerFoodRow.data && innerFoodRow.data.length > 1) 
                    foodAndPrices.push(innerFoodRow.data) 
            })
        }
        else if (foodRow.firstChild.data && foodRow.firstChild.data.length > 1) 
            foodAndPrices.push(foodRow.firstChild.data)
    })
    return foodAndPrices
}

const getFontanaMenu = async() => {
    const axiosResponse = await axios.get("https://www.fontana.fi/lunch/")
  
      const $ = await cheerio.load(axiosResponse.data)
    let menuItemTitles = {ma: [], ti: [], ke: [], to: [], pe: []}
    let menuItemTitles2 = {ma: [], ti: [], ke: [], to: [], pe: []}
    menuItemTitles.ma = handleFontanaFoodRow($("#fontana-ma b, #fontana-ma span"))
    menuItemTitles.ti = handleFontanaFoodRow($("#fontana-ti b, #fontana-ti span"))
    menuItemTitles.ke = handleFontanaFoodRow($("#fontana-ke b, #fontana-ke span"))
    menuItemTitles.to = handleFontanaFoodRow($("#fontana-to b, #fontana-to span"))
    menuItemTitles.pe = handleFontanaFoodRow($("#fontana-pe b, #fontana-pe span"))
      const dayMa = itemifier(menuItemTitles.ma)
      const dayTi = itemifier(menuItemTitles.ti)
      const dayKe = itemifier(menuItemTitles.ke)
      const dayTo = itemifier(menuItemTitles.to)
      const dayPe = itemifier(menuItemTitles.pe)
    menuItemTitles2.ma = dayMa
    menuItemTitles2.ti = dayTi
    menuItemTitles2.ke = dayKe
    menuItemTitles2.to = dayTo
    menuItemTitles2.pe = dayPe
    const dayObjectMa = menuItemTitles2.ma.map(menuitem => 
        ({price: menuitem.match(priceExpression)[0], food: menuitem.replace(foodExpression, "")}))
        const dayObjectTi = menuItemTitles2.ti.map(menuitem => 
            ({price: menuitem.match(priceExpression)[0], food: menuitem.replace(foodExpression, "")}))
            const dayObjectKe = menuItemTitles2.ke.map(menuitem => 
                ({price: menuitem.match(priceExpression)[0], food: menuitem.replace(foodExpression, "")}))
                const dayObjectTo = menuItemTitles2.to.map(menuitem => 
                    ({price: menuitem.match(priceExpression)[0], food: menuitem.replace(foodExpression, "")}))
                    const dayObjectPe = menuItemTitles2.pe.map(menuitem => 
                        ({price: menuitem.match(priceExpression)[0], food: menuitem.replace(foodExpression, "")}))
    let menuItemTitlesFontana = {ma: dayObjectMa, ti: dayObjectTi, ke: dayObjectKe, to: dayObjectTo, pe: dayObjectPe}
    console.log('fontana', menuItemTitles.ma)
    return menuItemTitlesFontana
}

const getTintaMenu = async() => {
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

// app.get('/home', async function(req, res){       
//     const homePage = await getHomePage()
//     res.send(homePage)
// })

    app.get('/blanko', async function(req, res){
        const blankoMenu = await getBlankoMenu()
    res.send(blankoMenu)

})

    app.get('/ditrevi', async function(req, res){
        const treviMenu = await getTreviMenu()
    res.send(treviMenu)
})

    app.get('/tinta', async function(req, res){
        const tintaMenu = await getTintaMenu()
    res.send(tintaMenu)
})
    app.get('/fontana', async function(req, res){
        const fontanaMenu = await getFontanaMenu()
        //console.log('fontana', fontanaMenu)
    res.send(fontanaMenu)
})

app.listen('3001')

console.log('Magic happens on port 3001');

exports = module.exports = app;