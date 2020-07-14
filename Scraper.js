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
        }
    })
    return (menuWeekArrays)
}

const getGetTreviMenu = async() => {
    const axiosResponse = await axios.get("https://ditrevi.fi/lounas")
  
      const $ = await cheerio.load(axiosResponse.data)
      let menuItemTitles = {Ma: [], Ti: [], Ke: [], To: [], Pe: []}
      //alkuperäinen tapa jolla hain ruokalistan, en nähnyt mitään tapaa hakea id:tä jälkikäteen, laiton jokaisen päivän erikseen
      //const weekDaySelectors = 
      //$("#ditrevi-ma h5 b, #ditrevi-ti h5 b, #ditrevi-ke h5 b, #ditrevi-to h5 b, #ditrevi-pe h5 b")
      const weekDayMa = $("#ditrevi-ma h5 b")
      const weekDayTi = $("#ditrevi-ti h5 b")
      const weekDayKe = $("#ditrevi-ke h5 b")
      const weekDayTo = $("#ditrevi-to h5 b")
      const weekDayPe = $("#ditrevi-pe h5 b")
      weekDayMa.each((index, row) => menuItemTitles.Ma.push(row.firstChild.data))
      weekDayTi.each((index, row) => menuItemTitles.Ti.push(row.firstChild.data))
      weekDayKe.each((index, row) => menuItemTitles.Ke.push(row.firstChild.data))
      weekDayTo.each((index, row) => menuItemTitles.To.push(row.firstChild.data))
      weekDayPe.each((index, row) => menuItemTitles.Pe.push(row.firstChild.data))
      const dayObjectMa = menuItemTitles.Ma.map(menuitem => 
        ({price: menuitem.match(/\d{1,2},\d{2}\s{0,1}€/g)[0], food: menuitem.replace(/\s\d{1,2},\d{2}\s{0,1}€/g, "")}))
        const dayObjectTi = menuItemTitles.Ti.map(menuitem => 
            ({price: menuitem.match(/\d{1,2},\d{2}\s{0,1}€/g)[0], food: menuitem.replace(/\s\d{1,2},\d{2}\s{0,1}€/g, "")}))
            const dayObjectKe = menuItemTitles.Ke.map(menuitem => 
                ({price: menuitem.match(/\d{1,2},\d{2}\s{0,1}€/g)[0], food: menuitem.replace(/\s\d{1,2},\d{2}\s{0,1}€/g, "")}))
                const dayObjectTo = menuItemTitles.To.map(menuitem => 
                    ({price: menuitem.match(/\d{1,2},\d{2}\s{0,1}€/g)[0], food: menuitem.replace(/\s\d{1,2},\d{2}\s{0,1}€/g, "")}))
                    const dayObjectPe = menuItemTitles.Pe.map(menuitem => 
                        ({price: menuitem.match(/\d{1,2},\d{2}\s{0,1}€/g)[0], food: menuitem.replace(/\s\d{1,2},\d{2}\s{0,1}€/g, "")}))
      let menuItemTitlesTrevi = {Ma: dayObjectMa, Ti: dayObjectTi, Ke: dayObjectKe, To: dayObjectTo, Pe: dayObjectPe}
      return menuItemTitlesTrevi
}

const getGetTintaMenu = async() => {
    const axiosResponse = await axios.get("https://tinta.fi/lounas")
  
      const $ = await cheerio.load(axiosResponse.data)
      let menuItemTitles = []
      $("#block-yui_3_17_2_1_1590759187616_10825").each((index, element) => menuItemTitles.push(element.firstChild.data))
      console.log(menuItemTitles)
    return menuItemTitles
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

app.listen('3001')

console.log('Magic happens on port 3001');

exports = module.exports = app;