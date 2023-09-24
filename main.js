var gameData = {
    money: 0,
    moneyPerClick: 1,
    workerCost: 10,
    moneyInterval: 1000,
    moneyIntervalCost: 10,
}

function harvestMoney() {
    gameData.money += gameData.moneyPerClick
    document.getElementById("moneyHarvested").innerHTML = "You have " + gameData.money + " money"
    document.getElementById("workerBuy").innerHTML = "Buy a Worker (" + (gameData.moneyPerClick - 1) + " Owned): " + gameData.workerCost + " moneys" 
}

function buyWorker() {
    if (gameData.money > gameData.workerCost) {
        gameData.money -= gameData.workerCost
        gameData.moneyPerClick += 1
        gameData.workerCost *= 2
        document.getElementById("moneyHarvested").innerHTML = "You have " + gameData.money + " money"
        document.getElementById("workerBuy").innerHTML = "Buy a Worker (" + (gameData.moneyPerClick - 1) + " Owned): " + gameData.workerCost + " moneys" 
    }
}

var mainGameLoop = window.setInterval(function() {
    harvestMoney()
}, gameData.moneyInterval)

function buyFasterMoney() {
    console.log("HERHERHER", gameData.money, gameData.moneyIntervalCost)
    if (gameData.money > gameData.moneyIntervalCost) {
        gameData.money -= gameData.moneyIntervalCost
        gameData.moneyIntervalCost = Math.floor(gameData.moneyIntervalCost * 2.2)
        gameData.moneyInterval = Math.ceil(gameData.moneyInterval * 0.99)
        mainGameLoop = window.setInterval(function() {
            harvestMoney()
        }, gameData.moneyInterval)
        document.getElementById("buyFasterMoney").innerHTML = "Speed up production (Current " + gameData.moneyInterval + "ms" + "): " + gameData.moneyIntervalCost
    }
}

// var saveGameLoop = window.setInterval(function() {
//     localStorage.setItem("moneyTreeSave", JSON.stringify(gameData))
// }, 1000)

// var saveGame = JSON.parse(localStorage.getItem("moneyTreeSave"))
// if (saveGame !== null) {
//     gameData = saveGame
//     document.getElementById("moneyHarvested").innerHTML = "You have " + gameData.money + " money"
    
// }