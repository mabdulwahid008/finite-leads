import React, { useState } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { RxCross1 } from 'react-icons/rx'

function ViewAnnouncement({ announcement, setAnnouncementPopup }) {
    const [current, setCurrent] = useState(0)
    const next = () =>{
        setCurrent(current === announcement.length - 1 ? 0 : current + 1)
    }
    const prev = () =>{
        setCurrent(current === 0 ? announcement.length - 1  : current - 1)
    }

  return (
    <div className='popup'>
      <div className='overlay slider-overlay'>
       <RxCross1 style={{color:'white', zIndex:999, fontSize: 20,position:'absolute', right: '10%', top:'6%'}} onClick={()=>setAnnouncementPopup(false)}/>    

      </div>
      <div className='slider-popup'>
        {announcement.length > 0 && <FiArrowLeft onClick={prev}/>}
            {announcement.map((announce, index)=> {
            if(index === current)
              return <img src={`${process.env.REACT_APP_IMAGE_URL}/${announce.image}`} style={{width:'85%', zIndex:999, borderRadius:5}}/>
            })}
        {announcement.length > 0 && <FiArrowRight onClick={next}/>}
      </div>
    </div>
  )
}

export default ViewAnnouncement
