import React from 'react'
import loading from '../../assets/img/loading.gif'

function Loading() {
  return (
    <div>
        <img src={loading} alt="loading" style={{width: '50px', height:'50px', padding: '10px'}}/>
    </div>
  )
}

export default Loading