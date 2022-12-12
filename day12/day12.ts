const fs = require('fs');

function loadFile() {
    return fs.readFileSync('./day12/input.txt', "utf-8")
        .split('\n')
        .map(row => row.split('').map(l => {
            return (l === 'S') ? getHeight('a')
                : (l === 'E')
                    ? getHeight('z')
                    : getHeight(l)
        }));
}

function getHeight(letter: string) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return alphabet.indexOf(letter);
}

function isFinalPosition(matrix, [i, j]) {
    return matrix[i][j] === getHeight('z')
}

function isStartingPosition(matrix, [i, j]) {
    return matrix[i][j] === getHeight('a')
}

function getPosition(matrix: number[][], posFn: (matrix, [i, j]) => boolean) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (posFn(matrix, [i, j])) {
                return [i, j];
            }
        }
    }
}

function isInsideMatrix(i: number, j: number, matrix: number[][]) {
    return i >= 0 && i < matrix.length && j >= 0 && j < matrix[0].length
}

function getPath(startPosition, matrix: number[][], reverse = false) {
    const possibleMoves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const visited = JSON.parse(JSON.stringify(matrix));

    const path = [[startPosition]];
    let finalPathLength = 0;

    while (!finalPathLength) {
        let [currentPossibleNodes] = path.slice(-1);
        let nextPossibleNodes = [];
        currentPossibleNodes.forEach(([currI, currJ]) => {
            if (finalPathLength) return;
            let currentLevel = matrix[currI][currJ];
            possibleMoves.forEach(m => {
                let [nextI, nextJ] = [currI + m[0], currJ + m[1]];
                if (isInsideMatrix(nextI, nextJ, matrix)) {
                    const newLevel = matrix[nextI][nextJ];
                    if ((!reverse && newLevel <= currentLevel + 1)
                        || (reverse && newLevel >= currentLevel - 1)) {
                        if (visited[nextI][nextJ] !== -1) {
                            visited[nextI][nextJ] = -1;
                            nextPossibleNodes.push([nextI, nextJ]);
                        }
                        if ((!reverse && isFinalPosition(matrix, [nextI, nextJ]))
                            || (reverse && isStartingPosition(matrix, [nextI, nextJ]))) {
                            finalPathLength = path.length;
                            return;
                        }
                    }
                }
            });
        });
        if (nextPossibleNodes.length === 0) return;
        path.push(nextPossibleNodes);
    }
    return finalPathLength;
}

function calculateRound1() {
    const fileMatrix = loadFile();
    const startPos = getPosition(fileMatrix, isStartingPosition);
    return getPath(startPos, fileMatrix);
}

function calculateRound2() {
    const fileMatrix = loadFile();
    const startPos = getPosition(fileMatrix, isFinalPosition);
    return getPath(startPos, fileMatrix, true);
}

console.log(calculateRound1());
console.log(calculateRound2());