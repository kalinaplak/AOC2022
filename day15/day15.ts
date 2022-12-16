import * as fs from 'fs';
import { filter, map, orderby, pipe, toarray } from 'powerseq';

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

/* 2 */
function getRowIntervals(sensors: Sensor[], row: number): { from: number, to: number }[] {
    return pipe(
        sensors,
        map(({ sensor, distance }) => {
            const [sX, sY] = sensor;
            const rowDistance = Math.abs(sY - row);
            if (rowDistance > distance) {
                return;
            }
            return { from: sX - (distance - rowDistance), to: sX + (distance - rowDistance) }
        }),
        filter(s => !!s),
        orderby(s => s.from),
        toarray()
    )
}

function joinLinesIfPossible([newFrom, newTo], [previousFrom, previousTo]) {
    return (newFrom > previousTo)
        ? [[previousFrom, previousTo], [newFrom, newTo]]
        : [[Math.min(newFrom, previousFrom), Math.max(newTo, previousTo)]]
}

function processLine(sensors, row) {
    const rowIntervals = getRowIntervals(sensors, row);
    return rowIntervals.reduce((acc, curr) => {
        if (acc.length === 0) return [[curr.from, curr.to]];
        return [...acc.slice(0, acc.length - 1), ...joinLinesIfPossible([curr.from, curr.to], acc[acc.length - 1])]
    }, []);
}

function calculateRound2() {
    const sensors = loadFile();
    const max = 4000000;
    for (let i = 0; i < max; i++) {
        const rowIntervals = processLine(sensors, i);
        if (rowIntervals.length > 1) {
            const gapX = rowIntervals[0][1] + 1;
            return (gapX * max) + i;
        }
    }
}

console.log(calculateRound1());
console.log(calculateRound2());