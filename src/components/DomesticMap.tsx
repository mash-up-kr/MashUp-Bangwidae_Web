// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect } from 'react';
import { select, geoMercator, easeElastic } from 'd3';
import { geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Ward } from 'pages/MyWard';
import koreaMap from 'public/mapData/provinces-geo.json';
import Flex from '@/src/components/Flex';

const MARKER = {
  TRANSITION: {
    OFFSET: 30,
    DURATION: 2000,
  },
  IMG_PATH: 'images/marker.svg',
};

interface DomesticMapProps {
  wardList: Ward[];
}

function DomesticMap({ wardList }: DomesticMapProps) {
  useEffect(() => {
    if (wardList) {
      select('.d3').selectAll('*').remove();
      createSvgMap(wardList);
    }
  }, [wardList]);

  return (
    <Flex justify="center" align="center" style={{ width: '100%', height: 'calc(100vh - 360px)' }}>
      <div className="d3" />
    </Flex>
  );
}

function createSvgMap(wardList) {
  const MAP_WIDTH = document.documentElement.clientWidth;
  const MAP_HEIGHT = document.documentElement.clientHeight;
  const topology = koreaMap;
  const topologyObjects = koreaMap.objects['provinces-geo'];
  const geoJson = feature(topology, topologyObjects);

  const createSvgElement = () => {
    const svg = select('.d3')
      .append('svg')
      .attr('width', MAP_WIDTH)
      .attr('height', MAP_HEIGHT)
      .style('fill', '#252525')
      .style('stroke', '#8f8f8f')
      .style('stroke-width', '0.25');
    const map = svg.append('g');
    return [svg, map];
  };

  const projectSphereOntoPlane = () => {
    const projection = geoMercator().scale(1).translate([0, 0]);
    const path = geoPath().projection(projection);
    const bounds: Bounds = path.bounds(geoJson);
    return [projection, path, bounds];
  };

  const calculateScale = (bounds) => {
    const widthScale = (bounds[1][0] - bounds[0][0]) / MAP_WIDTH;
    const heightScale = (bounds[1][1] - bounds[0][1]) / MAP_HEIGHT;
    return 1 / Math.max(widthScale, heightScale);
  };

  const calculateOffset = (bounds) => {
    const xOffset = MAP_WIDTH / 2 - (scale * (bounds[1][0] + bounds[0][0])) / 2 + 10;
    const yOffset = MAP_HEIGHT / 2 - (scale * (bounds[1][1] + bounds[0][1])) / 2 + 80;
    return [xOffset, yOffset];
  };

  const [svg, map] = createSvgElement();
  const [projection, path, bounds] = projectSphereOntoPlane();
  const scale = calculateScale(bounds);
  const [xOffset, yOffset] = calculateOffset(bounds);
  projection.scale(scale).translate([xOffset, yOffset]);

  map.selectAll('path').data(geoJson.features).enter().append('path').attr('d', path);

  svg
    .append('g')
    .selectAll('svg')
    .data(wardList)
    .enter()
    .append('svg:image')
    .attr('width', 20)
    .attr('height', 20)
    .attr('x', (d) => projection([d.longitude, d.latitude])[0])
    .attr('y', (d) => projection([d.longitude, d.latitude])[1] - MARKER.TRANSITION.OFFSET)
    .attr('xlink:href', MARKER.IMG_PATH)
    .transition()
    .ease(easeElastic)
    .duration(MARKER.TRANSITION.DURATION)
    .attr('y', (d) => projection([d.longitude, d.latitude])[1]);
}

export default DomesticMap;
