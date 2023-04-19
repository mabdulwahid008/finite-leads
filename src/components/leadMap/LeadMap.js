import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import ReactMapGL from 'react-map-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFiZHVsd2FoaWQwMDgiLCJhIjoiY2xnbzBsamkxMDFiZzNlbXZxaGlkdG5tZCJ9.fjlXr72SGHstXogWaLPd4A'

function LeadMap() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    const [viewport, setViewport] = useState({
        latitude:42.35,
        longitude:-70.9,
        width: '100vw',
        height: '400px',
        zoom: 10
    })


  return (
    <div>
        {/* <ReactMapGL {...viewport} mapboxApiAccessToken='pk.eyJ1IjoibWFiZHVsd2FoaWQwMDgiLCJhIjoiY2xnbzBsamkxMDFiZzNlbXZxaGlkdG5tZCJ9.fjlXr72SGHstXogWaLPd4A'
        ></ReactMapGL> */}
        <div ref={mapContainer} className="map-container" style={{height: 400,}}/>
    </div>
  )
}

export default LeadMap