import React from 'react'
import loading from '../../assets/img/loading.gif'

function Loading() {
  return (
    <div>
        <img src={loading} alt="loading" style={{width: '30px', height:'30px', marginBottom: '10px'}}/>
    </div>
  )
}

export default Loading