// 1. Grab the container and the button from the DOM
const box = document.getElementById('box'); //[cite: 2, 3]
const addOrbBtn = document.querySelector('.addButton');
const topMenu = document.getElementById('top-menu');
const NewBall = document.getElementById('addNewBall')


NewBall.addEventListener('click', () => {
   
    const ballWrapper = document.createElement('div');
    ballWrapper.classList.add('topBall');

    ballWrapper.innerHTML = `
        <div class="ballPreview"></div>
        <div class="addSubtract">
            <button class="addButton">+</button> 
            <span class="ballCount">1</span> 
            <button class="subtractButton">-</button>  
        </div>
    `;


    topMenu.appendChild(ballWrapper);
    
    console.log('ball controls added');
});

// 2. Add an event listener to spawn a ball when clicked
addOrbBtn.addEventListener('click', () => {
    
    // Dynamically calculate actual box dimensions in pixels (handling 'em' units)
    const boxWidth = box.clientWidth;
    const boxHeight = box.clientHeight;

    // Create the ball element dynamically and add it to the box
    const ball = document.createElement('div'); //[cite: 2]
    ball.classList.add('ball'); //[cite: 2]
    box.appendChild(ball); //[cite: 2]

    // Set up the ball's initial state
    const ballSize = 30; //
    let posX = Math.random() * (boxWidth - ballSize);  // Random starting X[cite: 2]
    let posY = Math.random() * (boxHeight - ballSize); // Random starting Y[cite: 2]
    
    // Speed/Velocity - Adding slight randomness so multiple balls don't clump together
    let dx = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2); 
    let dy = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2); 

    // The animation loop for this specific ball
    function moveBall() {
        // Update the position variables
        posX += dx; //[cite: 2]
        posY += dy; //[cite: 2]

        // Check for horizontal collisions (left or right walls)
        if (posX <= 0 || posX >= (boxWidth - ballSize)) { //[cite: 2]
            dx = -dx; // Reverse horizontal direction[cite: 2]
            posX = Math.max(0, Math.min(posX, boxWidth - ballSize)); // Anti-clipping fix[cite: 2]
        }

        // Check for vertical collisions (top or bottom walls)
        if (posY <= 0 || posY >= (boxHeight - ballSize)) { //[cite: 2]
            dy = -dy; // Reverse vertical direction[cite: 2]
            posY = Math.max(0, Math.min(posY, boxHeight - ballSize)); // Anti-clipping fix[cite: 2]
        }

        // Apply the new positions to the ball's CSS style
        ball.style.left = posX + 'px'; //[cite: 2]
        ball.style.top = posY + 'px'; //[cite: 2]

        // Call the next frame of the animation
        requestAnimationFrame(moveBall); //[cite: 2]
    }

    // Kick off the animation for this ball
    requestAnimationFrame(moveBall); //[cite: 2]
});