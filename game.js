const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

let map = [
    [1,1,1,1,1 ,1,1,1,1,1 ,1,1,1,1,1 ,1,1,1,1,1, 1],
    [1,2,2,2,2 ,2,2,2,2,2 ,1,2,2,2,2 ,2,2,2,2,2, 1],
    [1,2,1,1,1 ,2,1,1,1,2 ,1,2,1,1,1 ,2,1,1,1,2, 1],
    [1,2,1,1,1 ,2,1,1,1,2 ,1,2,1,1,1 ,2,1,1,1,2, 1],
    [1,2,2,2,2 ,2,2,2,2,2 ,2,2,2,2,2 ,2,2,2,2,2, 1],
    [1,2,1,1,1 ,2,1,2,1,1 ,1,1,1,2,1 ,2,1,1,1,2, 1],
    [1,2,2,2,2 ,2,1,2,2,2 ,1,2,2,2,1 ,2,2,2,2,2, 1],
    [1,1,1,1,1 ,2,1,1,1,2 ,1,2,1,1,1 ,2,1,1,1,1, 1],
    [0,0,0,0,1 ,2,1,2,2,2 ,2,2,2,2,1 ,2,1,0,0,0, 0],
    [1,1,1,1,1 ,2,1,2,1,1 ,2,1,1,2,1 ,2,1,1,1,1, 1],
    [1,2,2,2,2 ,2,2,2,1,2 ,2,2,1,2,2 ,2,2,2,2,2, 1],
    [1,1,1,1,1 ,2,1,2,1,2 ,2,2,1,2,1 ,2,1,1,1,1, 1],
    [0,0,0,0,1 ,2,1,2,1,1 ,1,1,1,2,1 ,2,1,0,0,0, 0],
    [0,0,0,0,1 ,2,1,2,2,2 ,2,2,2,2,1 ,2,1,0,0,0, 0],
    [1,1,1,1,1 ,2,2,2,1,1 ,1,1,1,2,2 ,2,1,1,1,1, 1],
    [1,2,2,2,2 ,2,2,2,2,2 ,1,2,2,2,2 ,2,2,2,2,2, 1],
    [1,2,1,1,1 ,2,1,1,1,2 ,1,2,1,1,1 ,2,1,1,1,2, 1],
    [1,2,2,2,1 ,2,2,2,2,2 ,2,2,2,2,2 ,2,1,2,2,2, 1],
    [1,1,2,2,1 ,2,1,2,1,1 ,1,1,1,2,1 ,2,1,2,2,1, 1],
    [1,2,2,2,2 ,2,1,2,2,2 ,1,2,2,2,1 ,2,2,2,2,2, 1],
    [1,2,1,1,1 ,1,1,1,1,2 ,1,2,1,1,1 ,1,1,1,1,2, 1],
    [1,2,2,2,2 ,2,2,2,2,2 ,2,2,2,2,2 ,2,2,2,2,2, 1],
    [1,1,1,1,1 ,1,1,1,1,1 ,1,1,1,1,1 ,1,1,1,1,1, 1],
];

let fps = 30;
let oneBlockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize/1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth)/2;
let wallInnerColor = "black";
let pacman;
let foodColor = "#FEB897";
let score = 0; 
let ghosts = [];
let ghostLocation = [
    {x: 0,y: 0},
    {x: 176,y: 0},
    {x: 0,y: 121},
    {x: 176,y: 121}
];
let randomTargetsForGhosts = [
    {x: 1*oneBlockSize,y: 1*oneBlockSize},
    {x: 1*oneBlockSize,y: (map.length-2)*oneBlockSize},
    {x: (map[0].length - 2)*oneBlockSize,y: oneBlockSize},
    {x: (map[0].length-2)*oneBlockSize,y: (map.length-2)*oneBlockSize},
];
let lives = 3;
let foodCount = 0;

for(let i=0;i< map.length;i++) {
    for(let j=0;j<map[0].length;j++) {
        if(map[i][j] == 2) {
            foodCount++;
        }
    }
}

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

let gameLoop = () => {
    draw();
    update();
};

