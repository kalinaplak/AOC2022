import { map, pipe, repeatvalue, sum, toarray, zip } from "powerseq";

const fs = require('fs');

function loadFile() {
    return fs.readFileSync('./day13/input.txt', "utf-8")
        .split('\n\n')
        .map(pair => pair.split('\n').map(p => JSON.parse(p)));
}

function fillArrayToMaxLength(arr: any[], len: number) {
    const lengthDiff = Math.max(len, arr.length) - arr.length;
    return [...arr, ...repeatvalue(-1, lengthDiff)];
}

function normalizePairLengths(left, right) {
    const maxLength = Math.max(left.length, right.length);
    const normalizedLeft = fillArrayToMaxLength(left, maxLength);
    const normalizedRight = fillArrayToMaxLength(right, maxLength);
    return [normalizedLeft, normalizedRight];
}

function compareNumbers(left: number, right: number) {
    return left < right
        ? true
        : left > right
            ? false
            : undefined;
}

function compareArrays(left: any[], right: any[]) {
    const [nLeft, nRight] = normalizePairLengths(left, right);
    const checkedPairs = pipe(
        zip(nLeft, nRight, (l, r) => [l, r]),
        map(([l, r]) => chechPairOrder([l, r])),
        toarray()
    )
    const icorrectIndex = checkedPairs.findIndex(p => p === false);
    const correctIndex = checkedPairs.findIndex(p => !!p);

    if (icorrectIndex !== -1 && correctIndex !== -1) {
        return icorrectIndex >= correctIndex;
    }
    if (icorrectIndex !== -1) return false;
    if (correctIndex !== -1) return true;
    return undefined;
}

function compareMixed(left, right) {
    if (typeof left === 'number') {
        if (left === -1) return true; // l.length < r.length
        return chechPairOrder([[left], right]);
    } else {
        if (right === -1) return false; // r.length < l.length
        return chechPairOrder([left, [right]]);
    }
}

function chechPairOrder([left, right]) {
    if (typeof left === 'number' && typeof right === 'number') {
        return compareNumbers(left, right);
    } else if (typeof left !== 'number' && typeof right !== 'number') {
        return compareArrays(left, right);
    } else {
        return compareMixed(left, right);
    }
};


function calculateRound1() {
    return sum(
        pipe(
            loadFile(),
            map(([left, right]) => chechPairOrder([left, right])),
            map((correct, i) => !!correct ? i + 1 : 0)
        )
    );
}

function calculateRound2() {
    const file = [...loadFile().flat(), [[2]], [[6]]]
        .sort((a, b): number => !!chechPairOrder([a, b]) ? -1 : 1)
        .map(el => JSON.stringify(el));

    return file.reduce((acc, curr, index) => {
        if (curr === '[[2]]' || curr === '[[6]]')
            acc = acc * (index + 1);
        return acc;
    }, 1);
}

console.log(calculateRound1());
console.log(calculateRound2());
