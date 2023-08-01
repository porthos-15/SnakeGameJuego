document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    const snake = document.createElement('div');
    snake.classList.add('snake');
    gameContainer.appendChild(snake);
    const food = document.querySelector('.food');

    let snakeX = 0;
    let snakeY = 0;
    let foodX = 0;
    let foodY = 0;
    let direction = 'right';
    const gridSize = 10;
    const gridWidth = gameContainer.clientWidth / gridSize;
    const gridHeight = gameContainer.clientHeight / gridSize;
    let snakeBody = [];
    let snakeLength = 1;
    let isGameOver = false;

    function moveSnake() {
        if (isGameOver) return;

        switch (direction) {
            case 'up':
                snakeY -= gridSize;
                break;
            case 'down':
                snakeY += gridSize;
                break;
            case 'left':
                snakeX -= gridSize;
                break;
            case 'right':
                snakeX += gridSize;
                break;
        }

        if (snakeX >= gridWidth * gridSize) snakeX = 0;
        if (snakeX < 0) snakeX = gridWidth * gridSize - gridSize;
        if (snakeY >= gridHeight * gridSize) snakeY = 0;
        if (snakeY < 0) snakeY = gridHeight * gridSize - gridSize;

        snake.style.left = snakeX + 'px';
        snake.style.top = snakeY + 'px';

        checkCollision();
    }

    function checkCollision() {
        if (snakeX === foodX && snakeY === foodY) {
            snakeLength++;
            placeFood();
        }

        for (let i = 1; i < snakeBody.length; i++) {
            if (snakeX === snakeBody[i].x && snakeY === snakeBody[i].y) {
                isGameOver = true;
                clearInterval(interval);
                alert('Game Over! Your score: ' + snakeLength);
                break;
            }
        }

        updateSnakeBody();
    }

    function updateSnakeBody() {
        snakeBody.unshift({ x: snakeX, y: snakeY });

        while (snakeBody.length > snakeLength) {
            const removedSegment = snakeBody.pop();
            gameContainer.removeChild(removedSegment.element);
        }

        snakeBody.forEach((segment, index) => {
            if (!segment.element) {
                segment.element = createSnakeSegment(segment.x, segment.y);
                gameContainer.appendChild(segment.element);
            } else {
                segment.element.style.left = segment.x + 'px';
                segment.element.style.top = segment.y + 'px';
            }
        });
    }

    function placeFood() {
        foodX = getRandomCoordinate(gridWidth);
        foodY = getRandomCoordinate(gridHeight);
        food.style.left = foodX + 'px';
        food.style.top = foodY + 'px';
    }

    function getRandomCoordinate(max) {
        return Math.floor(Math.random() * max) * gridSize;
    }

    document.addEventListener('keydown', (event) => {
        if (isGameOver) {
            restartGame();
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });

    function createSnakeSegment(x, y) {
        const segment = document.createElement('div');
        segment.classList.add('snake');
        segment.style.left = x + 'px';
        segment.style.top = y + 'px';
        return segment;
    }

    function restartGame() {
        isGameOver = false;
        snakeX = 0;
        snakeY = 0;
        direction = 'right';
        snakeBody = [];
        snakeLength = 1;
        gameContainer.innerHTML = '';
        placeFood();
        clearInterval(interval);
        interval = setInterval(() => {
            moveSnake();
        }, 100);
    }

    let interval = setInterval(() => {
        moveSnake();
    }, 100);

    placeFood();
});
