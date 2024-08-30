let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const main = document.getElementsByTagName('main')[0];

// To remove start button when clicked upon and to make the enemies move
let gameOver = false;
let enemyMovementInterval;
 
const startButton =  document.getElementsByClassName("start")[0];

let gameStarted = false;
let gameReady = false;

startButton.addEventListener("click", () => {
    startButton.remove();
    startMusic.play();
    startMusic.addEventListener('ended', () => {
        gameReady = true;
        gameStarted = true;
        enemyMovementInterval = setInterval(moveEnemies, 2000);
    });
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
                // player.style.zIndex = '100';
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

const player = document.getElementById('player');
const playerMouth = player.getElementsByClassName('mouth')[0];
let playerTop = 0;
let playerLeft = 0;

// To move using the arrow buttons displayed in the game
const upButton = document.getElementById('ubttn');
const downButton = document.getElementById('dbttn');
const leftButton = document.getElementById('lbttn');
const rightButton = document.getElementById('rbttn');

upButton.addEventListener('mousedown', () => {      //for up arrow key (ubttn) 
    if (gameReady) {
        upPressed = true;
    }
});
upButton.addEventListener('mouseup', () => {
    upPressed = false;
});

downButton.addEventListener('mousedown', () => {     //for down arrow key (dbttn) 
    downPressed = true;
});
downButton.addEventListener('mouseup', () => {
    downPressed = false;
});

leftButton.addEventListener('mousedown', () => {      //for left arrow key (lbttn) 
    leftPressed = true; 
});
leftButton.addEventListener('mouseup', () => {
    leftPressed = false;
});

rightButton.addEventListener('mousedown', () => {      //for right arrow key (rbttn) 
    rightPressed = true;
});
rightButton.addEventListener('mouseup', () => {
    rightPressed = false;
});


setInterval(function() {
    if (gameOver || !gameReady) return;

    if (!hitAnimationActive) {
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
    }

    checkEnemyCollision();
    // moveEnemies();

}, 10);

// setInterval(movePlayer, 10);

// to identify collision with walls 
function checkWallCollisionForPlayer(direction) {
    const playerRect = player.getBoundingClientRect();
    const walls = document.getElementsByClassName("wall");

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


// To collect points and update score
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
            point.classList.remove("point"); 
            score += 10;
            document.getElementsByClassName("score")[0].getElementsByTagName("p")[0].textContent = score;
            checkWinCondition();
        }
    });
}

// To detect key presses
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(event) {
    if (!gameReady) return;

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
    if (!gameReady) return;

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

//------------------------------------------------- Modified code for all enemies fuctions

// To move enemies
function moveEnemies() {
    if (gameOver || !gameStarted) return;

    const enemies = document.getElementsByClassName('enemy');
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const directions = [0, 1, 2, 3]; // up, down, left, right
        let newTop = parseInt(enemy.style.top) || 0;
        let newLeft = parseInt(enemy.style.left) || 0;
    
        let moved = false;
        while (directions.length > 0 && !moved) {
            const randomIndex = Math.floor(Math.random() * directions.length);
            const direction = directions.splice(randomIndex, 1)[0];
    
            switch (direction) {
                case 0: // up
                    if (!checkWallCollisionForEnemy(enemy, 'up')) {
                        newTop -= 60;
                        moved = true;
                    }
                    break;
                case 1: // down
                    if (!checkWallCollisionForEnemy(enemy, 'down')) {
                        newTop += 60;
                        moved = true;
                    }
                    break;
                case 2: // left
                    if (!checkWallCollisionForEnemy(enemy, 'left')) {
                        newLeft -= 60;
                        moved = true;
                    }
                    break;
                case 3: // right
                    if (!checkWallCollisionForEnemy(enemy, 'right')) {
                        newLeft += 60;
                        moved = true;
                    }
                    break;
            }
        }
    
        if (moved) {
            enemy.style.top = newTop + 'px';
            enemy.style.left = newLeft + 'px';
        }
    }
}


// Variables to track collision cooldown and lives
let collisionCooldown = false;
let lives = 3;
let hitAnimationActive = false;

