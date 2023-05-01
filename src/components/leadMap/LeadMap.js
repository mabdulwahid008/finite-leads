import React, { useCallback, useEffect, useRef, useState } from 'react';
import L from 'mapbox.js';
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { toast } from 'react-toastify';
import LeadAssignConfirmation from 'components/leadAssignConfirmation/LeadAssignConfirmation';

const leadMArker = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWFiZHVsd2FoaWQwMDgiLCJhIjoiY2xnbnlpYnVpMGN0dTNrcDkyZ3oxZWZjcSJ9.ga70btg357fC1KB2seVdHA';
L.mapbox.accessToken =  MAPBOX_ACCESS_TOKEN;


function LeadMap({lead_id, street, zipcode, state}) {
  const map = useRef()
  const agentCircleRef = useRef()
  const agentAreasCircleRef = useRef()

  const [selectedAgent, setSelectedAgent] = useState(null)
  const [reAgents, setREAgents] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmAssignPopup, setConfirmAssignPopup] = useState(false)



  const checkBeforeAssign = async() => {
    setLoading(true)
    if(!selectedAgent){
      setLoading(false)
      return toast.error('Select an Real Estate Agent')
    }

    const response = await fetch(`/lead/getLeads/${selectedAgent._id}`,{
      method: 'GET',
      headers:{
        'Content-Type' : 'Application/json',
        token: localStorage.getItem('token')
      }
    })
    const res = await response.json()
    if(response.status === 200){
      console.log(res.length);
      if(res.length >= 1){
        setConfirmAssignPopup(true)
      }
      else{
        assignLead()
      }
    }
    else{
      console.log("here");
      toast.error(res.message)
    }
    setLoading(false)
  }

  const assignLead = async () => {
    setConfirmAssignPopup(false)

    const response = await fetch(`/lead/assign`,{
      method: 'POST',
      headers:{
        'Content-Type' : 'Application/json',
        token: localStorage.getItem('token')
      },
      body: JSON.stringify({lead_id : lead_id, agent_id : selectedAgent._id})
    })
    const res = await response.json()
    if(response.status === 200)
      toast.success(res.message)
    else
      toast.error(res.message)

     // removing areas of previous selected agent
     if(agentAreasCircleRef.current){
      agentAreasCircleRef.current.forEach(circle => circle.remove());
    }
    // removing previous selected agent
    if(agentCircleRef.current){
      agentCircleRef.current.remove()
      setSelectedAgent(null)
    }
  }

  const getLatLongFromAddress = async(street, state, zipcode) => {
    
    const address = `${street} ${state} ${zipcode}`

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
 
    const response = await fetch(url, {
      method: 'GET'
    })
    const data = await response.json()

    const [long, lat] = data.features[2].center;
    
    return ([lat, long])
  }

  const fetchRealEstateAgents = async() => {
    const response = await fetch(`/user/2`,{
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        token: localStorage.getItem('token')
      }
    })
    const res = await response.json()
    if(response.status === 200){ 
      setREAgents(res)
    }
    else
        toast.error(res.message)
  }
  
  const pinREAgnets = async() => {
    for(let i = 0; i < reAgents.length; i++){
      const [lat, long] = await getLatLongFromAddress(reAgents[i].address, reAgents[i].state, reAgents[i].zip_code);
      const marker = L.marker([lat, long]).addTo(map.current);
      marker.on('click', () => handleMarkerClick(reAgents[i]._id, lat, long));
      marker.bindPopup(reAgents[i].name.split(' ')[0]);
    }
  }
  
  const handleMarkerClick = async(agentId, lat, long) => {
    // removing areas of previous selected agent
    if(agentAreasCircleRef.current){
      agentAreasCircleRef.current.forEach(circle => circle.remove());
    }
    // removing previous selected agent
    if(agentCircleRef.current){
      agentCircleRef.current.remove()
      setSelectedAgent(null)
    }

    // getting agent data
    const agent = reAgents.filter((agent)=> agent._id === agentId)

    agentCircleRef.current = L.circle([lat, long], {
      radius: agent[0].service_radius * 1609.34, 
    }).addTo(map.current);
    
    // for assigning lead for assign lead btn
    setSelectedAgent(agent[0])
    
    // for agent areas 
    let circles = []

    let areas = agent[0].service_areas.split(' | ')

    for (let i = 0; i < areas.length; i++) {
      let area = areas[i].split(',')
      let lat = parseFloat(area[0].replace('[', ''))
      let long = parseFloat(area[1].replace(']', ''))

      let newCircle = L.circle([lat, long], {
        radius: agent[0].service_radius * 1609.34, 
        color: 'red'
      }).addTo(map.current);
      circles.push(newCircle)
    }
    agentAreasCircleRef.current = circles
  }

  const loadMap = (lat, long) => {
    map.current = L.mapbox.map('map')
      .setView([lat, long], 7)
      .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
    L.marker([lat, long],  { icon: leadMArker }).addTo(map.current);

    return () => map.current.remove();
  }

  useEffect(()=>{
    if(reAgents)
      pinREAgnets()
  }, [reAgents])

  useEffect(() => {
    let cleanupFunction;
    const loadMapAndReturnCleanupFunction = async () => {
      const [lat, long] = await getLatLongFromAddress(street, state, zipcode);
      cleanupFunction = loadMap(lat, long); // save the cleanup function
      fetchRealEstateAgents();
    };
    loadMapAndReturnCleanupFunction();
  
    // return a function that calls the cleanup function
    return () => {
      if (typeof cleanupFunction === 'function') {
        cleanupFunction();
      }
    };
  }, []);
  

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Assign Lead</CardTitle>
        <Button disabled={loading? true : false} onClick={checkBeforeAssign}>Assign Lead</Button>
      </CardHeader>
      <CardBody>
        <div id="map" style={{height: 500, width: '100%', borderRadius:10 }}></div>
      </CardBody>
    </Card>
    {confirmAssignPopup && <LeadAssignConfirmation agentName={selectedAgent.name} assignLead={assignLead} setConfirmAssignPopup={setConfirmAssignPopup}/>}
    </>
  )
}

export default LeadMap;

