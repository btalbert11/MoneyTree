// Single money tree. Hold a certain amount of money, when it runs out there is a timer until it is refreshed
class MoneyTree {
    constructor(timeToGrow = 10000, germinateTime = 1000, moneyAmount = 0, maxMoney = 100) {
        this.maxMoney = maxMoney
        this.timeToGrow = timeToGrow // When buying a new tree
        this.germinateTime = germinateTime // time to refresh all money in tree
        this.moneyAmount = moneyAmount // money in tree
        this.refreshTimer = undefined // used to track when tree has money again, will be an intervalTimeout
        this.growTimer  = undefined // used to track when tree is done growing with interval timeout
        this.active = false // set when grown
        this.hasMoney = true // set to true when after money grown

        if (this.moneyAmount == 0 || this.moneyAmount > this.maxMoney) {
            this.moneyAmount = this.maxMoney
        }
    }

    // Called by a timeout function to restore money
    regrowMoney() {
        this.hasMoney = true
        this.moneyAmount = this.maxMoney
        this.refreshTimer = undefined
        console.log("tree is back", new Date(Date.now()).toString(), this.moneyAmount)
        updateTreeListIcons()
    }

    activate() {
        this.active = true
        this.growTimer = undefined
        updateTreeListIcons()
    }
}

// Global vars to reference
var mainGameLoop // performs all continous actions ever tick. set in the init function
var treeList = document.getElementById("treeList")

// Global game data
var gameData = {
    money: 0, // player money
    moneyPerClick: 1, // money made per click
    workerCost: 10, // cost of a worker
    moneyInterval: 1000, // how often money is automatically made, in ms
    moneyIntervalCost: 10, // cost to reduce interval
    Trees: [new MoneyTree()], // list of money trees
    treeCost: 10, // cost of new tree
    lastTickTime: Date.now(), // real time of last tick
    globalTickRate: 1, // tick rate of game, in ms. This may become a problem being so often
    tickCount: 0, // used to count ticks for money collection
}

var pageStateData = {
    currentPage: "moneyTreeMenu",
}

// Update icons of trees for having money/not
function updateTreeListIcons() {
    // Remove all elements of tree list to re-add
    while (treeList.firstChild) {
        treeList.removeChild(treeList.firstChild)
    }
    gameData.Trees.forEach(function (tree) {
        // Tree has money
        var li = document.createElement("li")
        li.setAttribute("id", "tree")
        li.setAttribute("class", "tree")
        if (tree.hasMoney) {
            li.append("🌳")
        }
        // Tree has no money
        else {
            li.append("DEAD")            
        }
        treeList.appendChild(li)
    })
}

// Loop through all trees, add money to total, and reduce money in tree
function harvestMoney() {
    gameData.Trees.forEach(function (tree, i) {
        console.log(i, tree)
        // Tree still growing after purchase or after running out money
        if (!tree.active || !tree.hasMoney) {return}
        // Tree has more than full amount
        if (tree.moneyAmount > gameData.moneyPerClick) {
            gameData.money += gameData.moneyPerClick
            tree.moneyAmount -= gameData.moneyPerClick
        }
        // Tree will run out, update icon
        else if (tree.moneyAmount > 0 && tree.moneyAmount <= gameData.moneyPerClick) { // tree will run out
            gameData.money += tree.moneyAmount
            tree.moneyAmount = 0
            tree.refreshTimer = 0
            tree.hasMoney = false
            // set tree timeout
            tree.refreshTimer = window.setTimeout(function() {
                tree.regrowMoney()
            }, tree.germinateTime)
            // document.getElementById("tree").innerHTML = "DEAD"
            updateTreeListIcons()
        }
        // Error?
        else {
            console.error("HARVEST MONEY ERROR")
        }
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

function plantTree() {
    if (gameData.money >= gameData.treeCost) {
        var newTree = new MoneyTree()
        // Change money
        gameData.Trees.push(newTree)
        gameData.money -= gameData.treeCost
        gameData.treeCost *= 10
        // Setup growth timeout
        newTree.growTimer = window.setTimeout(function () {
            newTree.activate()
        }, newTree.timeToGrow)
        // Update html
        document.getElementById("plantTree").innerHTML = "Plant a new Money Tree: " + (gameData.treeCost) + " moneys"
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