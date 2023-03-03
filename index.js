// Simulate 2D physics in JavaScript


// Simulate object position in world space
var x = 50;
var y = 50;
var localX = 0;
var localY = 0;


// Simulate a wall in world space
var wall = {
    x: 100,
    y: 100,
    width: 100,
    height: 100
};

function wallCheck (_x, _y) {
    // Check if the object will collide with a wall
    if (x >= wall.x && x <= wall.x + wall.width) {
        if (y >= wall.y && y <= wall.y + wall.height) {
            // Wall is in the way of future position
            return false;
        }
    }
    return true;
}

var falling = false;
function move (_x, _y, _peak, _gravity) {
    // Return if the objects future position will collide with a wall
    if (!wallCheck(x + _x, y + _y)) return;

    // Move the object and update the position in world space
    x += _x;
    localX += _x;

    // Check if the object is at its peak
    if (y >= _peak) {
        if (falling) return;
        falling = true;
    }

    // Check if the object is falling
    if (falling) {
        // Move the object down
        y -= _gravity;
        localY -= _gravity;
    } else {
        // Move the object up
        y += _y;
        localY += _y;
    }

    console.log(`World Position: (${x}, ${y})`);
    console.log(`Local Position: (${localX}, ${localY})`);
    return {x, y};
};

// Calculate the velocity of an object
function getVelocity (old_x, old_y, new_x, new_y, time) {
    const xDistance = new_x - old_x;
    const yDistance = new_y - old_y;
    const Xvelocity = xDistance / time;
    const Yvelocity = yDistance / time;
    return {Xvelocity, Yvelocity};
}

// Apply a force to an object over time
function force (_x, _y, _time, _peak, _gravity) {
    // Check if time is 0 and if it is, move the object instantly
    if (_time === 0) {
        move(_x, _y);
        return;
    }
    const interval = setInterval(() => {
        // Get current position
        const currentPosition = {x, y};

        // Move the object
        move(_x, _y, _peak, _gravity);

        // Calculate the velocity of the object
        const {Xvelocity, Yvelocity} = getVelocity(currentPosition.x, currentPosition.y, x, y, _time);

        // Check if velocity is 0 and if it is, stop the interval
        if (Xvelocity === 0 && Yvelocity === 0) {
            console.log('The object has reached its destination, got stuck or has hit a wall.');
            falling = false;
            clearInterval(interval);
        } else {
            console.log(`X Velocity: ${Xvelocity}, Y Velocity: ${Yvelocity}`);
        }

        if (localY <= 0) {  
            console.log('The object has reached its destination, got stuck or has hit a wall.');
            falling = false;
            clearInterval(interval);
        }

    }, _time);
}

force(0.25, 0.25, 10, 75, 0.5);