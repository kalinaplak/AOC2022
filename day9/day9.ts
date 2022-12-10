import { distinct, repeatvalue } from "powerseq";

const fs = require('fs');

interface Movement {
    direction: 'L' | 'R' | 'U' | 'D',
    steps: number;
}

interface Position {
    i: number;
    j: number;
}

function loadFile(): Movement[] {
    const file: string = fs.readFileSync('./day9/input.txt', "utf-8");
    return file.split('\n')
        .map(row => row.split(' '))
        .map(([direction, steps]) => ({ direction, steps: parseInt(steps) }) as Movement);
}

function calculateNewHead(currentPosition: Position, direction: string) {
    switch (direction) {
        case 'U': return { i: currentPosition.i + 1, j: currentPosition.j };
        case 'D': return { i: currentPosition.i - 1, j: currentPosition.j };
        case 'R': return { i: currentPosition.i, j: currentPosition.j + 1 };
        case 'L': return { i: currentPosition.i, j: currentPosition.j - 1 };
    }
}

function isAdjacent(tail: Position, head: Position) {
    return (tail.i === head.i && tail.j === head.j) ||
        (tail.i === head.i && Math.abs(tail.j - head.j) === 1) ||
        (tail.j === head.j && Math.abs(tail.i - head.i) === 1) ||
        (Math.abs(tail.i - head.i) === 1 && Math.abs(tail.j - head.j) === 1);
}

function calculateNewTailPosition(tail: Position, head: Position, dir: string) {
    if (isAdjacent(tail, head)) return { ...tail };

    if (tail.i === head.i && (dir === 'R' || dir === 'L')) return { i: tail.i, j: (dir === 'R' ? (tail.j + 1) : (tail.j - 1)) };
    if (tail.j === head.j && (dir === 'U' || dir === 'D')) return { i: (dir === 'D' ? (tail.i - 1) : (tail.i + 1)), j: tail.j };

    const iChange = tail.i >= head.i
        ? tail.i === head.i ? 0 : -1
        : 1;

    const jChange = tail.j >= head.j
        ? tail.j === head.j ? 0 : -1
        : 1;

    return { i: tail.i + iChange, j: tail.j + jChange };
}

function calculateRound1() {
    const movements = loadFile();
    let currentPosition: Position[] = [{ i: 0, j: 0 }, { i: 0, j: 0 }];
    const visitedPositions = [];
    movements.forEach(m => {
        let [head, tail] = currentPosition;
        for (let i = 0; i < m.steps; i++) {
            const newHead = calculateNewHead(head, m.direction);
            const newTail = calculateNewTailPosition(tail, newHead, m.direction);
            visitedPositions.push(newTail);
            [head, tail] = [newHead, newTail];
        }
        currentPosition = [head, tail];
    });
    return [...distinct(visitedPositions, p => p.i + ' ' + p.j)].length;
}

function move(head: Position, tail: Position[], dir) {
    if (tail.length === 0) return [];
    const newPos = calculateNewTailPosition(tail[0], head, dir);
    return [newPos, ...move(newPos, tail.slice(1, tail.length), dir)];
}

function calculateRound2() {
    const visitedPositions = [];
    const movements = loadFile();
    let currentPositions: Position[] = [...repeatvalue({ i: 0, j: 0 }, 10)];
    movements.forEach(m => {
        for (let i = 0; i < m.steps; i++) {
            const head = calculateNewHead(currentPositions[0], m.direction);
            const tail = move(head, currentPositions.slice(1, currentPositions.length), m.direction);
            currentPositions = [head, ...tail];
            visitedPositions.push(...currentPositions.slice(-1));
        }
    });
    return [...distinct(visitedPositions, p => p.i + ' ' + p.j)].length;
}

console.log(calculateRound1());
console.log(calculateRound2());