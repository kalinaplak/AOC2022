const fs = require('fs');
import { intersect, range } from 'powerseq';

interface Range {
    from: number;
    to: number;
}

function loadFile() {
    const file: string = fs.readFileSync('./day4/input.txt', "utf-8");
    return file.split('\n');
}

function loadPairs(){
    return loadFile().map(l => l.split(',').map(s => {
        const [from, to] = s.split('-');
        return { from: parseInt(from), to: parseInt(to)}
    }))
}

function checkContainingPairs([first, second]: Range[]){
    if(first.from >= second.from && first.to <= second.to)
        return true;
    if(second.from >= first.from && second.to <= first.to)
        return true;
    return false;
}

function checkOverlapingPairs([first,second]: Range[]){
    const firstSections = range(first.from, (first.to - first.from) + 1);
    const secondSections = range(second.from, (second.to - second.from) +1);
    return Array.from(intersect(firstSections, secondSections)).length > 0
}


function calculateRound1(){
    return loadPairs().filter(p=> checkContainingPairs(p)).length
}

function calculateRound2(){
    return loadPairs().filter(p=> checkOverlapingPairs(p)).length
}

console.log(calculateRound1());
console.log(calculateRound2());