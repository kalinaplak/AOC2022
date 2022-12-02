const fs = require('fs');
import { sum } from 'powerseq';

type Figure = 'X' | 'Y' | 'Z';
type FigureOponent = 'A' | 'B' | 'C';

function loadFile(){
    const file: string = fs.readFileSync('./day2/input.txt', "utf-8");
    return file.split('\n').map(line => line.split(' '));
}

function mapOponentsFigure(figure: FigureOponent): Figure {
    switch (figure) {
        case 'A': return 'X';
        case 'B': return 'Y';
        case 'C': return 'Z';
    }
}

function pointsForFigure1(figure: Figure) {
    switch (figure) {
        case 'X': return 1;
        case 'Y': return 2;
        case 'Z': return 3;
    }
}

function pointsForRound1([fOponent, fP]: [FigureOponent, Figure]) {
    const fO = mapOponentsFigure(fOponent)
    if (fO === fP) return 3;
    if ((fO === 'X' && fP === 'Y') || (fO === 'Y' && fP === 'Z') || (fO === 'Z' && fP === 'X')) return 6;
    else return 0;
}

function calculateRounds1() {
    const rounds = loadFile();
    return sum(rounds.map((r: any) => pointsForRound1(r) + pointsForFigure1(r[1])));
}

function pointsForRound2(figure: Figure){
    switch (figure) {
        case 'X': return 0;
        case 'Y': return 3;
        case 'Z': return 6;
    }
}

function getOppositeWinningFigure(figure: FigureOponent){
    switch (figure) {
        case 'A': return 'Y';
        case 'B': return 'Z';
        case 'C': return 'X';
    }
}

function getOppositeLoosingFigure(figure: FigureOponent){
    switch (figure) {
        case 'A': return 'Z';
        case 'B': return 'X';
        case 'C': return 'Y';
    }
}

function pointsForFigure2([fOponent, fP]: [FigureOponent, Figure]){
    if(fP === 'Y') return pointsForFigure1(mapOponentsFigure(fOponent));
    if(fP === 'Z') return pointsForFigure1(getOppositeWinningFigure(fOponent));
    else return pointsForFigure1(getOppositeLoosingFigure(fOponent));
}

function calculateRounds2(){
    const rounds = loadFile();
    return sum(rounds.map((r: any) => pointsForRound2(r[1]) + pointsForFigure2(r)));
}

console.log(calculateRounds1());
console.log(calculateRounds2());