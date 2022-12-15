import { count, max, repeatvalue, sum } from "powerseq";

const fs = require('fs');

function loadFile() {
    return fs.readFileSync('./day14/input.txt', "utf-8").split("\n")
        .map(row => row.split(' -> ')
            .map(p => p.split(',')
                .map(p => parseInt(p))
            )
        );
}

function getEmptyBoard(width, height) {
    let board = [];
    for (let i = 0; i < height; i++) {
        board.push(Array(width).fill('.'));
    }
    return board;
}

function drawLine(board, [fromX, fromY], [toX, toY]) {
    const [minx, miny] = [Math.min(fromX, toX), Math.min(fromY, toY)];
    const [maxx, maxy] = [Math.max(fromX, toX), Math.max(fromY, toY)];

    for (let i = minx; i <= maxx; i++) {
        for (let j = miny; j <= maxy; j++) {
            board[j][i] = '#';
        }
    }
}

function getBoard(lines, width, height) {
    let board = getEmptyBoard(width, height * 2);
    lines.forEach(line => {
        line.forEach((p, index) => {
            if (index + 1 === line.length) return;
            drawLine(board, p, line[index + 1])
        });
    })
    return board;
}

function addSand(board, maxY, untilBlock, [sandX, sandY]) {
    if (sandY > maxY + 1) {
        return untilBlock ? sandY == 0 : true;
    }
    else if (board[sandY + 1][sandX] === '.') {
        return addSand(board, maxY, untilBlock, [sandX, sandY + 1])
    }
    else if (board[sandY + 1][sandX - 1] === '.') {
        return addSand(board, maxY, untilBlock, [sandX - 1, sandY + 1])
    }
    else if (board[sandY + 1][sandX + 1] === '.') {
        return addSand(board, maxY, untilBlock, [sandX + 1, sandY + 1])
    }
    board[sandY][sandX] = 'o';
    return untilBlock ? sandY == 0 : false;
}

function processSand(lines, maxWidth, maxHeight, untilBlock) {
    const board = getBoard(lines, maxWidth, maxHeight);
    let result;
    do {
        result = addSand(board, maxHeight, untilBlock, [500, 0]);
    } while (!result);
    return sum(board.map(row => sum(row, c => c === 'o' ? 1 : 0)));
}


function calculateRound1() {
    const lines = loadFile();
    const flattenLines = lines.flat();
    const maxWidth = max(flattenLines, ([px, py]) => px);
    const maxHeight = max(flattenLines, ([px, py]) => py);
    
    return processSand(lines, maxWidth,maxHeight, false);
}

function calculateRound2() {
    const lines = loadFile();
    const flattenLines = lines.flat();
    const maxWidth = max(flattenLines, ([px, py]) => px) * 2;
    const maxHeight = max(flattenLines, ([px, py]) => py);
    const linesExtended = [...lines, [[0, maxHeight + 2], [maxWidth * 2, maxHeight + 2]]];

    return processSand(linesExtended, maxWidth,maxHeight, true);
}


console.log(calculateRound1());
console.log(calculateRound2());

