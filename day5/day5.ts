import { buffer } from "powerseq";

const fs = require('fs');

interface Instruction {
    amount: number;
    from: 'string';
    to: string;
}

interface Stacks {
    [key: string]: string[];
}

function loadFile() {
    const file: string = fs.readFileSync('./day5/input.txt', "utf-8");
    return file.split('\n\n').map(part => part.split('\n'));
}

function getStacks(stacks: string[]): Stacks {
    const stackNames = stacks.splice(-1).pop().split(' ').filter(c => c !== '');
    const rows = stacks.map(s => Array.from(buffer(s, 4)).map(s => s.find(c => c !== ' ' && c !== '[' && c !== ']')));
    return stackNames.reduce((acc, curr, index) => {
        acc[curr] = rows.map(r => r[index]).filter(r => !!r).reverse();
        return acc;
    }, {})
}

function getInstructions(instructions: string[]): Instruction[] {
    return instructions
        .map(line => line.split('from'))
        .map(([amount, stacks]) => {
            const a = amount.split('move')[1].trim();
            const [from, to] = stacks.split('to').map(s => s.trim());
            return { amount: parseInt(a), from: from, to: to } as Instruction;
        });
}

function getStacksAndInstructions() {
    const [p1, p2] = loadFile();
    const stacks: Stacks = getStacks(p1);
    const instructions: Instruction[] = getInstructions(p2);
    return { stacks, instructions }
}

function applyInstructions(stacks: Stacks, instructions: Instruction[], reverseMoved = true) {
    instructions.forEach(instruction => {
        const toMove = stacks[instruction.from].splice(-instruction.amount);
        stacks[instruction.to] = [...stacks[instruction.to], ...(reverseMoved ? toMove.reverse() : toMove)];
    });
    return stacks;
}

function calculateRound1() {
    const { stacks, instructions } = getStacksAndInstructions();
    const finalStack = applyInstructions(stacks, instructions);
    return Object.keys(finalStack).map(k => finalStack[k].slice(-1)).join('');
}

function calculateRound2() {
    const { stacks, instructions } = getStacksAndInstructions();
    const finalStack = applyInstructions(stacks, instructions, false);
    return Object.keys(finalStack).map(k => finalStack[k].slice(-1)).join('');
}


console.log(calculateRound1());
console.log(calculateRound2());


