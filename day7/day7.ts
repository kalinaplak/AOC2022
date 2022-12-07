import { min, pipe, sum, takewhile, toarray } from "powerseq";

const fs = require('fs');

interface FSFile {
    name: string;
    size: number;
}

interface FSDir {
    name: string;
    files: FSFile[];
    directories: FSDir[];
    parent: FSDir;
    totalSize?: number;
}


function loadFile() {
    const file: string = fs.readFileSync('./day7/input.txt', "utf-8");
    return file.split('\n');
}

const rootDir: FSDir = {
    parent: null,
    name: '/',
    directories: [],
    files: []
}

function gotoDirectory(name, currentDir: FSDir) {
    // console.log(name);
    if (name === '/') return rootDir;
    if (name === '..') return currentDir.parent;
    return currentDir.directories.find(f => f.name === name);
}

function addDirectory(name, currentDir: FSDir) {
    currentDir.directories.push({
        parent: currentDir,
        name: name,
        files: [],
        directories: []
    });
    return currentDir;
}

function addFile(name, size, currentDir: FSDir) {
    currentDir.files.push({ name, size });
    return currentDir;
}

function processFile(commands: string[]) {
    let currentDir = rootDir;
    commands.forEach((c, index) => {
        if (c.startsWith('$')) {
            if (c.startsWith('$ cd')) {
                currentDir = gotoDirectory(c.split('$ cd')[1].trim(), currentDir);
            }
            if (c.startsWith('$ ls')) {
                const list = pipe(
                    commands.slice(index + 1, commands.length),
                    takewhile(c => !c.startsWith('$')),
                    toarray()
                );

                list.forEach(el => {
                    if (el.startsWith('dir')) addDirectory(el.split(' ')[1], currentDir);
                    else {
                        const [size, name] = el.split(' ');
                        addFile(name, parseInt(size), currentDir);
                    }
                });
            }
        }
    });
}

function calculateTotalSize(dir: FSDir) {
    if (!dir.directories || dir.directories.length === 0) {
        dir.totalSize = sum(dir.files, f => f.size);
        return dir.totalSize;
    }
    dir.totalSize = sum(dir.files, f => f.size) + sum(dir.directories.map(f => calculateTotalSize(f)));
    return dir.totalSize;
}

function getDirectoriesBelowSize(dir: FSDir, size, acc: FSDir[]) {
    if (!dir.directories || dir.directories.length === 0) {
        if (dir.totalSize <= size) {
            acc.push(dir)
        }
        return;
    }
    dir.directories.forEach(f => getDirectoriesBelowSize(f, size, acc));
    if (dir.totalSize <= size) acc.push(dir);
    return acc;
}

function getDirectoriesAboveSize(dir: FSDir, size, acc: FSDir[]) {
    if (!dir.directories || dir.directories.length === 0) {
        if (dir.totalSize >= size) {
            acc.push(dir)
        }
        return;
    }
    dir.directories.forEach(f => getDirectoriesAboveSize(f, size, acc));
    if (dir.totalSize >= size) acc.push(dir);
    return acc;
}


function calculateRound1() {
    processFile(loadFile());
    calculateTotalSize(rootDir);
    const directories = getDirectoriesBelowSize(rootDir, 100000, []);
    return sum(directories, d => d.totalSize);
}

function calculateRound2(){
    processFile(loadFile());
    calculateTotalSize(rootDir);
    const diskEmptySpace = 70000000 - rootDir.totalSize;
    const spaceToDelete = 30000000 - diskEmptySpace;
    const directories = getDirectoriesAboveSize(rootDir, spaceToDelete, []);
    return min(directories, d => d.totalSize);
}

// console.log(calculateRound1());
console.log(calculateRound2());
