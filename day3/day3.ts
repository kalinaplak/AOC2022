const fs = require('fs');
import { intersect, sum, buffer } from 'powerseq';

interface Sack {
    c1: string;
    c2: string;
}

function loadFile() {
    const file: string = fs.readFileSync('./day3/input.txt', "utf-8");
    return file.split('\n');
}

function mapFileIntoSacks() {
    return loadFile().map(s => {
        const middleIndex = (s.length / 2);
        const c1 = s.slice(0, middleIndex);
        const c2 = s.slice(middleIndex, s.length);
        return { c1, c2 };
    });
}

function getCommonLetters(s1: string, s2: string) {
    return Array.from(intersect(s1, s2));
}

function getLetterPriority(letter: string) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.indexOf(letter) + 1;
}

function calculateRound1() {
    return sum(
        mapFileIntoSacks()
            .map(s => getCommonLetters(s.c1, s.c2)[0])
            .map(l => getLetterPriority(l))
    )
}

function calculateRound2() {
    return sum(
        Array.from(
            buffer(loadFile(), 3))
            .map(([e1, e2, e3]) => getCommonLetters(getCommonLetters(e1, e2).join(''), e3)
                .map(l => getLetterPriority(l))
            )
            .flat()
    )
}

console.log(calculateRound1());
console.log(calculateRound2());
