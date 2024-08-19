let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lives = 3;

document.querySelector(".lives h1").textContent = `Lives: ${lives}`;

const main = document.querySelector('main');

// To remove start button
const startButton = document.querySelector(".start");

startButton.addEventListener("click", () => {
    startButton.remove();
});

// Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Function to randomize enemy positions
function randomizeEnemies(maze, enemyCount) {
    let emptySpaces = [];

    //to collect all empty spaces (where maze[y][x] === 0)
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 0) {
                emptySpaces.push({ y, x });
            }
        }
    }

    // to randomly place enemies in empty spaces
    for (let i = 0; i < enemyCount; i++) {
        if (emptySpaces.length === 0) break;
        let randomIndex = Math.floor(Math.random() * emptySpaces.length);
        let { y, x } = emptySpaces.splice(randomIndex, 1)[0];
        maze[y][x] = 3;
    }
}

// Randomize enemies in the maze
randomizeEnemies(maze, 3);

// Populates the maze in the HTML
for (let y of maze) {
    for (let x of y) {
        let block = document.createElement('div');
        block.classList.add('block');

        switch (x) {
            case 1:
                block.classList.add('wall');
                break;
            case 2:
                block.id = 'player';
                let mouth = document.createElement('div');
                mouth.classList.add('mouth');
                block.appendChild(mouth);
                break;
            case 3:
                block.classList.add('enemy');
                break;
            default:
                block.classList.add('point');
                block.style.height = '1vh';
                block.style.width = '1vh';
        }

        main.appendChild(block);
    }
}

const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
let playerTop = 0;
let playerLeft = 0;

setInterval(function() {
    if (downPressed && !checkWallCollisionForPlayer('down')) {
        playerTop++;
        player.style.top = playerTop + 'px';
        playerMouth.classList = 'down'; 
        checkPointCollection();
    } else if (upPressed && !checkWallCollisionForPlayer('up')) {
        playerTop--;
        player.style.top = playerTop + 'px';
        playerMouth.classList = 'up';
        checkPointCollection();
    } else if (leftPressed && !checkWallCollisionForPlayer('left')) {
        playerLeft--;
        player.style.left = playerLeft + 'px';
        playerMouth.classList = 'left';
        checkPointCollection();
    } else if (rightPressed && !checkWallCollisionForPlayer('right')) {
        playerLeft++;
        player.style.left = playerLeft + 'px';
        playerMouth.classList = 'right';
        checkPointCollection();
    }
    checkEnemyCollision();
    // if (checkEnemyCollision()) {
    //     checkGameOver();
    // }
}, 10);

function checkWallCollisionForPlayer(direction) {
    const playerRect = player.getBoundingClientRect();
    const walls = document.querySelectorAll(".wall");

    for (let wall of walls) {
        const wallRect = wall.getBoundingClientRect();

        if (direction === 'up' && playerRect.top - 1 < wallRect.bottom && playerRect.bottom > wallRect.top && playerRect.left < wallRect.right && playerRect.right > wallRect.left) {
            return true;
        } else if (direction === 'down' && playerRect.bottom + 1 > wallRect.top && playerRect.top < wallRect.bottom && playerRect.left < wallRect.right && playerRect.right > wallRect.left) {
            return true;
        } else if (direction === 'left' && playerRect.left - 1 < wallRect.right && playerRect.right > wallRect.left && playerRect.top < wallRect.bottom && playerRect.bottom > wallRect.top) {
            return true;
        } else if (direction === 'right' && playerRect.right + 1 > wallRect.left && playerRect.left < wallRect.right && playerRect.top < wallRect.bottom && playerRect.bottom > wallRect.top) {
            return true;
        }
    }

    return false;
}

function checkWinCondition() {
    const points = document.querySelectorAll('.point');
    if (points.length === 0) {
        alert("You Win!");
        // to reload the page or reset the game state
        location.reload();
    }
}

