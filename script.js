let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const main = document.querySelector('main');

//To remove start button
const startButton = document.querySelector(".start");

startButton.addEventListener("click", () => {
    startButton.remove();
});

//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//Populates the maze in the HTML
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

//Player movement
function keyUp(event) {
    if (event.key === 'ArrowUp') {
        upPressed = false;
    } else if (event.key === 'ArrowDown') {
        downPressed = false;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function keyDown(event) {
    if (event.key === 'ArrowUp') {
        upPressed = true;
    } else if (event.key === 'ArrowDown') {
        downPressed = true;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    }
}

//Detection with walls
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

const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
let playerTop = 0;
let playerLeft = 0;


setInterval(function() {
    if (downPressed && !checkWallCollisionForPlayer('down')) {
        playerTop++;
        player.style.top = playerTop + 'px';
        playerMouth.classList = 'down';
    } else if (upPressed && !checkWallCollisionForPlayer('up')) {
        playerTop--;
        player.style.top = playerTop + 'px';
        playerMouth.classList = 'up';
    } else if (leftPressed && !checkWallCollisionForPlayer('left')) {
        playerLeft--;
        player.style.left = playerLeft + 'px';
        playerMouth.classList = 'left';
    } else if (rightPressed && !checkWallCollisionForPlayer('right')) {
        playerLeft++;
        player.style.left = playerLeft + 'px';
        playerMouth.classList = 'right';
    }
}, 10);

// document.addEventListener('keydown', keyDown);
// document.addEventListener('keyup', keyUp);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
