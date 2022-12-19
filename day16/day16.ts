import * as fs from 'fs';
import { filter, map, orderbydescending, pipe, take, toarray, toobject } from 'powerseq';
import { Dictionary } from 'powerseq/common/types';

interface Valve {
    name: string;
    flowRate: number;
    tunnelsNames: string[];
}

interface Path {
    currentValve: string;
    destinationValves: string[];
    minutesLeft: number;
    finalScore: number;
    isFinished: boolean;
}

function loadFile() {
    return pipe(
        fs.readFileSync('./day16/input.txt', 'utf-8').split('\n'),
        map((line) => {
            const [valveLine, tunnelsLine] = line.split(';');
            const [fullname, flowRateString] = valveLine.split(' has flow rate=');
            const tunnels = tunnelsLine.indexOf('tunnels lead to valves ') !== -1
                ? tunnelsLine.split('tunnels lead to valves ')[1].split(', ')
                : tunnelsLine.split('tunnel leads to valve ')[1].split(', ')
            return {
                name: fullname.split('Valve ')[1],
                flowRate: parseInt(flowRateString),
                tunnelsNames: tunnels
            } as Valve
        }),
        toarray()
    );
}

function getMoveCostDict(start: Valve, valvesDict: Dictionary<Valve>, destinations: Valve[]): Dictionary<number> {
    const visited: string[] = [];
    const toVisit = [start];
    const lowestCost = { [start.name]: 0 };

    while (toVisit.length > 0) {
        const currentValve = toVisit.shift();
        if (visited.indexOf(currentValve.name) === -1) {
            const neighbours = pipe(
                currentValve.tunnelsNames,
                filter(neighbour => visited.indexOf(neighbour) === -1),
                map(neighbour => valvesDict[neighbour]),
                toarray()
            );
            toVisit.push(...neighbours);

            const currentMoveCost = lowestCost[currentValve.name];

            neighbours.forEach(neighbour => {
                const newCostToNeighbour = currentMoveCost + 1;
                const costToNeighbour = lowestCost[neighbour.name] ?? newCostToNeighbour;
                if (newCostToNeighbour <= costToNeighbour) {
                    lowestCost[neighbour.name] = newCostToNeighbour;
                }
            });

            visited.push(currentValve.name);
        }
    }
    return toobject(destinations, valve => valve.name, valve => lowestCost[valve.name])
};

function getBestPath(initialPath: Path, valvesDict: Dictionary<Valve>, valvesMoveCostDict) {
    const paths = [initialPath];
    for (let path of paths) {
        if (path.minutesLeft <= 0 || path.isFinished) {
            path.isFinished = true;
        } else {
            const currentMoveCost = valvesMoveCostDict[path.currentValve];
            const nextPaths = pipe(
                path.destinationValves,
                filter(valve => valve !== path.currentValve && path.minutesLeft - currentMoveCost[valve] > 1),
                map(valve => ({
                    currentValve: valve,
                    destinationValves: path.destinationValves.filter(v => v !== valve),
                    minutesLeft: path.minutesLeft - currentMoveCost[valve] - 1,
                    finalScore: path.finalScore + (path.minutesLeft - currentMoveCost[valve] - 1) * valvesDict[valve].flowRate,
                    isFinished: false
                })),
                toarray()
            );
            if (nextPaths.length === 0)
                path.isFinished = true;

            paths.push(...nextPaths);
        }
    }

    return pipe(
        paths,
        filter(p => p.isFinished),
        orderbydescending(p => p.finalScore),
        take(1),
        toarray()
    )[0];

};

function calculateRound1() {
    const valves: Valve[] = loadFile();
    const valvesDict: Dictionary<Valve> = toobject(valves, v => v.name);
    const startingValveName = 'AA';
    const startingValve = valvesDict[startingValveName];
    const startingValves = [startingValve, ...valves.filter(valve => valve.flowRate !== 0)];
    const destinationValves = valves.filter(valve => valve.flowRate !== 0);

    const valvesMoveCostDict = toobject(
        startingValves,
        valve => valve.name,
        valve => getMoveCostDict(valve, valvesDict, destinationValves.filter(v => v.name !== valve.name))
    );
    const initialPath: Path = {
        currentValve: startingValveName,
        destinationValves: destinationValves.map(r => r.name),
        minutesLeft: 30,
        finalScore: 0,
        isFinished: false
    };
    return getBestPath(initialPath, valvesDict, valvesMoveCostDict).finalScore;
}
console.log(calculateRound1());