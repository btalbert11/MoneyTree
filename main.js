// Single money tree. Hold a certain amount of money, when it runs out there is a timer until it is refreshed
class MoneyTree {
    constructor(timeToGrow = 10000, germinateTime = 1000, moneyAmount = 1000, maxMoney = 1000) {
        this.maxMoney = maxMoney
        this.timeToGrow = timeToGrow // When buying a new tree
        this.germinateTime = germinateTime // time to refresh all money in tree
        this.moneyAmount = moneyAmount // money in tree
        this.refreshTimer // used to track when tree has money again, will be an intervalTimeout
        this.active = false // set when grown
        this.outOfMoney = false // set to true when regrowing money
    }

    // Called by a timeout function to restore money
    regrowTimer() {
        this.outOfMoney = false
        this.moneyAmount = this.maxMoney
        console.log("tree is back", new Date(Date.now()).toString(), this.moneyAmount)
    }
}

var mainGameLoop // performs all continous actions ever tick. set in the init function

// Global game data
var gameData = {
    money: 0, // player money
    moneyPerClick: 1, // money made per click
    workerCost: 10, // cost of a worker
    moneyInterval: 1000, // how often money is automatically made, in ms
    moneyIntervalCost: 10, // cost to reduce interval
    Trees: [new MoneyTree()], // list of money trees
    lastTickTime: Date.now(), // real time of last tick
    globalTickRate: 1, // tick rate of game, in ms. This may become a problem being so often
    tickCount: 0, // used to count ticks for money collection
}

var pageStateData = {
    currentPage: "moneyTreeMenu",
}



// Loop through all trees, add money to total, and reduce money in tree
function harvestMoney() {
    gameData.Trees.forEach(function (tree, i) {
        // console.log(i, tree)
        if (!tree.active) {return}
        if (tree.moneyAmount > gameData.moneyPerClick) { // can get full amount, tree will not run out
            gameData.money += gameData.moneyPerClick
            tree.moneyAmount -= gameData.moneyPerClick
        }
        else if (tree.moneyAmount > 0 && tree.moneyAmount <= gameData.moneyPerClick) { // tree will run out
            gameData.money += tree.moneyAmount
            tree.moneyAmount = 0
            tree.refreshTimer = 0
            tree.outOfMoney = true
            // set tree timeout
            tree.refreshTimer = window.setTimeout(function() {
                tree.regrowTimer()
            }, tree.germinateTime)
            document.getElementById("tree").innerHTML = "DEAD"
        }
        else {}
    })

    //gameData.money += gameData.moneyPerClick
    document.getElementById("moneyHarvested").innerHTML = "You have " + gameData.money + " money"
    //document.getElementById("workerBuy").innerHTML = "Buy a Worker (" + (gameData.moneyPerClick - 1) + " Owned): " + gameData.workerCost + " moneys" 
}

function buyWorker() {
    if (gameData.money > gameData.workerCost) {
        gameData.money -= gameData.workerCost
        gameData.moneyPerClick += 1
        gameData.workerCost *= 2
        //document.getElementById("moneyHarvested").innerHTML = "You have " + gameData.money + " money"
        document.getElementById("workerBuy").innerHTML = "Buy a Worker (" + (gameData.moneyPerClick - 1) + " Owned): " + gameData.workerCost + " moneys" 
    }
}


function buyFasterMoney() {
    if (gameData.money > gameData.moneyIntervalCost) {
        gameData.money -= gameData.moneyIntervalCost
        gameData.moneyIntervalCost = Math.floor(gameData.moneyIntervalCost * 2.2)
        gameData.moneyInterval = Math.ceil(gameData.moneyInterval * 0.99)
        document.getElementById("buyFasterMoney").innerHTML = "Speed up production (Current " + gameData.moneyInterval + "ms" + "): " + gameData.moneyIntervalCost
    }
}

function tab(tab) {
    document.getElementById(pageStateData.currentPage).style.display = "none"
    document.getElementById(tab).style.display = "inline-block"
    pageStateData.currentPage = tab
}

function init() {
    // Setup the game loop, handles all continous game
    mainGameLoop = window.setInterval(function() {
        // Update tick data
        diff = Date.now() - gameData.lastTickTime
        gameData.tickCount += diff
        gameData.lastTickTime = Date.now()
        
        // harvest money if its time
        if (gameData.tickCount >= gameData.moneyInterval) {
            harvestMoney()
            gameData.tickCount = 0
        }
    }, gameData.globalTickRate)
    // Move to starting tab, init starting trees
    tab("moneyTreeMenu")
    gameData.Trees.forEach (function (tree, i) {
        tree.active = true
        tree.timeToGrow = 0
    })
}

// Save to local storage, load save if it already exists
// var saveGameLoop = window.setInterval(function() {
//     localStorage.setItem("moneyTreeSave", JSON.stringify(gameData))
// }, 1000)

// var saveGame = JSON.parse(localStorage.getItem("moneyTreeSave"))
// if (saveGame !== null) {
//     gameData = saveGame
//     document.getElementById("moneyHarvested").innerHTML = "You have " + gameData.money + " money"
    
// }