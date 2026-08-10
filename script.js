const box = document.getElementById('box');
const topMenu = document.getElementById('top-menu');
const addNewBallBtn = document.getElementById('addNewBall');
const ballInfo = document.querySelector('.ballInfo');

class BallType {
    constructor(color, sound = '', soundName = 'None', speed = 4) {
        this.color = color;
        this.sound = sound;
        this.soundName = soundName;
        this.speed = speed;
        this.volume = 0.5; // 1
        this.droneActive = false;
        this.spawnedBalls = [];
        this.control = this.createControl();
        this.selected = false;
    }

    createControl() {
        const ballWrapper = document.createElement('div');
        ballWrapper.classList.add('topBall');
        ballWrapper.dataset.color = this.color;

        ballWrapper.innerHTML = `
            <div class="ballPreview" style="background-color:${this.color};"></div>
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

        addButton.addEventListener('click', () => this.addBall(countLabel));
        subtractButton.addEventListener('click', () => this.removeBall(countLabel));
        ballPreview.addEventListener('click', () => this.select(ballWrapper));

        return ballWrapper;
    }

    addBall(countLabel) {
        const newBall = spawnBall(this);
        this.spawnedBalls.push(newBall);
        countLabel.textContent = this.spawnedBalls.length;
    }

    removeBall(countLabel) {
        const lastBall = this.spawnedBalls.pop();
        if (!lastBall) return;
        lastBall.remove();
        countLabel.textContent = this.spawnedBalls.length;
    }

    select(ballWrapper) {
        topMenu.querySelectorAll('.topBall').forEach(el => el.classList.remove('selected'));
        ballWrapper.classList.add('selected');
        this.selected = true;
        this.showEditPanel();
    }

    showEditPanel() {
        ballInfo.innerHTML = `
            <div class="ballInfoEditor">
                <p><strong>Selected Ball Type</strong></p>
                <label>Hex color:
                    <input class="colorInput" type="text" value="${this.color}" placeholder="#rrggbb">
                </label>
                <br>
                <label>Speed:
                    <input class="speedInput" type="number" min="1" max="20" step="0.1" value="${this.speed}"> <br>
                </label>
                <label>Sound:<input class="soundInput" type="file" accept=".wav,audio/wav">
                </label>

                <label> Volume:
                    <input class="volumeInput" type="range" min="0" max="1" step="0.01" value="${this.volume}"> <br>
                </label>


                <label> Drone:
                    <input class="droneInput" type="checkbox" ${this.droneActive ? 'checked' : ''}> <br> 
                </label>
                

                <button class="updateButton" type="button">Update ball</button>
                <p class="soundName">Current sound: ${this.soundName}</p>
            </div>
        `;

        const colorInput = ballInfo.querySelector('.colorInput');
        const speedInput = ballInfo.querySelector('.speedInput');
        const soundInput = ballInfo.querySelector('.soundInput');
        const updateButton = ballInfo.querySelector('.updateButton');
        const soundNameLabel = ballInfo.querySelector('.soundName');
        const volumeInput = ballInfo.querySelector('.volumeInput');
        const droneInput = ballInfo.querySelector('.droneInput');

        updateButton.addEventListener('click', () => {
            this.applyInputs(colorInput, speedInput, soundInput, soundNameLabel, volumeInput, droneInput);
        });
    }

    applyInputs(colorInput, speedInput, soundInput, soundNameLabel, volumeInput, droneInput) {
        const rawColor = colorInput.value.trim();
        const normalized = rawColor.startsWith('#') ? rawColor : `#${rawColor}`;
        if (!isValidHexColor(normalized)) {
            colorInput.classList.add('invalid');
            return;
        }

        const rawSpeed = parseFloat(speedInput.value);
        if (!isValidSpeed(rawSpeed)) {
            speedInput.classList.add('invalid');
            return;
        }

        this.updateColor(normalized);
        this.updateSpeed(rawSpeed);

        if (soundInput.files.length > 0) {
            const selectedFile = soundInput.files[0];
            const objectUrl = URL.createObjectURL(selectedFile);
            this.updateSound(objectUrl, selectedFile.name);
            soundNameLabel.textContent = `Current sound: ${this.soundName}`;
        }
        this.updateVolume(volumeInput.value);
        this.updateDrone(droneInput.checked);
    }

    updateColor(newColor) {
        this.color = newColor;
        this.control.querySelector('.ballPreview').style.backgroundColor = newColor;
        this.spawnedBalls.forEach(ball => {
            ball.element.style.backgroundColor = newColor;
        });
    }

    updateSpeed(newSpeed) {
        this.speed = newSpeed;
        this.spawnedBalls.forEach(ball => {
            ball.updateSpeed(newSpeed);
        });
    }

