class Ghost {
    constructor(x,y,width,height, speed, imgX, imgY, imgWidth, imgHeight, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 4;
        this.currentFrame = 1;
        this.frameCount = 7;
        this.nextDirection = 4;
        this.imgX = imgX;
        this.imgY = imgY;
        this.imgWidth = imgWidth;
        this.imgHeight = imgHeight;
        this.range = range;
        this.randomTargeIndex = parseInt(Math.random() * randomTargetsForGhosts.length);

        setInterval(() => {
            this.changeRandomDirection()
        }, 10000)
    }

    changeRandomDirection() {
        this.randomTargeIndex += 1;
        this.randomTargeIndex = this.randomTargeIndex%4;
    }

    moveProcess() {
        if(this.isInRangeOfPacman()){
            this.target = pacman;
        }else {
            this.target = randomTargetsForGhosts[this.randomTargeIndex];
        }
        this.changeDirectionPossible();
        this.moveForwards();
        if(this.checkCollision()) {
            this.moveBackwards();
            return;
        }
    }

    moveBackwards() {
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x -= this.speed;
                break;
            case DIRECTION_UP:
                this.y += this.speed;
                break;
            case DIRECTION_LEFT:
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x += this.speed;
                break;
            case DIRECTION_UP:
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y += this.speed;
                break;
        }
    }

    checkCollision() {
        let isCollided = false;
        if (
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1
        ) {
            isCollided = true;
        }
        return isCollided;
    }

    checkGhostCollision() {
        
    }

    isInRangeOfPacman() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if(Math.sqrt(xDistance*xDistance+yDistance*yDistance) <= this.range){
            return true;
        }

        return false;
    }

    changeDirectionPossible() {
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection(
            map, 
            parseInt(this.target.x/oneBlockSize),
            parseInt(this.target.y/oneBlockSize)
        );

        if(typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        this.moveForwards();
        if(this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempDirection;
        }else {
            this.moveBackwards();
        }
    }

    calculateNewDirection(map, destX, destY) {
        let mp = [];
        for(let i=0;i < map.length;i++) {
            mp[i] = map[i].slice();
        }

        let queue = [{
            x: this.getMapX(),
            y: this.getMapY(),
            moves: [],
        }];

        while(queue.length > 0) {
            let poped = queue.shift();
            if(poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            }else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp);
                for(let i=0;i<neighborList.length;i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return DIRECTION_UP;
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;
        if(poped.x-1 >= 0 && poped.x-1 < numOfRows && mp[poped.y][poped.x-1] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({x: poped.x-1, y:poped.y, moves: tempMoves });
        } 
        if(poped.x+1 >= 0 && poped.x+1 < numOfRows && mp[poped.y][poped.x+1] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({x: poped.x+1, y:poped.y, moves: tempMoves });
        } 
        if(poped.y-1 >= 0 && poped.y-1 < numOfRows && mp[poped.y-1][poped.x] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({x: poped.x, y:poped.y-1, moves: tempMoves });
        } 
        if(poped.y+1 >= 0 && poped.y+1 < numOfRows && mp[poped.y+1][poped.x] != 1) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({x: poped.x, y:poped.y+1, moves: tempMoves });
        } 

        return queue;
    }

    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1:this.currentFrame+1;
    }

    draw() {
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames, 
            this.imgX, 
            this.imgY, 
            this.imgWidth, 
            this.imgHeight,
            this.x,
            this.y,
            this.width,
            this.height);
        canvasContext.restore();
    }

    getMapX() {
        return parseInt(this.x/oneBlockSize);
    }

    getMapY() {
        return parseInt(this.y/oneBlockSize);
    }

    getMapXRightSide() {
        return parseInt((this.x+0.9999+oneBlockSize)/oneBlockSize);
    }

    getMapYRightSide() {
        return parseInt((this.y+0.9999+oneBlockSize)/oneBlockSize);
    }
}