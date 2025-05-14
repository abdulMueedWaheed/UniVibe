import React from 'react'
import './rightbar.scss'
import { Link } from 'react-router-dom'
import { events } from '../../data/eventsData'
import { societies } from '../../data/societiesData'
// import Button from '@mui/material/Button'
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';

const Rightbar = () => {
  

  return (
    <div className='rightbar'>
      <div className="container">
        <div className="item">
          <div className="header">
            <span>Suggestions For You</span>
            <Link><span>Show All</span></Link>
          </div>
          {societies.map(society => (
            <div className="entity" key={society.id}>
              <div className="entity-info">
                <Link to={`/profile/${society.id}`}>
                  <img src={society.img} alt={society.name} />
                  <span>{society.name}</span>
                </Link>
              </div>
              <div className="buttons">
                <button>Subscribe</button>
                <button>Ignore</button>
              </div>
            </div>
          ))}
        </div>

        <div className="item">
          <div className="header">
            <span>Incoming Events</span>
            <Link to="/events">
              <span>Show All</span>
            </Link>
          </div>
          {events.slice(0, 5).map(event => (
            <div className="entity" key={event.id}>
            <div className="entity-info">
                <Link to={`/events/${event.id}`}>
                  <img src={event.img} alt={event.name} />
                  <span>{event.name}</span>
              </Link>
            </div>
            <div className="date">
                {event.timing}
            </div>
          </div>
          ))}
          </div>
        </div>
      </div>
  )
}

export default Rightbar