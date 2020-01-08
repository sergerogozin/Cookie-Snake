
let canvas = document.querySelector("#game-container");
let width = canvas.width;
let height = canvas.height;

let context = canvas.getContext("2d");
let scale = 20;
let direction = "";
let snakeArray = [];
let foodObj = {};
let timeAmount = 300;


let score = 0;
let best = 0;


window.addEventListener("keyup", startGame);
window.addEventListener("mouseup", startGame);
window.addEventListener("resize", updateCanvasSize);
window.addEventListener("load", updateCanvasSize);

function startGame() {
    window.removeEventListener("keyup", startGame);
    window.removeEventListener("mouseup", startGame);
    document.querySelector("#button-start").style.visibility = "hidden";

    let popUp = document.querySelector(".pop-up");
    if (popUp) {
        popUp.parentNode.removeChild(popUp);
    }
    score = 0
    document.querySelector("#current-score p:nth-child(2)").innerText = "0";

    document.addEventListener("keyup", function(event) {updateDirection(event)});
    
    snakeArray = makeSnake();
    drawSnake(snakeArray);

    foodObj = makeFood();
    drawFood(foodObj);

    game = setInterval(function() {updateCanvas()}, timeAmount);
}


function gameOver() {
    direction = ""
    snakeArray = [];
    foodObj = {};
    
    let popUp = document.createElement("div");
    popUp.classList.add("pop-up");

    let titleBar = document.createElement("div");
    let title = document.createElement("p");
    titleBar.classList.add("title-bar");
    title.innerText = "Game Over!";
    titleBar.appendChild(title);

    let messageBody = document.createElement("div");
    messageBody.classList.add("message-body");

    let message = document.createElement("p");
    if (score > best) {
        message.innerText = `New Best Score
        ${score}`;
        best = score;
        document.querySelector("#highest-score p:nth-child(2)").innerText = score;
    } else {
        message.innerText = `Final Score
        ${score}`;
    }

    let button = document.createElement("p");
    button.setAttribute("id", "button-try-again");
    button.innerText = "Try Again";
    button.addEventListener("click", startGame);
    
    document.querySelector("#button-start").style.visibility = "visible";
    window.addEventListener("keyup", startGame);
    
    messageBody.appendChild(message);
    messageBody.appendChild(button);
    popUp.appendChild(titleBar);
    popUp.appendChild(messageBody);

    document.querySelector("body").appendChild(popUp);

    window.clearInterval(game);
}

function makeSnake() {
    let startDirection = randomDirection();
    direction = startDirection;
    let startPointX = randomPoint("snake");
    let startPointY = randomPoint("snake");

    if (startDirection === "up") {
        return [
            {x: startPointX, y: startPointY},
            {x: startPointX, y: startPointY+1},
            {x: startPointX, y: startPointY+2},
            {x: startPointX, y: startPointY+3},
        ];
    } else if (startDirection === "down") {
        return [
            {x: startPointX, y: startPointY},
            {x: startPointX, y: startPointY-1},
            {x: startPointX, y: startPointY-2},
            {x: startPointX, y: startPointY-3},
        ];
    } else if (startDirection === "left") {
        return [
            {x: startPointX, y: startPointY},
            {x: startPointX+1, y: startPointY},
            {x: startPointX+2, y: startPointY},
            {x: startPointX+3, y: startPointY},
        ]
    } else {
        return [
            {x: startPointX, y: startPointY},
            {x: startPointX-1, y: startPointY},
            {x: startPointX-2, y: startPointY},
            {x: startPointX-3, y: startPointY},
        ]
    }
}

function randomPoint(type = "food") {
    let point = Math.round(Math.random() * ((width - scale) / scale));
    if (type === "snake") {
        while (point < 5 || point > (((width - scale) / scale) - 5)) {
            point = Math.round(Math.random() * ((width - scale) / scale));
        }
    }
    return point;
}

function randomDirection() {
    let number = Math.round(Math.random() * 3);
    switch (number) {
        case 0:
            return "up";
        case 1:
            return "down";
        case 2:
            return "left";
        case 3: 
            return "right";
    } 
}

