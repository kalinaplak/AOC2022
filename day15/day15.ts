import * as fs from 'fs';
import { distinct } from 'powerseq';

type Point = [number, number];

interface Sensor {
    sensor: Point;
    beacon: Point;
}
function loadFile() {
    return fs.readFileSync('./day15/input.txt', 'utf-8')
        .split('\n')
        .map((line) => {
            line = line.replace('Sensor at ', '');
            const [s, b] = line.split(': closest beacon is at ');
            const [sx, sy] = s.split(', ');
            const [bx, by] = b.split(', ');
            const sensorX = parseInt(sx.replace('x=', ''));
            const sensorY = parseInt(sy.replace('y=', ''));
            const beaconX = parseInt(bx.replace('x=', ''));
            const beaconY = parseInt(by.replace('y=', ''));
            return { sensor: [sensorX, sensorY], beacon: [beaconX, beaconY] } as Sensor;
        });
}

function calculateDistance([xFrom, yFrom]: Point, [xTo, yTo]: Point) {
    return Math.abs(xFrom - xTo) + Math.abs(yFrom - yTo);
};

function calculateRound1() {
    const points = [];
    const sensors = loadFile();
    const resultY = 2000000;
    sensors.forEach(s => {
        const manhattanDistance = calculateDistance(s.sensor, s.beacon);
        const [sensorX, sensorY] = s.sensor;
        if ((sensorY - manhattanDistance) <= resultY && resultY <= (sensorY + manhattanDistance)) {
            const distanceLeft = manhattanDistance - Math.abs(resultY - sensorY);
            for (let x = (sensorX - distanceLeft); x <= (sensorX + distanceLeft); x++) {
                points.push([x, resultY]);
            }
        }
    });
    const filteredPoints = points.filter(p => !sensors.find(s => s.beacon[0] === p[0] && s.beacon[1] === p[1]))
    return [...distinct(filteredPoints.map(p => p[0] + ',' + p[1]))].length;
}

console.log(calculateRound1());