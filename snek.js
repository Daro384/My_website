const directionHistory = []
const fruitHistory = []


function nextPosition(snakeVariables){ //Creates a the coordinates for the next bodyposition to spawn based on the input and the snakes direction 
    let input = snakeVariables.input
    let direction = snakeVariables.direction
    let newHead = [...snakeVariables.head]

    if (input + direction == 3) {input = direction} //input + direction will only == 3 if snake tries to go in the opposite direction of its body
    switch (input){
        case 0: //up
            newHead[0] -= 1
            snakeVariables.direction = 0
            break
        case 1: //right
            newHead[1] += 1
            snakeVariables.direction = 1
            break
        case 2: //left
            newHead[1] -= 1
            snakeVariables.direction = 2
            break
        case 3: //down
            newHead[0] += 1
            snakeVariables.direction = 3
            break
    }
    directionHistory.push(input)
    return newHead
}

function collision(newMove, snakeBody, boardSize) { //checks if the next move is safe/fruit, (if it isn't then kill snek and return false)
    let collided = false
    for (let segment of snakeBody) {
        if (newMove.toString() === segment.toString()) collided = true
    }
    if (newMove[0] >= boardSize || newMove[0] < 0) collided = true
    if (newMove[1] >= boardSize || newMove[1] < 0) collided = true

    snakeVariables.alive = !collided
    return collided
}

function snakeMove(snakeVariables, override = false){ //Updates the new coordinates of the snake and marks them on the board
    let newHead = (nextPosition(snakeVariables))
    let body = snakeVariables.body //copying the pointer to make it easier to read
    let needFruit = false
    if (!collision(newHead, body, boardSize)) {
        body.unshift(newHead)
        if (snakeBoard[newHead[0]][newHead[1]] == "*") {
            snakeVariables.length += 1
            needFruit = true
        }
        let currentLength = body.length
        if (currentLength > snakeVariables.length) {
            snakeBoard[body[currentLength-1][0]][body[currentLength-1][1]] = 0 
            document.getElementById(`${body[currentLength-1][0]} ${body[currentLength-1][1]}`).className = "emptySquare"
            body.pop()
        }

        snakeVariables.head = snakeVariables.body[0]
        snakeBoard[body[0][0]][body[0][1]] = 1
        document.getElementById(`${body[0][0]} ${body[0][1]}`).className = "snakeSquare"
        if (needFruit && !override) fruitSpawn(boardSize, body, snakeBoard)
        else if (needFruit) {
            snakeBoard[override[0]][override[1]] = "*"
            document.getElementById(`${override[0]} ${override[1]}`).className = "fruitSquare"
            return "Nom"
        }
        
    }
    else {alive = false}
}

function fruitSpawn(boardSize, excludedSquares, snakeBoard){ //places a fruit randomly on the board
    const totalSquares = boardSize ** 2
    const excludedSquaresIndexed = []
    const availableSquares = totalSquares - excludedSquares.length
    let randomNumber = Math.floor(availableSquares * Math.random())

    for (let i of excludedSquares){
        let k = boardSize * i[0]
        k += i[1]
        excludedSquaresIndexed.push(k)
    }

    excludedSquaresIndexed.sort(function(a,b){return a - b})

    for (let i of excludedSquaresIndexed){
        if (randomNumber >= i) {randomNumber++}
    }
    const fruitCords = []
    fruitCords.push(Math.floor(randomNumber/boardSize))
    fruitCords.push(randomNumber % boardSize)
    snakeBoard[fruitCords[0]][fruitCords[1]] = "*"
    document.getElementById(`${fruitCords[0]} ${fruitCords[1]}`).className = "fruitSquare"
    fruitHistory.push(fruitCords)
}

function renderSnakeBoard(snakeBoard, boardSize, snakeVariables){ //draws the snake board in HTML (used in initialize function)
    for (let i = 0; i < boardSize; i++){
        let layer = document.createElement("div")
        layer.className = "divRow"
        layer.id = "divRow" + i.toString()
        document.body.append(layer)
    }
    for (let j = 0; j < boardSize; j++){
        for (let i = 0; i < boardSize; i++){
            let square = document.createElement("div")
            square.className = "emptySquare"
            square.id = `${i} ${j}`
            document.getElementById(`divRow${i}`).appendChild(square)
        }
    }
    for (let i of snakeVariables.body) {
        document.getElementById(`${i[0]} ${i[1]}`).className = "snakeSquare"
    }
}

function deleteBoard(className){ //deletes all elements with "className"
    let oldBoard = Array.from(document.getElementsByClassName(className))
    oldBoard.forEach(divRow => {
        divRow.remove()
    })
}

function autoSnake(){
    if (snakeVariables.alive){
        snakeMove(snakeVariables)
    }
    if (!snakeVariables.alive) {
        clearInterval(stop)
        startButton.style.opacity = 0.8
        startButton.textContent = "Play Again"
    }
}

