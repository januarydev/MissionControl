import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { Topology, Point } from 'topojson-specification';
import worldJson from '../assets/world.json';
import { Constants } from '../types/Constants';

interface MappingProps {
  data: [number, number, number][];
}

export function Mapping(props: MappingProps) {
  const groundLines: GeoJSON.LineString = {
    type: "LineString",
    coordinates: props.data
  };

  const graticule = d3.geoGraticule10();
  const world = topojson.feature(
    (worldJson as unknown) as Topology,
    (worldJson.objects.land as unknown) as Point<GeoJSON.GeoJsonProperties>
  );
  let projection = d3.geoEquirectangular();
  projection = projection.fitWidth(100, world);

  const geoGenerator = d3.geoPath(projection);
  const bounds = geoGenerator.bounds({type: 'Sphere'});
  const height = Math.floor(bounds[1][1] - bounds[0][0]);

  return (
    <div className="MappingContainer">
      <svg className="Mapping" viewBox={`0 0 100 ${height}`}>
        <path fill={Constants.mapCountryFillColor} stroke={Constants.mapCountryStrokeColor} strokeWidth={0.1} d={geoGenerator(world)!}/>
        <path fill="none" stroke={Constants.mapGraticuleStrokeColor} strokeWidth={0.05} d={geoGenerator(graticule)!}/>
        <path fill="none" stroke={Constants.mapOrbitStrokeColor} strokeWidth={0.2} d={geoGenerator(groundLines)!}/>
      </svg>
      <div className="MappingSubtitle">
        Longitude: {props.data[props.data.length - 1][0].toFixed(3)} deg, Latitude: {props.data[props.data.length - 1][1].toFixed(3)} deg [{props.data.length} points]
      </div>
    </div>
  );
}
