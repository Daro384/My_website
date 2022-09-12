export function nextPosition(snakeVariables){ //Creates a the coordinates for the next bodyposition to spawn based on the input and the snakes direction 
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

export function collision(newMove, snakeBody, boardSize) { //checks if the next move is safe/fruit, (if it isn't then kill snek and return false)
    let collided = false
    for (let segment of snakeBody) {
        if (newMove.toString() === segment.toString()) collided = true
    }
    if (newMove[0] >= boardSize || newMove[0] < 0) collided = true
    if (newMove[1] >= boardSize || newMove[1] < 0) collided = true

    snakeVariables.alive = !collided
    return collided
}

export function snakeMove(snakeVariables, override = false){ //Updates the new coordinates of the snake and marks them on the board
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

export function fruitSpawn(boardSize, excludedSquares, snakeBoard){ //places a fruit randomly on the board
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

export function renderSnakeBoard(snakeBoard, boardSize, snakeVariables){
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

export function deleteBoard(className){ //deletes all elements with "className"
    let oldBoard = Array.from(document.getElementsByClassName(className))
    oldBoard.forEach(divRow => {
        divRow.remove()
    })
}

export function autoSnake(){
    if (snakeVariables.alive){
        snakeMove(snakeVariables)
    }
    if (!snakeVariables.alive) {
        clearInterval(stop)
        startButton.style.opacity = 0.8
        startButton.textContent = "Play Again"
    }
}

export function initialize(){ // creates the starting variables for each snake game
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