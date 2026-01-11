import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { Topology, Point } from 'topojson-specification';
import worldJson from '../assets/world.json';
import { useState } from 'react';
import { Constants } from '../types/Constants';

interface OrbitVisProps {
  data: [number, number, number][];
}

function wrapMax(x: number, max: number) {
  return (max + (x % max)) % max;
}

function wrap(min: number, max: number, x: number) {
  return min + wrapMax(x - min, max - min);
}

function limit(min: number, max: number, x: number) {
  return Math.max(min, Math.min(max, x));
}

interface SortedLines {
  FrontFacing: [number, number, number][][];
  BackFacing: [number, number, number][][];
}

function sortLines(lines: [number, number, number][], rotation: [number, number]) {
  const rv: SortedLines = {
    FrontFacing: [],
    BackFacing: []
  };

  if (lines.length === 0) {
    return rv;
  }

  const sorted = lines.map(pt => {
    const angLong = wrap(-180.0, 180.0, pt[0] + rotation[0]);
    const angLat = limit(-90.0, 90.0, pt[1] + rotation[1]);
    return {
      pt: pt,
      isBackFacing: angLong <= -90.0 || angLong >= 90.0 || angLat <= -90.0 || angLat >= 90.0
    };
  });
  const sortedWithBreaks = sorted.map((pt, index, array) => {
    const isBreak = array[index - 1] ? (array[index - 1].isBackFacing !== pt.isBackFacing) : true;
    return {
      pt: pt.pt,
      isBackFacing: pt.isBackFacing,
      isBreak: isBreak
    };
  });

  let workingLine: [number, number, number][] = [];
  let workingBackFacing = sortedWithBreaks[0].isBackFacing;
  for (let x = 0; x < sortedWithBreaks.length; ++x) {
    const entry = sortedWithBreaks[x];
    if (entry.isBreak) {
      let lastPt : null | [number, number, number] = null;
      if (workingLine.length > 0) {
        lastPt = workingLine[workingLine.length - 1];
        if (workingBackFacing) {
          rv.BackFacing.push(workingLine);
        }
        else {
          rv.FrontFacing.push(workingLine);
        }
      }
      if (lastPt) {
        workingLine = [lastPt, entry.pt];
      }
      else {
        workingLine = [entry.pt];
      }
      workingBackFacing = entry.isBackFacing;
    }
    else {
      workingLine.push(entry.pt);
    }
  }

  if (workingLine.length > 0) {
    if (workingBackFacing) {
      rv.BackFacing.push(workingLine);
    }
    else {
      rv.FrontFacing.push(workingLine);
    }
  }

  return rv;
}

let lastMaskId = 0;

export function OrbitVis(props: OrbitVisProps) {
  const graticule = d3.geoGraticule10();
  const world = topojson.feature(
    (worldJson as unknown) as Topology,
    (worldJson.objects.land as unknown) as Point<GeoJSON.GeoJsonProperties>
  );
  let projection = d3.geoOrthographic();
  const [rotation, setRotation] = useState<[number, number]>([0, 0]);
  projection = projection.fitWidth(100, world).rotate(rotation);

  const geoGenerator = d3.geoPath(projection);
  const bounds = geoGenerator.bounds({type: 'Sphere'});
  const height = Math.floor(bounds[1][1] - bounds[0][0]);

  const defaultScale = projection.scale();

  const earthSphereOfInfluenceMeters = 925000000;
  const earthRadiusMeters = 6371000;
  const highestElevation = props.data.map(pt => pt[2])
    .reduce((prev, curr) => Math.min(Math.max(prev, curr), earthSphereOfInfluenceMeters));

  const earthScalar = 0.9 * (earthRadiusMeters / (earthRadiusMeters + highestElevation));
  projection = projection.scale(defaultScale * earthScalar);

  const rotateSpeed = 1.0;

  const lineGenerator = d3
    .line()
    .curve(d3.curveCatmullRom.alpha(0.5));

  const sortedLines = sortLines(props.data, rotation);

  const project3D = (pt: [number, number, number]) => {
    const projected = projection([pt[0], pt[1]]);

    if (!projected) {
      return null;
    }

    const halfWidth = 50.0;
    const halfHeight = height / 2.0;
    const earthWidth = halfWidth * earthScalar;
    const earthHeight = halfHeight * earthScalar;
    const dx = (projected[0] - halfWidth) / earthWidth;
    const dy = (projected[1] - halfHeight) / earthHeight;
    
    const orbitZ = (pt[2] + earthRadiusMeters) / earthRadiusMeters * earthWidth;

    const rv: [number, number] = [
      dx * orbitZ + halfWidth,
      dy * orbitZ + halfHeight
    ];
    return rv;
  };
  const maskId = `orbitviz-mask${lastMaskId++}`;

  const frontFacingLines: [number, number][][] = sortedLines.FrontFacing.map(l => l.map(project3D).filter(pt => pt !== null));
  const backFacingLines: [number, number][][] = sortedLines.BackFacing.map(l => l.map(project3D).filter(pt => pt !== null));
  return (
    <svg onMouseMove={e => {
      if (e.buttons == 1) {
        e.preventDefault();
        setRotation([
          wrap(-180.0, 180.0, rotation[0] + e.movementX * rotateSpeed),
          limit(-90.0, 90.0, rotation[1] - e.movementY * rotateSpeed * 0.5)
        ]);
      }
    }} className="OrbitVis" viewBox={`0 0 100 ${height}`}>
      <defs>
        <mask id={maskId} x="0" y="0" width="100" height={height}>
          <rect width="100" height={height} fill="white"/>
          <path fill="black" d={geoGenerator({type: 'Sphere'})!}/>
        </mask>
      </defs>
      <path id="outline" fill="none" stroke={Constants.mapWorldOutlineColor} strokeWidth={0.2} d={geoGenerator({type: 'Sphere'})!}/>
      <path fill={Constants.mapCountryFillColor} stroke={Constants.mapCountryStrokeColor} strokeWidth={0.1} d={geoGenerator(world)!}/>
      <path fill="none" stroke={Constants.mapGraticuleStrokeColor} strokeWidth={0.05} d={geoGenerator(graticule)!}/>
      {frontFacingLines.map((l, i) => <path key={i} fill="none" stroke={Constants.mapOrbitStrokeColor} strokeWidth={Constants.mapOrbitWidth} d={lineGenerator(l)!}/>)}
      {backFacingLines.map((l, i) => <path key={i} mask={`url(#${maskId})`} fill="none" stroke={Constants.mapOrbitStrokeColor} strokeWidth={Constants.mapOrbitWidth} d={lineGenerator(l)!}/>)}
    </svg>
  );
}

