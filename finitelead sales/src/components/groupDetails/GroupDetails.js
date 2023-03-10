import React from 'react'
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'

function GroupDetails({ selectedGroup, setGroupDetails }) {
  return (
    <div className='popup'>
        <div className="overlay"></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h4">Details</CardTitle>
                <RxCross1 onClick={()=> setGroupDetails(false)}/>
            </CardHeader>
            <CardBody>
                <div className='group-details'>
                    <h6>Admin: </h6>
                    <p>{selectedGroup.groupadmin_name}</p>
                </div>
                <div className='group-details'>
                    <h6>Members:</h6>
                    <div className='members'>
                        {selectedGroup.users.map((user)=>{
                            if(user._id !== selectedGroup.groupadmin_id)
                                return <p key={user._id}>{user.name}</p>
                        })}
                    </div>
                </div>
                <div className='group-details'>
                    <h6>Created at:</h6>
                    <p>{selectedGroup.create_at}</p>
                </div>
            </CardBody>
        </Card>
    </div>
  )
}

export default GroupDetails