function drawSnake(array) {
    context.fillStyle = "green";
    context.fillRect(array[0].x*20, array[0].y*20, scale, scale);

    for (let i = 1; i < array.length; i++) {
        context.fillStyle = "green";
        context.fillRect(array[i].x*20, array[i].y*20, scale, scale);
    }
}

function makeFood() {
    let coordinates = {
        x: randomPoint(),
        y: randomPoint()
    }
    let match = false;

    do {
        for (let cell of snakeArray) {
            if (cell.x === coordinates.x && cell.y === coordinates.y) {
                match = true;
                coordinates.x = randomPoint();
                coordinates.y = randomPoint();
            }
        }
    } while (match);

    return coordinates;
}

function drawFood(foodObj) {
    createImage('cookie.svg', foodObj)
}

function createImage(source, positionObject) {
    let img = new Image();
    img.src = source;

    img.onload = function() {
        context.drawImage(img, positionObject.x * scale, positionObject.y * scale, scale, scale);
    }
}

function updateCanvas() {
    context.clearRect(0, 0, width, height);

    let headX = snakeArray[0].x;
    let headY = snakeArray[0].y;

    if (direction === "up") {
        headY--;
    } else if (direction === "down") {
        headY++;
    } else if (direction === "right") {
        headX++;
    } else {
        headX--;
    }


    if (checkBoundaries(headX, headY)) {
        gameOver();
        return;
    }
    
    if (headX == foodObj.x && headY == foodObj.y) {
        foodObj = makeFood();
        score++;
        document.querySelector("#current-score p:nth-child(2)").innerText = score;
    } else {
        snakeArray.pop();
    }

    snakeArray.unshift({x: headX, y: headY});

    drawFood(foodObj)
    drawSnake(snakeArray);  
}

function updateCanvasSize() {
    let windowHeight = window.innerHeight;
    let newCanvasHeight;
    if (windowHeight < 450) {
        newCanvasHeight = 500
        document.querySelector("#game-container").classList.remove("small-margin");
        document.querySelector("#button-start").classList.remove("small-margin"); 
    } else {
        if (windowHeight > 450 && windowHeight < 490) {
           document.querySelector("#game-container").classList.add("small-margin");
           document.querySelector("#button-start").classList.add("small-margin"); 
        } else {
            document.querySelector("#game-container").classList.remove("small-margin");
            document.querySelector("#button-start").classList.remove("small-margin");  
        }
        newCanvasHeight = Math.round(windowHeight / 100 * 65);
        while (newCanvasHeight % scale !== 0) {
            newCanvasHeight++;
        }
    }
    width = newCanvasHeight;
    height = newCanvasHeight;
    document.querySelector("#game-container").setAttribute("height", `${newCanvasHeight}`);
    document.querySelector("#game-container").setAttribute("width", `${newCanvasHeight}`);
}

function updateDirection(event) {
    let key = event.key;
    if (key === "ArrowUp" && direction !== "down") {
        direction = "up";
    } else if (key === "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (key === "ArrowRight" && direction !== "left") {
        direction = "right"
    }
}

function checkBoundaries(x, y) {
    return ( x < 0 || x >= width/scale || y < 0 || y >= height/scale || checkCollision(x, y));
}

function checkCollision(x, y) {
    for (let cell of snakeArray) {
        if (cell.x === x && cell.y === y) {
            return true;
        }
    }
    return false;
}



























