
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

document.body.parentElement.style.padding = '0';
document.body.parentElement.style.margin = '0';
document.body.parentElement.style.overflow = 'hidden';
document.body.style.padding = '0';
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

const context = canvas.getContext('2d');

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const redraw = () => {
    const now = Date.now() / 10;

    const TIMEVALUE = Math.cos(now / 93) * 20;
    const XBASEMULT = Math.cos(now / 71 + 31) * 23 + 100;
    const YBASEMULT = Math.cos(now / 31 + 47) * 7 + 25;
    const YSECONDMULT = Math.cos(now / 59 + 29) * 13 + 30;
    const YTHIRDMULT = Math.cos(now / 73 + 7) * 5 + 45;
    
    const getAltitude = (x, y) => {
        const distanceFromCenterX = x * x; // 0 .. 1
        const distanceFromCenterY = y * y; // 0 .. 1
        const distanceMultiplier = ((1 - distanceFromCenterX) * (1 - distanceFromCenterX)) * (1 - distanceFromCenterY);
    
        const value = (Math.sin(x * (XBASEMULT + Math.cos(y * YBASEMULT) * YSECONDMULT + (x + y) * TIMEVALUE) + y * YTHIRDMULT) + 1) / 2;
        //const noise = (Math.random() - 0.5) * 0.2;
    
        return value * distanceMultiplier;
    };
    
    context.clearRect(0, 0, WIDTH, HEIGHT);

    const tops = new Array(WIDTH);
    tops.fill(HEIGHT);

    context.beginPath();
    for (let y = HEIGHT - 10; y >= 100; y -= 10) {
        let lastY = y;
        context.moveTo(0, lastY);
        let lastX = 0;
        for (let nextX = randomInt(1, 5); nextX < WIDTH; nextX += randomInt(Math.max(WIDTH/1000, 2), WIDTH / 50)) {
            const altitude = getAltitude((nextX - WIDTH / 2) / (WIDTH / 2), (y - HEIGHT / 2) / (HEIGHT / 2));
            const yOffset = altitude * HEIGHT / 30;
            let targetY = y - yOffset;
            for (let x = lastX; x < nextX; ++x) {
                let nextY = lastY + (x - lastX) * (targetY - lastY) / (nextX - lastX);
                if (nextY > tops[x]) nextY = tops[x]; else tops[x] = nextY;
                context.lineTo(x, nextY);
            }
            lastX = nextX;
            lastY = targetY;
        }
        context.lineTo(WIDTH, y);
    }

    context.strokeStyle = '#000000';
    context.stroke();
};

const makeAnimator = (func, conditionFunc) => {
    let animator = (time) => {
        if (!conditionFunc || conditionFunc()) {
            func(time);
        }
        window.requestAnimationFrame(animator);
    };
    return animator;
};

let mouseIsDown = false;

const redrawAnimation = makeAnimator(redraw, () => !mouseIsDown);

redrawAnimation(0);

window.addEventListener('mousedown', () => mouseIsDown = true);
window.addEventListener('mouseup', () => mouseIsDown = false);
