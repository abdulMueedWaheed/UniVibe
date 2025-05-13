import "./event.scss";

const Event = ({ event }) => {
  return (
    <div className="event">
      <div className="container">
        <img src={event.img} alt="Event" />
        <div className="right">

          <div className="event-info">
            <span className="event-name">{event.name}</span>
            <span className="society-name">by {`Society Name`}</span>
          </div>

          <div className="desc-info">
            <p>{event.description}</p>
            <span>{event.timing}</span>
          </div>

          <div className="tags-horizontal">
            {event.tags.map(tag => (
              <div key={tag} className="tag">{tag}</div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Event