function initialize(){ // creates the starting variables for each snake game
    const snakeVariables = {}
    snakeVariables["body"] = [[10,13],[10,14],[10,15],[10,16]]
    snakeVariables["direction"] = 2
    snakeVariables["input"] = 2
    snakeVariables["length"] = 4
    snakeVariables["head"] = snakeVariables.body[0]
    snakeVariables["alive"] = true

    const boardSize = 20
    const snakeBoard = []
    const boardRow = []
    for (let i = 0; i < boardSize; i++) boardRow.push(0)
    for (let i = 0; i < boardSize; i++) snakeBoard.push([...boardRow])

    for (let segment of snakeVariables.body){
        snakeBoard[segment[0]][segment[1]] = 1
    }

    renderSnakeBoard(snakeBoard, boardSize, snakeVariables)

    return [snakeVariables, snakeBoard, boardSize]
}

function sampleGame(){ //
    snakeVariables.input = inputMoves[0]
    inputMoves.shift()
    let fruit = snakeMove(snakeVariables, fruitSpawns[0])
    if (fruit === "Nom"){
        fruitSpawns.shift()
    }
}

//sample game moves
let inputMoves = [2,2,2,2,2,2,2,3,3,3,2,2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,3,3,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,3,3,2,2,3,3,3,3,
3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,0,0,0,0,1,1,3,1,1,1,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,0,2,2,2,2,
2,0,0,0,0,0,0,0,0,2,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,3,3,3,1,1,0,0,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,
0,0,0,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,1,1,1,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,2,2,2,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,2,2,3,3,3,
3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,0,0,0,1,1,3,1,
1,1,3,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,1,1,1,3,3,3,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,1,3,3,3,3,3,3,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,2,2,0,
0,1,1,1,1,3,3,3,3,3,3,3,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,1,1,1,3,3,1,1,0,0,0,1,1,1,1,1,1,3,3,2,2,2,2,2,3,3,3,1,1,1,1,1,1,1,3,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,1,3,3,1,1,1,1,1,1,1,3,3,3,3,3,1,3,3,3,3,3,2,2,2,2,2,2,2,2,2,0,0,1,1,1,1,0,0,0,0,0,2,2,2,0,0,2,2,2,2,2,2,3,3,2,2,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,
3,3,3,2,2,2,2,2,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,2,2,2,2,3,3,3,2,2,2,2,2,2,2,3,3,3,1,1,1,1,1,1,3,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,3,3,1,
1,1,1,1,1,1,1,3,3,3,3,2,2,2,2,3,3,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,0,0,1,1,1,1,3,3,3,3,3,3,2,2,2,3,2,2,2,2,2,2,2,
2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,2,2,2,0,0,0,0,0,1,1,1,1,1,1,3,3,3,3,3,3,3,3,2,2,2,2,3,2,2,2,2,2,2,2,3,3,3,1,1,1,3,3,1,1,3,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,1,1,1,
1,3,3,1,0,0,0,0,0,0,0,2,2,2,2,2,2,0,2,2,2,3,3,3,3,3,3,3,3,3,2,2,2,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,3,3,3,3,2]
//sample fruit spawns
let fruitSpawns = [[6,6],[18,0],[18,18],[3,4],[17,1],[17,11],[11,7],[10,9],[0,1],[17,18],[15,16],[8,8],[17,7],[0,1],[1,7],[19,9],[13,9],[5,4],[2,1],[10,18],[12,2],[8,19],[2,8],[15,6],[15,19],[12,1],[7,17],[14,1],[13,10],
[15,18],[0,3],[19,12],[11,5],[15,7],[10,17],[8,2],[13,11],[15,8],[19,8],[0,10],[3,18],[11,19],[12,12],[5,14],[3,6],[1,7],[17,15],[2,14],[5,3],[8,9],[19,16],[4,8],[9,15],[11,3],[0,6],[12,18],[16,8],[9,9],
[2,6],[14,1],[17,17],[7,13],[6,17],[0,10],[18,12],[15,14],[19,16]]

var initialState = initialize()
var snakeVariables = initialState[0]
var snakeBoard = initialState[1]
var boardSize = initialState[2]

snakeBoard[12][2] = "*"  // * represents a fruit
document.getElementById(`${12} ${2}`).className = "fruitSquare"
let stopping = setInterval(sampleGame,100)

const startButton = document.getElementById("gameStart")
startButton.onclick = (e) => {  
    clearInterval(stop)
    clearInterval(stopping)
    deleteBoard("divRow")
    startButton.style.opacity = 0

    initialState = initialize()
    snakeVariables = initialState[0]
    snakeBoard = initialState[1]
    boardSize = initialState[2]
    
    fruitSpawn(boardSize, snakeVariables.body, snakeBoard)
    clearInterval(stop)
    stop = setInterval(autoSnake,100)
    

    window.addEventListener("keydown", function(e) {
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
}

document.addEventListener("keydown", function(event){
    switch (event.key){
        case "ArrowUp":
            snakeVariables.input = 0
            break
        case "ArrowRight":
            snakeVariables.input = 1
            break

        case "ArrowLeft":
            snakeVariables.input = 2
            break

        case "ArrowDown":
            snakeVariables.input = 3
            break
        }
})