let update = () => {
    pacman.moveProcess();
    pacman.eat();
    for(let i=0;i<ghosts.length;i++) {
        ghosts[i].moveProcess();
    }
    if(pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
    }
    if(score >= foodCount) {
        drawWin();
    }
};

let drawWin = () => {
    canvasContext.font = "60px VT323";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("You a Winner!", 100, 200);

    clearInterval(gameInterval);
}

let onGhostCollision = () => {
    lives--;
    restartGame();
    if(lives == 0) {
        gameOver();
    }
};

let restartGame = () => {
    createNewPacman();
    createGhosts();
};

let gameOver = () => {
    drawGameOver();
    clearInterval(gameInterval);
}

let drawGameOver = () => {
    canvasContext.font = "60px VT323";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("GAME OVER!", 100, 200);
}

let drawLives = () => {
    canvasContext.font = "30px VT323";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("LIVES: ", 0, oneBlockSize*(map.length+1)+10);
    for(let i=0;i<lives;i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2*oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            75+i*oneBlockSize,
            oneBlockSize*map.length+11,
            oneBlockSize,
            oneBlockSize,
            oneBlockSize
        )
    }
}

let drawScore = () => {
    canvasContext.font = "30px VT323";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("SCORE: " + score, 200, oneBlockSize*(map.length+1)+10);
};

let drawFoods = () => {
    for(let i=0;i< map.length;i++) {
        for(let j=0;j<map[0].length;j++) {
            if( map[i][j] == 2) {
                createRect(
                    j*oneBlockSize+oneBlockSize/3,
                    i*oneBlockSize+oneBlockSize/3,
                    oneBlockSize/3,
                    oneBlockSize/3,
                    foodColor
                )
            }
        }
    }
}

let drawGhosts = () => {
    for(let i=0;i<ghosts.length;i++) {
        ghosts[i].draw();
    }
}

let draw = () => {
    createRect(0, 0, canvas.width, canvas.height, "black")
    drawWalls();
    drawFoods();
    pacman.draw();
    drawLives();
    drawScore();
    drawGhosts();
};

let gameInterval = setInterval(gameLoop, 1000/fps);

let drawWalls = () => {
    for(let i=0;i<map.length;i++) {
        for(let j=0;j<map[0].length;j++) {
            if(map[i][j] == 1) {
                createRect(
                    j*oneBlockSize,
                    i*oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                );
                
                if(j>0 && map[i][j-1] == 1) {
                    createRect(
                        j*oneBlockSize,
                        i*oneBlockSize+wallOffset,
                        wallSpaceWidth+wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if(j<map[0].length-1 && map[i][j+1] == 1) {
                    createRect(
                        j*oneBlockSize+wallOffset,
                        i*oneBlockSize+wallOffset,
                        wallSpaceWidth+wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if(i<map.length-1 && map[i+1][j] == 1) {
                    createRect(
                        j*oneBlockSize+wallOffset,
                        i*oneBlockSize+wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth+wallOffset,
                        wallInnerColor
                    );
                }
                if(i>0 && map[i-1][j] == 1) {
                    createRect(
                        j*oneBlockSize+wallOffset,
                        i*oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth+wallOffset,
                        wallInnerColor
                    );
                }
                
            }
        }
    }
};

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize/5
    );
};

let createGhosts = () => {
    ghosts = [];
    for(let i=0;i<4;i++) {
        let ghost = new Ghost(
            9*oneBlockSize+(i%2==0?0:1)*oneBlockSize,
            10*oneBlockSize+(i%2==0?0:1)*oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed/2,
            ghostLocation[i%4].x,
            ghostLocation[i%4].y,
            124,
            116,
            6+1
        );
        ghosts[i] = ghost;
    }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if(k == 65) {//left
            pacman.nextDirection = DIRECTION_LEFT;
        }else if(k == 87){ //up
            pacman.nextDirection = DIRECTION_UP;
        }else if(k == 68) {//right
            pacman.nextDirection = DIRECTION_RIGHT;
        }else if(k == 83) {//bottom
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    },1);
})