// To collect pellets
let score = 0;
function checkPointCollection() {
    const points = document.querySelectorAll('.point');
    const playerRect = player.getBoundingClientRect();

    points.forEach(point => {
        const pointRect = point.getBoundingClientRect();

        if (
            playerRect.top < pointRect.bottom &&
            playerRect.bottom > pointRect.top &&
            playerRect.left < pointRect.right &&
            playerRect.right > pointRect.left
        ) {
            // console.log("point");
            point.classList.remove("point"); 
            score+=10;
            document.querySelector(".score p").textContent = score;
            checkWinCondition();
        }
    });
}

// setInterval(checkPointCollection, 100);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            upPressed = true;
            break;
        case 'ArrowDown':
            downPressed = true;
            break;
        case 'ArrowLeft':
            leftPressed = true;
            break;
        case 'ArrowRight':
            rightPressed = true;
            break;
    }
}

function keyUp(event) {
    switch (event.key) {
        case 'ArrowUp':
            upPressed = false;
            break;
        case 'ArrowDown':
            downPressed = false;
            break;
        case 'ArrowLeft':
            leftPressed = false;
            break;
        case 'ArrowRight':
            rightPressed = false;
            break;
    }
} 

//-------------------------------------------------

function moveEnemies() {
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        const direction = Math.floor(Math.random() * 4);
        const enemyRect = enemy.getBoundingClientRect();
        let newTop = parseInt(enemy.style.top) || 0;
        let newLeft = parseInt(enemy.style.left) || 0;

        switch (direction) {
            case 0: // up
                if (!checkWallCollisionForEnemy(enemy, 'up')) newTop -= 60;
                break;
            case 1: // down
                if (!checkWallCollisionForEnemy(enemy, 'down')) newTop += 60;
                break;
            case 2: // left
                if (!checkWallCollisionForEnemy(enemy, 'left')) newLeft -= 60;
                break;
            case 3: // right
                if (!checkWallCollisionForEnemy(enemy, 'right')) newLeft += 60;
                break;
        }
        
        enemy.style.top = newTop + 'px';
        enemy.style.left = newLeft + 'px';
    });
}
// setInterval(moveEnemies, 1000);

function handleGameOver() {

    console.log("dead animation starts"); 
    // Trigger the death animation
    player.classList.add('dead');

   // Event listener for animation ends
   player.addEventListener('animationend', function onAnimationEnd() {
    console.log("Animation ended, attempting to reload");
    
    // alert("Game Over!");
    location.reload();

    player.removeEventListener('animationend', onAnimationEnd);
    
});
}



function checkEnemyCollision() {
    const playerRect = player.getBoundingClientRect();
    const enemies = document.querySelectorAll('.enemy');

    for (let enemy of enemies) {
        const enemyRect = enemy.getBoundingClientRect();

        if (
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top &&
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left
        ) {
            console.log("enemy detected");  
                   
            handleGameOver();

            // Set cooldown to prevent multiple detections
            collisionCooldown = true;
            setTimeout(() => collisionCooldown = false, 3000);

            return true;
        }
    }

    return false;
}

setInterval(checkEnemyCollision,10);

function checkWallCollisionForEnemy(enemy, direction) {
    const enemyRect = enemy.getBoundingClientRect();
    const walls = document.querySelectorAll(".wall");

    for (let wall of walls) {
        const wallRect = wall.getBoundingClientRect();

        if (direction === 'up' && enemyRect.top - 20 < wallRect.bottom && enemyRect.bottom > wallRect.top && enemyRect.left < wallRect.right && enemyRect.right > wallRect.left) {
            return true;
        } else if (direction === 'down' && enemyRect.bottom + 20 > wallRect.top && enemyRect.top < wallRect.bottom && enemyRect.left < wallRect.right && enemyRect.right > wallRect.left) {
            return true;
        } else if (direction === 'left' && enemyRect.left - 20 < wallRect.right && enemyRect.right > wallRect.left && enemyRect.top < wallRect.bottom && enemyRect.bottom > wallRect.top) {
            return true;
        } else if (direction === 'right' && enemyRect.right + 20 > wallRect.left && enemyRect.left < wallRect.right && enemyRect.top < wallRect.bottom && enemyRect.bottom > wallRect.top) {
            return true;
        }
    }

    return false;
}




