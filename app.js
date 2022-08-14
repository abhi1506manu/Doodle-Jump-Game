document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50;
    let startPoint = 150
    let doodlerbottomSpace = startPoint;
    let isGameOver = false;
    let plateformCount = 5;
    let plateforms = [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let score = 0;


    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = plateforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerbottomSpace + 'px'
    }

    // createDoodler();

    class Plateform {
        constructor(newPlateBottom) {
            this.bottom = newPlateBottom
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('plateform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)



        }
    }

    function createPlateforms() {
        for (let i = 0; i < plateformCount; i++) {
            let platGap = 600 / plateformCount;
            let newPlateBottom = 100 + i * platGap;
            let newPlateform = new Plateform(newPlateBottom)
            plateforms.push(newPlateform)
            // console.log(plateforms)
        }

    }

    function movePlateforms() {
        if (doodlerbottomSpace > 200) {
            plateforms.forEach(plateform => {
                plateform.bottom -= 4;
                let visual = plateform.visual
                visual.style.bottom = plateform.bottom + 'px';

                if (plateform.bottom < 10) {
                    let firstPlateform = plateforms[0].visual;
                    firstPlateform.classList.remove('plateform')
                    plateforms.shift()
                    score++;
                    console.log(plateforms)
                    let newPlateform = new Plateform(600)
                    plateforms.push(newPlateform)
                }

            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true;
        upTimerId = setInterval(function () {
            doodlerbottomSpace += 20;
            doodler.style.bottom = doodlerbottomSpace + 'px'
            if (doodlerbottomSpace > startPoint + 200) {
                fall();
            }
        }, 30)

    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false;
        downTimerId = setInterval(function () {
            doodlerbottomSpace -= 5;
            doodler.style.bottom = doodlerbottomSpace + 'px';
            if (doodlerbottomSpace <= 0) {
                gameOver();
            }
            plateforms.forEach(plateform => {
                if (
                    (doodlerbottomSpace >= plateform.bottom) &&
                    (doodlerbottomSpace <= plateform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= plateform.left) &&
                    (doodlerLeftSpace <= (plateform.left + 85)) &&
                    !isJumping
                ) {
                    // console.log('landed')
                    startPoint = doodlerbottomSpace;
                    jump();
                }
            })
        }, 30)
    }

    function gameOver() {
        console.log('game over')
        isGameOver = true;
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e) {
        if (e.key === 'ArrowLeft') {
            moveLeft();
        }
        else if (e.key === 'ArrowRight') {
            //move right
            moveRight()
        }
        else if (e.key === 'ArrowUp') {
            //Move up
            moveStraight()
        }
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px'
            } else {
                moveRight();
            }

        }, 30)

    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(function () {
            if (doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px';
            } else {
                moveLeft();
            }
        }, 30)
    }

    function moveStraight() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }



    function start() {
        if (!isGameOver) {
            createPlateforms()
            createDoodler()
            movePlateforms()
            setInterval(movePlateforms, 30)
            jump()
            document.addEventListener('keyup', control);
        }
    }

    start();



})