    updateSound(soundUrl, soundName) {
        if (this.sound && this.sound.startsWith('blob:')) {
            URL.revokeObjectURL(this.sound);
        }
        this.sound = soundUrl;
        this.soundName = soundName;
        const soundNameLabel = ballInfo.querySelector('.soundName');
        if (soundNameLabel) {
            soundNameLabel.textContent = `Current sound: ${this.soundName}`;
        }
    }

    updateVolume(volume) {
        this.volume = parseFloat(volume);
    }

    updateDrone(isActive) {
        this.droneActive = isActive;
    }
}

const ballTypes = [
    new BallType('#ff4757', '', 'None', 3),
    new BallType('#1e90ff', '', 'None', 3),
    new BallType('#00ff6a', '', 'None', 3),
    new BallType('#ffa502', '', 'None', 3),
    new BallType('#8f0015', '', 'None', 3),
    new BallType('#07614f', '', 'None', 3),
    new BallType('#700095', '', 'None', 3),
    new BallType('#fce061', '', 'None', 3),
    new BallType('#ff58ee', '', 'None', 3),
    new BallType('#42d3ff', '', 'None', 3),

];

function isValidHexColor(value) {
    return /^#[0-9A-Fa-f]{6}$/.test(value);
}

function isValidSpeed(value) {
    return typeof value === 'number' && !isNaN(value) && value >= 1 && value <= 20;
}

function spawnBall(ballType) {
    const boxWidth = box.clientWidth;
    const boxHeight = box.clientHeight;
    let droneAudio = null; // 4

    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.style.backgroundColor = ballType.color;
    box.appendChild(ball);

    const ballSize = 30;
    let posX = Math.random() * Math.max(1, boxWidth - ballSize);
    let posY = Math.random() * Math.max(1, boxHeight - ballSize);
    let dx = (Math.random() > 0.5 ? 1 : -1) * ballType.speed;
    let dy = (Math.random() > 0.5 ? 1 : -1) * ballType.speed;

    const ballInstance = {
        element: ball,
        dx,
        dy,
        posX,
        posY,
        animationFrameId: null,
        updateSpeed(newSpeed) {
            const xSign = this.dx >= 0 ? 1 : -1;
            const ySign = this.dy >= 0 ? 1 : -1;
            this.dx = xSign * newSpeed;
            this.dy = ySign * newSpeed;
        },
        remove() {
            if (this.animationFrameId !== null) {
                cancelAnimationFrame(this.animationFrameId);
            }
            if (droneAudio) { droneAudio.pause(); droneAudio = null; } // 5
            this.element.remove();
        },
        move() {
            const boxWidth = box.clientWidth;
            const boxHeight = box.clientHeight;

            this.posX += this.dx;
            this.posY += this.dy;

            let bounced = false;
            if (this.posX <= 0 || this.posX >= boxWidth - ballSize) {
                this.dx = -this.dx;
                this.posX = Math.max(0, Math.min(this.posX, boxWidth - ballSize));
                bounced = true;
            }

            if (this.posY <= 0 || this.posY >= boxHeight - ballSize) {
                this.dy = -this.dy;
                this.posY = Math.max(0, Math.min(this.posY, boxHeight - ballSize));
                bounced = true;
            }

            if (bounced && ballType.sound && !ballType.droneActive) {
                const audio = new Audio(ballType.sound);
                audio.play().catch(() => {});
            }

            if (ballType.droneActive && ballType.sound) { // 6
                if (!droneAudio) {
                    droneAudio = new Audio(ballType.sound);
                    droneAudio.loop = true;
                    droneAudio.play().catch(() => {});
                }
                
                const yRatio = Math.max(0, Math.min(1, this.posY / (boxHeight || 1)));

            const exponent = 3; 
            const exponentialY = Math.pow(yRatio, exponent);


            droneAudio.volume = Math.max(0, Math.min(1, ballType.volume * exponentialY));
                droneAudio.volume = Math.max(0, Math.min(1, ballType.volume * (this.posY / (boxHeight || 1))));
            }

            this.element.style.left = `${this.posX}px`;
            this.element.style.top = `${this.posY}px`;
            this.animationFrameId = requestAnimationFrame(this.move.bind(this));
        }
    };

    ballInstance.animationFrameId = requestAnimationFrame(ballInstance.move.bind(ballInstance));
    return ballInstance;
}

function createBallControl() {
    const typeIndex = topMenu.querySelectorAll('.topBall').length % ballTypes.length;
    const currentBallType = ballTypes[typeIndex];
    topMenu.appendChild(currentBallType.control);
}

addNewBallBtn.addEventListener('click', createBallControl);
createBallControl();