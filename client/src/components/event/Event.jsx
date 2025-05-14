import "./event.scss";
import { societies } from "../../data/societiesData"; // Assuming you have a data file with society data


const Event = ({ event }) => {
  // Get random society name
  const getRandomSociety = () => {
    return societies[Math.floor(Math.random() * societies.length)]?.name || "Unknown Society";
  };

  return (
    <div className="event">
      <div className="container">
        <img src={event.img} alt="Event" />
        <div className="right">

          <div className="event-info">
            <span className="event-name">{event.name}</span>
            <span className="society-name">by {event.society_name}</span>
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