/*canvas = document.querySelector("#game-container");
let context = canvas.getContext("2d");

let best = 0;
let score = 0;

let snake, dessert, gameLoop, direction


initializeGame();




function initializeGame() {
    snake = makeSnake();
    dessert = makeFood(snake)

    window.addEventListener("keydown", function(event) {
        let key = event.key;
        if (key === "ArrowUp" && direction !== "down") {
            direction = "up";
        } else if (key === "ArrowDown" && direction !== "up") {
            direction = "down";
        } else if (key === "ArrowLeft" && direction !== "right") {
            direction = "left";
        } else if (key === "ArrowRight" && direction !== "left") {
            direction = "right"
        }
    })

    if (typeof gameLoop !== "undefined") {
        clearInterval(gameLoop);
    }
    gameLoop = setInterval( function() {
        updateCanvas(snake, dessert);
    }, 100);
}


function endGame() {
    let p = 0;
}








































function makeSnake() {
    let initialX = randomPoint();
    let initialY= randomPoint();
    
    while(checkPosition(initialX)) {
        initialX = randomPoint();
    }
    while(checkPosition(initialY)) {
        initialY = randomPoint();
    }
    
    direction = pickDirection();
    
    if (direction === "right") {
       return  [ 
            {x: initialX, y: initialY}, 
            {x: initialX - 1, y:initialY}, 
            {x: initialX - 2, y:initialY} ];
    } else {
        return [ {x: initialX, y: initialY}, {x: initialX, y:initialY - 1}, {x: initialX, y:initialY - 2} ];
    }
}


function makeFood(snake) {
    let foodX = randomPoint();
    let foodY = randomPoint();
    let check = false;
    
    do {
        for (let cell of snake) {
            if (cell.x === foodX && cell.y === foodY) {
                check = true;
                x = randomPoint();
                y = randomPoint();
            }
        }
    } while (check);

    return {
        foodX,
        foodY
    }
}

function updateCanvas(snake, dessert) {
    for (let part of snake) {
        context.clearRect(part.x * scale, part.y * scale, scale, scale);
    }
    //context.clearRect(dessert.x * scale, dessert.y * scale, scale, scale);

    //context.clearRect(0, 0, canvas.height, canvas.height);

    let newX = snake[0].x;
    let newY = snake[0].y;

    if (direction === "right") {
        newX++;
    } else if (direction === "down") {
        newY++;
    } else if (direction === "up") {
        newY--;
    } else if (direction === "left") {
        newX--;
    }

    if (newX === -1 || newX === canvas.width / scale || newY === -1 || newY === canvas.height / scale || checkCollision(newX, newY, snake)) {
        if (score > best) {
            document.querySelector("#highest-score p:nth-child(2)").textContent = score;
        }
        score = 0;
        document.querySelector("#current-score p:nth-child(2)").textContent = score;
        initializeGame();
        return;
    }

    if (newX === dessert.x && newY === dessert.y) {
        context.clearRect(dessert.x * scale, dessert.y * scale, scale, scale);
        dessert = makeFood(snake);
        console.log(dessert);
        score++;
        document.querySelector("#current-score p:nth-child(2)").textContent = score;

    } else {
        snake.pop();
    }
    
    snake.unshift({x: newX, y: newY});
    console.log(dessert);
    drawFood(dessert)
    drawSnake(snake);   
}


function checkPosition(position) {
    switch(position) {
        case 0:
        case 1:
        case 2:
        case (canvas.height / scale):
            return true;
    }
    return false;
}

function pickDirection() {
    let number = Math.round(Math.random());
    if (number === 1) {
        return "right";
    } else {
        return "down"
    };
}

function randomPoint() {
    return Math.round(Math.random() * ((canvas.width - scale) / scale));

}


function checkCollision(x, y, snake) {
    for (let cell of snake) {
        if (cell.x === x && cell.y === y) {
            return true;
        }
    }
    return false;
}



console.log(snake);
console.log(dessert)































/*function drawSnake(snake) {
    createImage('snake-head.svg', snake[0])
    for (let i = 1; i < snake.length; i++) {
        createImage('snake-body.svg', snake[i]);
    }    
    //createImage('snake-tail.svg', snake[snake.length-1]);
}*/

/*function drawSnake(snake) {
    for (let i = 1; i < snake.length; i++) {
        context.fillStyle = "green";
        context.fillRect(snake[i].x * scale, snake[i].y * scale, scale, scale )
    }
}

function drawFood(dessert) {
    createImage('cookie.svg', dessert)
}

function createImage(source, positionObject) {
    let img = new Image();
    img.src = source;

    img.onload = function() {
        context.drawImage(img, positionObject.x * scale, positionObject.y * scale, scale, scale);
    }
}*/