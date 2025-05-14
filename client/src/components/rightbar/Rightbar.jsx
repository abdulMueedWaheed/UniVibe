import React, { useState } from 'react'
import './rightbar.scss'
import { Link } from 'react-router-dom'
import { events } from '../../data/eventsData'
import { societies } from '../../data/societiesData'

const Rightbar = () => {
  const [subscriptions, setSubscriptions] = useState({});
  const [ignores, setIgnores] = useState({});

  const handleSubscription = (societyId) => {
    setSubscriptions((prev) => ({
      ...prev,
      [societyId]: !prev[societyId]
    }));
  }

  const handleIgnore = (societyId) => {
    setIgnores((prev) => ({
      ...prev,
      [societyId]: true
    }));
  }

  return (
    <div className='rightbar'>
      <div className="container">
        <div className="item">
          <div className="header">
            <span>Suggestions For You</span>
            <Link to="/societies"><span>Show All</span></Link>
          </div>
          {societies
            .slice(0, 4)
            .filter(society => !ignores[society.id])
            .map(society => (
              <div className="entity" key={society.id}>
                <div className="entity-info">
                  <Link to={`/profile/${society.id}`}>
                    <img src={society.logo} alt={society.name} />
                    <span>{society.name}</span>
                  </Link>
                </div>
                <div className="buttons">
                  <button 
                    className={subscriptions[society.id] ? "subscribed" : ""} 
                    onClick={() => handleSubscription(society.id)}
                  >
                    {subscriptions[society.id] ? "Subscribed" : "Subscribe"}
                  </button>
                  {subscriptions[society.id] ? null : (
                    <button onClick={() => handleIgnore(society.id)}>Ignore</button>
                  )}
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