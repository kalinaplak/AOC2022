import { buffer, sum } from "powerseq";

const fs = require('fs');

interface Instruction {
    cycles: number;
    value: number;
}

interface State {
    cycle: number;
    X: number;
    strengths: number[];
    pixels: string[];
}

function loadFile(): Instruction[] {
    return fs.readFileSync('./day10/input.txt', "utf-8")
        .split('\n')
        .map(line => line.includes('noop')
            ? { cycles: 1, value: 0 }
            : [{ cycles: 1, value: 0 }, { cycles: 1, value: parseInt(line.split(' ')[1]) }]
        )
        .flat();
}

function getPixel(state: State) {
    const cycle = (state.cycle -1) - ((Math.floor((state.cycle -1) / 40)) * 40);
    return Math.abs(state.X - cycle) <= 1 ? '#' : '.';
}

function processInstruction(state: State, instruction: Instruction) {
    const cycleSToCheck = [20, 60, 100, 140, 180, 220];
    state.pixels.push(getPixel(state));
    const newState: State = {
        cycle: state.cycle + instruction.cycles,
        X: state.X + instruction.value,
        strengths: [...state.strengths],
        pixels: state.pixels
    };
    if (cycleSToCheck.find(c => c === newState.cycle)) {
        newState.strengths.push(newState.X * newState.cycle);
    }
    return newState;
}

function calculateRound1() {
    let state: State = { cycle: 1, X: 1, strengths: [], pixels: [] };
    const instructions = loadFile();
    const finalState = instructions.reduce((acc, curr) => {
        acc = processInstruction(acc, curr);
        return acc;
    }, state);

    //round2
    const pixels = [...buffer(finalState.pixels, 40)].map(row => row.join('')).join('\n');
    console.log(pixels);
    //

    return sum(finalState.strengths);
}

console.log(calculateRound1());

