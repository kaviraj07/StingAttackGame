const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
const windowXsize = window.innerWidth;
const windowYsize = window.innerHeight;

cvs.setAttribute("height", windowYsize);
cvs.setAttribute("width", windowXsize);

let person = new Image();
let bg = new Image();
let wasp = new Image();
let head = new Image();

bg.src = "Sprites/Bg.png";
person.src = "Sprites/mainSprites.png";
wasp.src = "Sprites/waspSpriteSheet.png";
head.src = "Sprites/head.png";

let cutSound = new Audio();
let scoreSound = new Audio();
let bgSound = new Audio();
let overSound = new Audio();

cutSound.src = "Sounds/cut.mp3";
scoreSound.src = "Sounds/kill.mp3";
bgSound.src = "Sounds/danger.wav";
overSound.src = "Sounds/die.wav";

let bX = 150;// person position x
let bY = windowYsize - 450;// person position y
let wX = 0;// wasp position x
let wY = 0;// wasp position y
let personSizeX = 560.2;// person sprite width
let personSizeY = 1047;// person sprite height
let waspSizeX = 85;// wasp sprite width 
let waspSizeY = 90;// wasp sprite height
let score = 0;//score counter
let interval;

let waspSpeed = 5;
let currX = 0;//current X position of person on spritesheet
let currY = 0;//current Y position of person on spritesheet
let state = personSizeX;//used to define the limit to stop in spritesheet
let resizedSpriteWidth = 200;//resize person to appropriate width
let resizedSpriteHeight = 523.5;//resize person to appropriate height


//3 background positions
var bgDrawX1 = 0;
var bgDrawX2 = 1007;
var bgDrawX3 = 2014;

//function to move background for live effect
function moveBg() {
    bgDrawX1 -= 10;
    bgDrawX2 -= 10;
    bgDrawX3 -= 10;

    if (bgDrawX1 <= -1007) {
        bgDrawX1 = 2014;
    }
    else if (bgDrawX2 <= -1007) {
        bgDrawX2 = 2014;
    }
    else if (bgDrawX3 <= -1007) {
        bgDrawX3 = 2014;
    }
}

//function to draw background on canvas
function drawBg() {
    ctx.drawImage(bg, 0, 0, windowXsize, windowYsize, bgDrawX1, 0, windowXsize, windowYsize + 100);
    ctx.drawImage(bg, 0, 0, windowXsize, windowYsize, bgDrawX2, 0, windowXsize, windowYsize + 100);
    ctx.drawImage(bg, 0, 0, windowXsize, windowYsize, bgDrawX3, 0, windowXsize, windowYsize + 100);
}

//this will be used to store all wasp coordinates
let waspCoord = [
    {
        x: cvs.width,
        y: Math.floor(Math.random() * (220) + 10),
        maxX: 0,
        reachedEnd: false,
    },
];

//key and click event listeners
document.addEventListener("keydown", movePerson, false);
document.addEventListener("keyup", stopPerson, false);
document.addEventListener("mousedown", attack, false);
document.addEventListener("mouseup", stopAttack, false);

//function to draw person on canvas
function drawPerson() {
    ctx.drawImage(
        person,//image
        currX,//x position on spritesheet,
        currY,//y position on spritesheet,
        personSizeX,//person width
        personSizeY,//person height
        bX,//X position on canvas
        bY,//Y position on canvas
        resizedSpriteWidth,//Resize sprite Width
        resizedSpriteHeight//Resize sprite Height

    );

    currX += personSizeX;
    if (currX >= state)
        currX = 0;
}

