import React, { useState, useEffect } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { v4 } from 'uuid';

const [KR_POS_X, KR_POS_Y] = [127, 37.6];
const [ANGLES_X, ANGLES_Y, ANGLES_Z] = [-10, 1, 0];
const MAP_SCALE = 360;
const PROJECTION_SCALE = MAP_SCALE * 10;
const MAP_DATA_PATH = '/mapData/provinces-geo.json';

function DomesticMap() {
  const [geographies, setGeographies] = useState<[] | Array<Feature<Geometry | null>>>([]);

  const projection = geoMercator()
    .scale(PROJECTION_SCALE)
    .rotate([ANGLES_X, ANGLES_Y, ANGLES_Z])
    .center([KR_POS_X, KR_POS_Y]);

  const getGeoPath = (d: Feature<Geometry | null>) =>
    geoPath().projection(projection)(d) || undefined;

  useEffect(() => {
    const fetchGeographies = async () => {
      const response = await fetch(MAP_DATA_PATH);
      const worldData = await response.json();
      const mapFeatures: Array<Feature<Geometry | null>> = (
        feature(worldData, worldData.objects['provinces-geo']) as unknown as FeatureCollection
      )?.features;
      setGeographies(mapFeatures);
    };

    fetchGeographies().then();
  }, [geographies]);

  return (
    <svg width={MAP_SCALE} height={MAP_SCALE} viewBox="-250 200 360 480">
      <g>
        {geographies?.map((d) => (
          <path key={v4()} d={getGeoPath(d)} fill="#252525" stroke="#8F8F8F" strokeWidth={0.25} />
        ))}
      </g>
    </svg>
  );
}

export default DomesticMap;
