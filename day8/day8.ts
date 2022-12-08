import { max, sum, takewhile } from "powerseq";
const fs = require('fs');

interface Tree {
    height: number;
    visible: boolean;
    score?: number;
}

function loadFile() {
    const file: string = fs.readFileSync('./day8/input.txt', "utf-8");
    return file.split('\n').map(row => row.split('').map(s => parseInt(s)));
}

function mapTrees(treeMatrix: number[][]): Tree[][] {
    return treeMatrix.map((row, i) => {
        return row.map((val, j) => {
            if (i === 0 || i === (treeMatrix.length - 1) || j === 0 || j === (row.length - 1)) {
                return { height: val, visible: true, score: 0 }
            }
            return { height: val, visible: checkVisible(treeMatrix, i,j), score:calculateScore(treeMatrix, i,j) };
        });
    })
}


function getColumnArray(treeMatrix: any[][], j) {
    return treeMatrix.map((r) => {
        return r[j];
    }).flat()
}

function checkVisible(treeMatrix: number[][], i, j){
    const visibleLeft = treeMatrix[i].slice(0, j).every(tree => tree < treeMatrix[i][j]);
    if(visibleLeft) return true;
    const visibleRight = treeMatrix[i].slice(j + 1, treeMatrix[i].length).every(tree => tree < treeMatrix[i][j]);
    if(visibleRight) return true;
    const column = getColumnArray(treeMatrix, j);
    const visibleTop = column.slice(0, i).every(tree => tree < treeMatrix[i][j]);
    if(visibleTop) return true;
    const visibleBottom = column.slice(i + 1, column.length).every(tree => tree < treeMatrix[i][j]);
    return visibleBottom;
}

function calculateScore(treeMatrix: number[][], i, j) {
    const tree = treeMatrix[i][j];

    const sliceLeft= treeMatrix[i].slice(0, j).reverse();
    let scoreLeft = [...takewhile(sliceLeft, el => el < tree)].length;
    if(scoreLeft !== sliceLeft.length) scoreLeft++;

    const sliceRight = treeMatrix[i].slice(j + 1, treeMatrix[i].length);
    let scoreRight = [...takewhile(sliceRight, el => el < tree)].length;
    if(scoreRight !== sliceRight.length) scoreRight++;

    const column = getColumnArray(treeMatrix, j);
    const sliceTop = column.slice(0, i).reverse();
    let scoreTop = [...takewhile(sliceTop, el => el < tree)].length;
    if(scoreTop !== sliceTop.length) scoreTop++;

    const sliceBottom = column.slice(i + 1, column.length);
    let scoreBottom = [...takewhile(sliceBottom, el => el < tree)].length;
    if(scoreBottom !== sliceBottom.length) scoreBottom++;

    return scoreBottom * scoreTop * scoreRight * scoreLeft;
}


function calculateRound1() {
    const file = loadFile();
    return sum(mapTrees(file).map(row => sum(row, t => t.visible ? 1 : 0)));
}

function calculateRound2(){
    const file = loadFile();
    const trees = mapTrees(file);
    return max(trees.map(row => max(row, t => t.score)));
}

console.log(calculateRound1());
console.log(calculateRound2());