function drawWasp() {
    wX += waspSizeX;
    if (wX > 510) {
        wX = 0;
    }
    for (let i = 0; i < waspCoord.length; i++) {
        let f = waspCoord[i];
        ctx.drawImage(
            wasp,//image 
            wX,//x position on spritesheet,
            wY,//y position on spritesheet,
            waspSizeX, // wasp width
            waspSizeY,// wasp height
            f.x,// X position on canvas
            f.y,// Y position on canvas
            waspSizeX * 2,// Resize sprite Width
            waspSizeY * 2//Resize sprite Height
        );
        //move wasp
        f.x -= waspSpeed;

        //check if wasp is off screen
        if (f.x <= f.maxX) {
            f.reachedEnd = true;
        }
        // Delete wasp if end of screen reached
        if (f.reachedEnd) {
            waspCoord.splice(i, 1);
        }
        //check if wasp is on person
        if (
            (waspCoord[i].x >= bX && waspCoord[i].x <= bX + resizedSpriteWidth - 75)
            && (waspCoord[i].y + waspSizeY >= bY)
        ) {
            //check if attack position is being used
            if (currY == personSizeY * 3) {
                score++;
                scoreSound.play();
                waspCoord.splice(i, 1);
            }
            //any other position: the person dies 
            else {
                bgSound.pause();
                overSound.play();
                clearInterval(interval);
                setTimeout(() => {
                    message();
                    return;
                }, 2000);
            }
        }
    }
    // Create new wasp
    if (Math.floor(Math.random() * 30) == 25) {
        waspCoord.push({
            x: cvs.width,
            y: Math.floor(Math.random() * (220) + 10),
            reachedEnd: false,
        });
    }
}
//function to move Person on canvas with spritesheet
function movePerson(e) {
    // up key
    if (e.keyCode == "38") {
        bY = windowYsize - 650;
        /*
            if (bX <= windowXsize - 200) {
                bX += 50;
            }
        */
        currX += personSizeX;
        currY = personSizeY * 2;
        state = 3361;
        if (currX >= 3361) {
            currX = personSizeX;
        }
    }
    // right key
    else if (e.keyCode == "39") {
        /*
             if (bX <= windowXsize - 200) {
                 bX += 10;
             }
        */
        currX += personSizeX;
        state = 3361;
        //increase wasp speed if right movement occur
        waspSpeed = 35;
        if (currX >= state)
            currX = personSizeX;

        moveBg();
    }
    // left key
    else if (e.keyCode == "37") {
        /*
            if (bX >= 10) {
                bX -= 10;
            }
        */
        currX += personSizeX;
        currY = personSizeY;
        state = 3361;
        if (currX >= state)
            currX = personSizeX;
    }
}

//function to return all required states after action is performed
function stopPerson(e) {
    //release right key
    if (e.keyCode == "39") {
        state = personSizeX;
        currX = 0;
        waspSpeed = 5;
    }
    //release left key
    if (e.keyCode == "37") {
        state = personSizeX;
        currX = 0;
        currY = 0;
        waspSpeed = 5;
    }
    //release up key
    if (e.keyCode == "38") {
        bY = windowYsize - 450;
        state = personSizeX;
        currX = 0;
        currY = 0;
    }
}
//function to handle attacks by Person
function attack(e) {
    //check for left click only
    if (e.button == 0) {
        cutSound.play();
        resizedSpriteWidth = 500;
        personSizeX = 1120.4;
        currX += personSizeX;
        currY = personSizeY * 3;
        state = 3361;
        if (currX >= 3361) {
            currX = 0;
        }
    }
}
function stopAttack() {
    resizedSpriteWidth = 200;
    personSizeX = 560.2;
    currX = 0;
    currY = 0;
    state = personSizeX;
}

//function to draw head at score indicator
function drawHead() {
    ctx.drawImage(
        head,//image 
        0,//x position on spritesheet,
        0,//y position on spritesheet,
        158, // wasp width
        197,// wasp height
        0,// X position on canvas5
        0,// Y position on canvas
        158 / 2,// Resize sprite Width
        197 / 2//Resize sprite Height
    );
}

//main loop starts here
function Start() {
    document.getElementById("menu").style.display = "none";
    bgSound.play();
    bgSound.volume = 0.5;
    bgSound.loop = true;
    interval = setInterval(() => {
        ctx.clearRect(bX, bY, personSizeX, personSizeY);
        drawBg();
        drawWasp();
        drawPerson();
        drawHead();
        // Score indicator
        ctx.fillStyle = "white";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : " + score, 85, 25);
    }, 80);
}

function message() {
    location.href = `GameOver.html?score=${score}`;
    //location.href = "index.html";
}

function reload() {
    location.href = "index.html";
}

function Instruct() {
    location.href = "Instructions.html";
}

function About() {
    location.href = "About.html";
}

