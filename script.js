const allCells = document.querySelectorAll('.cell');
const scoreText = document.querySelector('.score-block');

let input = null;

document.onkeydown = (e) => {
    if (e.keyCode == '37') {
        input = new Vector(-1, 0);
    }
    else if (e.keyCode == '38') {
        input = new Vector(0, -1);
    }
    else if (e.keyCode == '39') {
        input = new Vector(1, 0);
    }
    else if (e.keyCode == '40') {
        input = new Vector(0, 1);
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const getCell = (coordinate) => {
    return allCells[coordinate.y * 10 + coordinate.x];
}

const isEqual = (a, b) => {
    return a.x == b.x && a.y == b.y;
}

const arrayContains = (arr, elem) => {
    for (const item of arr)
        if (isEqual(item, elem))
            return true;
    return false;
}

const getMovementDirection = (currentDirection) => {

    if (input == null)
        return currentDirection;

    if (currentDirection.x != 0 && input.x != 0)
        return currentDirection;

    if (currentDirection.y != 0 && input.y != 0)
        return currentDirection;

    let dir = new Vector(input.x, input.y);
    input = null;
    return dir;
}

const draw = (snake, apple, score) => {

    scoreText.textContent = `Score: ${score}`;

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const coordinate = new Vector(x, y);
            const cell = getCell(coordinate);

            cell.classList.remove('snake', 'apple', 'snake-head');

            if (arrayContains(snake, coordinate)) {
                if (isEqual(snake[0], coordinate)) {
                    cell.classList.add('snake-head');
                } else {
                    cell.classList.add('snake');
                }
            }
            else if (isEqual(coordinate, apple)) {
                cell.classList.add('apple');
            }
        }
    }
}

const getAppleCoordinate = (snake) => {
    const availableCoordinates = [];
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const coordinate = new Vector(x, y);
            if (arrayContains(snake, coordinate) == false) {
                availableCoordinates.push(coordinate);
            }
        }
    }
    const l = availableCoordinates.length;
    return availableCoordinates[Math.floor(Math.random() * l)];
}

const loopInt = (int, min, max) => {
    if (int < min)
        return max;
    else if (int > max)
        return min;
    return int;
}

const loopCoordinate = (coordinate) => {
    return new Vector(
        loopInt(coordinate.x, 0, 9),
        loopInt(coordinate.y, 0, 9));
}

const updateSnake = (snake, direction) => {
    let last = snake[0];
    snake[0] = loopCoordinate(new Vector(
        snake[0].x + direction.x,
        snake[0].y + direction.y));

    for (let i = 1; i < snake.length; i++) {
        const n = new Vector(last.x, last.y);
        last = snake[i];
        snake[i] = n;
    }
}

const growSnake = (snake) => {
    const last = snake[snake.length - 1];
    snake.push(new Vector(last.x, last.y));
}

const play = () => {
    const snake = [
        new Vector(2, 0),
        new Vector(1, 0),
        new Vector(0, 0)
    ];

    let direction = new Vector(1, 0);
    let apple = getAppleCoordinate(snake);
    let score = 0;

    const loop = setInterval(() => {
        direction = getMovementDirection(direction);
        updateSnake(snake, direction);

        if (arrayContains(snake, apple)) {
            score++;
            growSnake(snake);
            apple = getAppleCoordinate(snake);
        } else if (arrayContains(snake.slice(1, snake.length), snake[0]) || snake.length == 100) {
            clearInterval(loop);
            alert('game over')
            play();
        }

        draw(snake, apple, score);

    }, 1000 / 5);
}

play();





