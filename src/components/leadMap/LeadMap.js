import React, { useEffect } from 'react';
import L from 'mapbox.js';
import { Card } from 'reactstrap';

function Mapbox() {
  useEffect(() => {
    L.mapbox.accessToken =
      'pk.eyJ1IjoibWFiZHVsd2FoaWQwMDgiLCJhIjoiY2xnbnlpYnVpMGN0dTNrcDkyZ3oxZWZjcSJ9.ga70btg357fC1KB2seVdHA';
    const map = L.mapbox.map('map')
      .setView([31.939198, 72.628899], 9)
      .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
    return () => map.remove();
  }, []);

  return (
    <div className='content'>
      <Card>
        <div id="map" style={{ height: 400,
  width: '100%',
  position: 'relative',
  margin: '0 auto', }}>
        </div>
      </Card>

    </div>
  );
}

export default Mapbox;

