const fs = require('fs');
import { buffer, orderbydescending, range, sum } from "powerseq";

interface Monkey {
    name: string;
    items: number[];
    operation: '+' | '*';
    operationNumber: number | 'old';
    divisible: number;
    trueMonkey: number;
    falseMonkey: number;
    inspectedItems: number;
}

function loadFile(): Monkey[] {
    return [...buffer(fs.readFileSync('./day11/input.txt', "utf-8").split('\n').filter(l => l !== ''), 6)]
        .map((m: string[]) => {
            const operation = m[2].indexOf('+') !== -1 ? '+' : '*';
            const operationNum = m[2].split('new = old ' + operation)[1];
            return {
                name: m[0],
                items: m[1].split('Starting items:')[1].split(',').map(num => parseInt(num)),
                operation,
                operationNumber: operationNum.trim() !== 'old' ? parseInt(operationNum) : 'old',
                divisible: parseInt(m[3].split('by')[1]),
                trueMonkey: parseInt(m[4].split('monkey')[1]),
                falseMonkey: parseInt(m[5].split('monkey')[1]),
                inspectedItems: 0
            }
        });
}

function processMonkeyItems(monkey: Monkey, monkeys: Monkey[], worryLevelModulus) {
    while (monkey.items.length > 0) {
        const item = monkey.items.shift();
        const operationNumber = monkey.operationNumber !== "old" ? monkey.operationNumber : item;
        const newLevel = monkey.operation === '+'
            ? item + operationNumber
            : item * operationNumber;
        const checkLevel = worryLevelModulus  ? newLevel % worryLevelModulus: Math.floor(newLevel / 3);
        const newMonkey = (checkLevel % monkey.divisible === 0) ? monkey.trueMonkey : monkey.falseMonkey;
        monkeys[newMonkey].items.push(checkLevel);
        monkey.inspectedItems++;
    }
    return monkeys;
}

function processRound(monkeys: Monkey[], worryLevelModulus) {
    return monkeys.reduce((monkeys, monkey) => {
        return processMonkeyItems(monkey, monkeys, worryLevelModulus);
    }, monkeys);
}

function calculateRound1() {
    const monkeys = loadFile();
    const rounds = [...range(1, 20)];
    const monkeysFinal = rounds.reduce((m, r) => {
        return processRound(m, null);
    }, monkeys);
    return [...orderbydescending(monkeysFinal, m => m.inspectedItems)].slice(0, 2).reduce((acc, curr) => { return acc * curr.inspectedItems }, 1);
}

function calculateRound2() {
    const monkeys = loadFile();
    const rounds = [...range(1, 10000)];
    const worryLevelModulus = monkeys.reduce((acc,m)=> acc*m.divisible, 1);
    const monkeysFinal = rounds.reduce((m, r) => {
        return processRound(m, worryLevelModulus);
    }, monkeys);
    console.log(monkeysFinal);
    return [...orderbydescending(monkeysFinal, m => m.inspectedItems)].slice(0, 2).reduce((acc, curr) => { return acc * curr.inspectedItems }, 1);
}

console.log(calculateRound1());
console.log(calculateRound2());