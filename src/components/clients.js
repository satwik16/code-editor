import React from 'react'
import Avatar from 'react-avatar'
import "./app.css"
const Clients = ({username}) => {
  return (
    <div className = "client">
      <Avatar  name = {username} size = {40} round = "14px"/>
       <span className = "username">{username}</span>

    </div>
  )
}

export default Clients