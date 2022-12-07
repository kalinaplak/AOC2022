const fs = require('fs');
import { distinct } from 'powerseq';

function loadFile() {
    const file: string = fs.readFileSync('./day6/input.txt', "utf-8");
    return file.split('');
}

function checkPackage(chars: string[]){
    return [...distinct(chars)].length === chars.length;
}

function findMarker(packegeLength){
    const file = loadFile();
    let i = packegeLength;
    let marker = undefined;
    while(i <= file.length && !marker){
        const p = file.slice((i -packegeLength),i);
        if(checkPackage(p)){
            marker = p;
            break;
        }
        i+=1;
    }
    return {marker, index: i};
}
/**Round 1 */
console.log(findMarker(4));
/**Round 2 */
console.log(findMarker(14));
