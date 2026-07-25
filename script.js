const box = document.getElementById('box');
const topMenu = document.getElementById('top-menu');
const addNewBallBtn = document.getElementById('addNewBall');

const ballColors = ['#ff4757', '#1e90ff', '#2ed573', '#ffa502', '#ff6b81', '#00b894'];

function spawnBall(color) {
    const boxWidth = box.clientWidth;
    const boxHeight = box.clientHeight;

    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.style.backgroundColor = color;
    box.appendChild(ball);

    const ballSize = 30;
    let posX = Math.random() * Math.max(1, boxWidth - ballSize);
    let posY = Math.random() * Math.max(1, boxHeight - ballSize);

    let dx = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
    let dy = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);

    function moveBall() {
        posX += dx;
        posY += dy;

        if (posX <= 0 || posX >= boxWidth - ballSize) {
            dx = -dx;
            posX = Math.max(0, Math.min(posX, boxWidth - ballSize));
        }

        if (posY <= 0 || posY >= boxHeight - ballSize) {
            dy = -dy;
            posY = Math.max(0, Math.min(posY, boxHeight - ballSize));
        }

        ball.style.left = `${posX}px`;
        ball.style.top = `${posY}px`;

        requestAnimationFrame(moveBall);
    }

    requestAnimationFrame(moveBall);
    return ball;
}

    function createBallControl() {
    const ballWrapper = document.createElement('div');
    ballWrapper.classList.add('topBall');

    const color = ballColors[(topMenu.querySelectorAll('.topBall').length) % ballColors.length];
    ballWrapper.dataset.color = color;

    ballWrapper.innerHTML = `
        <div class="ballPreview" style="background-color:${color};"></div>
        <div class="addSubtract">
            <button class="addButton" type="button">+</button>
            <span class="ballCount">0</span>
            <button class="subtractButton" type="button">-</button>
        </div>
    `;

    const addButton = ballWrapper.querySelector('.addButton');
    const subtractButton = ballWrapper.querySelector('.subtractButton');
    const countLabel = ballWrapper.querySelector('.ballCount');
    const ballPreview = ballWrapper.querySelector('.ballPreview');
    const spawnedBalls = [];

    addButton.addEventListener('click', () => {
        const newBall = spawnBall(color);
        spawnedBalls.push(newBall);
        countLabel.textContent = spawnedBalls.length;
    });

    subtractButton.addEventListener('click', () => {
        const lastBall = spawnedBalls.pop();
        if (lastBall) {
            lastBall.remove();
            countLabel.textContent = spawnedBalls.length;
        }
    });

    ballPreview.addEventListener('click', () => {
        ballWrapper.style.border = '2px solid red'
        

    })

    topMenu.appendChild(ballWrapper);
}

addNewBallBtn.addEventListener('click', createBallControl);
createBallControl();