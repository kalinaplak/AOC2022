const fs = require('fs');
import { sum, max, orderbydescending } from 'powerseq';

const file: string = fs.readFileSync('./day1/input.txt', "utf-8");
const caloriesCarried: number[] = file.split('\n\n').map(line => sum(line.split('\n').map(c=> +c)));
//1
const maxCalories = max(caloriesCarried);
//2
const top3 = orderbydescending(caloriesCarried, c=>c).take(3).sum();

console.log(maxCalories);
console.log(top3);