// To check collision with enemies
function checkEnemyCollision() {
    if (gameOver || collisionCooldown) return;

    const playerRect = player.getBoundingClientRect();
    const enemies = document.getElementsByClassName('enemy');

    for (let enemy of enemies) {
        const enemyRect = enemy.getBoundingClientRect();

        if (playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top &&
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left) {
            console.log("enemy detected");

            // To display hit animation and prevent movement for 1.5 seconds
            player.classList.add('hit');
            hitMusic.play();
            hitAnimationActive = true;

            // Stop hit sound after 1.5 seconds
            setTimeout(() => {
                hitMusic.pause();
                hitMusic.currentTime = 0;
            }, 1500);

            setTimeout(() => {
                player.classList.remove('hit');
                console.log("hit animation over");
                hitAnimationActive = false;

                const livesList = document.getElementsByClassName('lives')[0].getElementsByTagName('ul')[0];
                if (livesList.children.length > 0) {
                    livesList.removeChild(livesList.children[0]);
                    console.log("life removed");
                }

                lives--;
                if (lives <= 0) {
                    handleGameOver();
                    console.log("game over");
                }

                // Set a longer cooldown of 4 seconds
                setTimeout(() => {
                    collisionCooldown = false;
                }, 4000);

            }, 1500);

            collisionCooldown = true;
            return true; // Exit the loop after handling one collision
        }
    }

    return false;
}

setInterval(checkEnemyCollision,10);


// To check collision with walls for enemies
function checkWallCollisionForEnemy(enemy, direction) {
    const enemyRect = enemy.getBoundingClientRect();
    const walls = document.getElementsByClassName("wall");

    for (let wall of walls) {
        const wallRect = wall.getBoundingClientRect();

        if (direction === 'up' && enemyRect.top - 60 < wallRect.bottom && enemyRect.bottom > wallRect.top && enemyRect.left < wallRect.right && enemyRect.right > wallRect.left) {
            return true;
        } else if (direction === 'down' && enemyRect.bottom + 60 > wallRect.top && enemyRect.top < wallRect.bottom && enemyRect.left < wallRect.right && enemyRect.right > wallRect.left) {
            return true;
        } else if (direction === 'left' && enemyRect.left - 60 < wallRect.right && enemyRect.right > wallRect.left && enemyRect.top < wallRect.bottom && enemyRect.bottom > wallRect.top) {
            return true;
        } else if (direction === 'right' && enemyRect.right + 60 > wallRect.left && enemyRect.left < wallRect.right && enemyRect.top < wallRect.bottom && enemyRect.bottom > wallRect.top) {
            return true;
        }
    }

    return false;
}

//---------------------------------------------------------------Game logic

// To handle game over
function handleGameOver() {
    gameOver = true;
    clearInterval(enemyMovementInterval);
    console.log("dead animation starts"); 
    player.classList.add('dead');
    deadMusic.play();

    player.addEventListener('animationend', function onAnimationEnd() {
        console.log("Animation ended, displaying reset button");
        player.removeEventListener('animationend', onAnimationEnd);

        // Prompt the player to enter their name
        const playerName = prompt(`Game Over! Your score is ${score}. Enter your name to register in the leaderboard:`, "Unknown Player");
        saveScore(playerName || "Unknown Player", score);

        // to display reset button
        const resetButton = document.createElement('button');
        resetButton.innerText = 'Restart Game';
        resetButton.style.position = 'absolute';
        resetButton.style.top = '50%';
        resetButton.style.left = '50%';
        resetButton.style.transform = 'translate(-50%, -50%)';
        resetButton.style.padding = '10px 20px';
        resetButton.style.fontSize = '16px';

        document.body.appendChild(resetButton);

        resetButton.addEventListener('click', function() {
            location.reload();
        });

        updateLeaderboard();
    });
}

//   To check win condition
function checkWinCondition() {
    const points = document.querySelectorAll('.point');
    if (points.length === 0) {
        const playerName = prompt(`You Win! Your score is ${score}. Enter your name to register in the leaderboard:`, "Unknown Player");
        saveScore(playerName || "Unknown Player", score);
        alert("You Win!");
        // to reload the page or reset the game state
        location.reload();
    }
}

