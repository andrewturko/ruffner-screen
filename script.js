const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;
const scaleFactor = 1.5;  // Scaling factor to make the clock 150% larger

// set the start point of the hour, minute and second hand to top
const threePIByTwo = (3 * Math.PI) / 2;

let amOrPm = 'AM';

const canvasBg = '#000000';

// Define colors for hour, minute and second hand
const hourActiveColor = '#39D98A',
      minuteActiveColor = '#3E7BFA',
      secondActiveColor = '#FDAC42';

// Define inactive colors for hour, minute and second hand
const hourInactiveColor = '#3C4043',
      minuteInactiveColor = '#2E3134',
      secondInactiveColor = '#282A2D';

const timerBg = '#282A2D';

function init() {
    canvas.width = (document.documentElement.clientWidth - 35) * dpr;
    canvas.height = (document.documentElement.clientHeight - 45) * dpr;
    canvas.style.width = `${document.documentElement.clientWidth - 35}px`;
    canvas.style.height = `${document.documentElement.clientHeight - 45}px`;
    ctx.scale(dpr, dpr);

    // This calls the draw function repeatedly at a rate of 60 times per second
    window.requestAnimationFrame(draw);    
}

function draw() {
    // Finding center point of canvas
    const centerX = (canvas.width / dpr) / 2,
          centerY = (canvas.height / dpr) / 2;

    const date = new Date();

    let hr = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    let ms = date.getMilliseconds();

    if (hr > 12) {
        amOrPm = 'PM';
        hr -= 12;
    }

    /* Defines how much radians each hand should move */
    let radH = 0.000008333 * ((hr * 60 * 60 * 1000) + (min * 60 * 1000) + (sec * 1000) + ms);
    let radM = 0.0001 * ((min * 60 * 1000) + (sec * 1000) + ms);
    let radS = 0.006 * ((sec * 1000) + ms);

    // Draw Canvas
    drawRect(0, 0, canvas.width / dpr, canvas.height / dpr, canvasBg);

    // Hour Hand
    drawCircle(centerX, centerY, 110 * scaleFactor, 0, 360, false, hourInactiveColor, 'stroke', 90 * scaleFactor);
    drawCircle(centerX, centerY, 110 * scaleFactor, threePIByTwo, rad(radH) + threePIByTwo, false, hourActiveColor, 'stroke', 90 * scaleFactor);

    // Minute Hand
    drawCircle(centerX, centerY, 180 * scaleFactor, 0, 360, false, minuteInactiveColor, 'stroke', 50 * scaleFactor);
    drawCircle(centerX, centerY, 180 * scaleFactor, threePIByTwo, rad(radM) + threePIByTwo, false, minuteActiveColor, 'stroke', 50 * scaleFactor);

    // Second Hand
    drawCircle(centerX, centerY, 220 * scaleFactor, 0, 360, false, secondInactiveColor, 'stroke', 30 * scaleFactor);
    drawCircle(centerX, centerY, 220 * scaleFactor, threePIByTwo, rad(radS) + threePIByTwo, false, secondActiveColor, 'stroke', 30 * scaleFactor);

    // Digital Timer
    drawCircle(centerX, centerY, 90 * scaleFactor, 0, 360, false, timerBg, 'fill', '50');
    drawText(`${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")} ${amOrPm}`, centerX - 90, centerY + 22.5, '#ffffff', '42px');

    window.requestAnimationFrame(draw);
}

init();

// Convert degree to radians
function rad(deg) {
    return (Math.PI / 180) * deg;
}

function drawText(text, x, y, color, size) {
    ctx.font = `${size} "Poppins"`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawArc(x, y, radius, start, end, clockwise) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, clockwise);
}

function drawCircle(x, y, radius, start, end, clockwise, color, type, thickness) {
    switch (type) {
        case 'fill':
            ctx.fillStyle = color;
            drawArc(x, y, radius, start, end, clockwise);
            ctx.fill();
            break;
        case 'stroke':
            ctx.strokeStyle = color;
            ctx.lineWidth = thickness;
            drawArc(x, y, radius, start, end, clockwise);
            ctx.stroke();
            break;
    }
}
