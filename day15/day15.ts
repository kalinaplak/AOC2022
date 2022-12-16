import * as fs from 'fs';

type Point = [number, number];

interface Sensor {
    sensor: Point;
    beacon: Point;
    distance: number;
}

function loadFile() {
    return fs.readFileSync('./day15/input.txt', 'utf-8')
        .split('\n')
        .map((line) => {
            line = line.replace('Sensor at ', '');
            const [s, b] = line.split(': closest beacon is at ');
            const [sx, sy] = s.split(', ');
            const [bx, by] = b.split(', ');
            const sensor = [parseInt(sx.replace('x=', '')), parseInt(sy.replace('y=', ''))] as Point;
            const beacon = [parseInt(bx.replace('x=', '')), parseInt(by.replace('y=', ''))] as Point;
            return { sensor, beacon, distance: calculateDistance(sensor, beacon) } as Sensor;
        });
}

function calculateDistance([xFrom, yFrom]: Point, [xTo, yTo]: Point) {
    return Math.abs(xFrom - xTo) + Math.abs(yFrom - yTo);
};

function calculateRound1() {
    const sensors = loadFile();
    const resultY = 2000000;
    const points = new Set();

    sensors.forEach(s => {
        if ((s.sensor[1] - s.distance) <= resultY && resultY <= (s.sensor[1] + s.distance)) {
            const distanceLeft = s.distance - Math.abs(resultY - s.sensor[1]);
            for (let i = s.sensor[0] - distanceLeft; i <= s.sensor[0] + distanceLeft; i++) {
                points.add(i);
            }
        }
    }) 

    sensors.forEach(s => {
        if (s.beacon[1] === resultY)
            points.delete(s.beacon[0]);
    });

    return points.size;
}

console.log(calculateRound1());