// To save the score in the local storage
function saveScore(name, score) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const existingEntry = leaderboard.find(entry => entry.name === name);

    if (existingEntry) {
        if (score > existingEntry.score) {
            existingEntry.score = score;
        }
    } else {
        leaderboard.push({ name, score });
    }

    leaderboard.sort((a, b) => b.score - a.score); // Sort by score in descending order
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// To update the leaderboard
function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardElements = document.getElementsByClassName('leaderboard')[0].getElementsByTagName('ol');
    
    const leaderboardElement = leaderboardElements[0];
    leaderboardElement.innerHTML = ''; // Clear existing leaderboard

    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}........${entry.score}`;
        leaderboardElement.appendChild(li);
    });
}

//To Call updateLeaderboard when the page loads
document.addEventListener('DOMContentLoaded', updateLeaderboard);

// -----------------------------------------------------------------for reset icon

// To create the reset icon
const resetIcon = document.createElement('div');
resetIcon.id = 'resetIcon';
resetIcon.innerHTML = '&#x21bb;'; // html code for the reset icon

// Styling for the reset icon
resetIcon.style.fontSize = '30px';
resetIcon.style.cursor = 'pointer';
resetIcon.style.backgroundColor = 'black';
resetIcon.style.padding = '10px 0px 0px 0px';
resetIcon.style.borderRadius = '5px';
resetIcon.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)';
resetIcon.style.transition = 'background-color 0.3s';
resetIcon.style.display = 'inline-block';
resetIcon.style.marginTop = '10px';
resetIcon.style.height = '15px';  // !later to be modified


//to add hover effect
// resetIcon.addEventListener('mouseenter', () => {
//     resetIcon.style.backgroundColor = '#e0e0e0';
// });
// resetIcon.addEventListener('mouseleave', () => {
//     resetIcon.style.backgroundColor = '#f0f0f0';
// });


// To append the reset icon below the score
const scoreContainer = document.getElementsByClassName('score')[0];
scoreContainer.appendChild(resetIcon);

// To reset the game when the reset icon is clicked
resetIcon.addEventListener('click', () => {
    // Clear the leaderboard
    localStorage.removeItem('leaderboard');

    location.reload();
});

//----------------------------------------------------------for pause icon

// Create the pause icon
const pauseIcon = document.createElement('div');
pauseIcon.id = 'pauseIcon';
pauseIcon.innerHTML = '&#10074;&#10074;'; // HTML code for the pause icon

// Styling for the pause icon
pauseIcon.style.fontSize = '30px';
pauseIcon.style.cursor = 'pointer';
pauseIcon.style.backgroundColor = 'black';
pauseIcon.style.padding = '10px 10px 0px 0px';
pauseIcon.style.borderRadius = '5px';
pauseIcon.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)';
pauseIcon.style.transition = 'background-color 0.3s';
pauseIcon.style.display = 'inline-block';
pauseIcon.style.marginTop = '10px';
pauseIcon.style.height = '15px';  // !later to be modified
pauseIcon.style.marginRight = '10px'; // Add margin to the right to separate from reset icon

// Append the pause icon to the score container
scoreContainer.insertBefore(pauseIcon, resetIcon);

// Add event listener to pause the game when the pause icon is clicked
pauseIcon.addEventListener('click', () => {
    if (gameStarted) {
        clearInterval(enemyMovementInterval);
        gameStarted = false;
        pauseIcon.innerHTML = '&#9654;'; // Change to play icon
    } else {
        enemyMovementInterval = setInterval(moveEnemies, 2000);
        gameStarted = true;
        pauseIcon.innerHTML = '&#10074;&#10074;'; // Change back to pause icon
    }
});

// -----------------------------------------------------------------------for mute icon

// Create the mute icon
const muteIcon = document.createElement('div');
muteIcon.id = 'muteIcon';
muteIcon.innerHTML = '&#128263;'; // HTML code for the mute icon

// Styling for the mute icon
muteIcon.style.fontSize = '30px';
muteIcon.style.cursor = 'pointer';
muteIcon.style.backgroundColor = 'black';
muteIcon.style.padding = '10px 0px 0px 10px';
muteIcon.style.borderRadius = '5px';
muteIcon.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)';
muteIcon.style.transition = 'background-color 0.3s';
muteIcon.style.display = 'inline-block';
muteIcon.style.marginTop = '10px';
muteIcon.style.height = '15px';  // !later to be modified
muteIcon.style.marginRight = '10px'; // Add margin to the right to separate from other icons

// Append the mute icon to the score container, just to the right of the reset icon
scoreContainer.insertBefore(muteIcon, resetIcon.nextSibling);

// Add event listener to mute/unmute the game when the mute icon is clicked
let isMuted = false;
muteIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
        startMusic.muted = true;
        hitMusic.muted = true;
        deadMusic.muted = true;
        muteIcon.innerHTML = '&#128264;'; // Change to unmute icon
    } else {
        startMusic.muted = false;
        hitMusic.muted = false;
        deadMusic.muted = false;
        muteIcon.innerHTML = '&#128263;'; // Change back to mute icon
    }
});

document.addEventListener('DOMContentLoaded', () => {
});

// ---------------------------------------------------------------------- for music

// Create audio elements dynamically
const startMusic = new Audio('music/pacman_beginning.wav');
const hitMusic = new Audio('music/pacman_collision.wav');
const deadMusic = new Audio('music/pacman_dead.wav');

// Set the volume if needed
// startSound.volume = 0.5;
// hitSound.volume = 0.5;
// deadSound.volume = 0.5;






