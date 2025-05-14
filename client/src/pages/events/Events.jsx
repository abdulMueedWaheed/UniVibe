import { useState } from "react";
import Event from "../../components/event/Event";
import "./events.scss";
import { events } from "../../data/eventsData";

const Events = () => {
    // State for search
    const [search, setSearch] = useState("");
    const [tag, setTag] = useState("none");


    // TEMPORARY DATA
    const tags = ["none", "art", "sports", "music", "tech", "coding", "prizes", "culture", "competition", "entrepreneurship", "business", "workshop", "books", "poetry", "literature", "community", "photography", "science"];
  
    const parseEventDate = (timing) => {
        // Handle single day events
        if (!timing.includes('-')) {
            return new Date(timing.trim());
        }

        // For events with a range, take the start date.
        const startDate = timing.split("-")[0].trim();
        return new Date(startDate);
    }

    return (
        <div className='events'>
            <div className="container">
                <div className="filter-bar">
                    <div className="search-bar">
                        <input type="text" placeholder='Find Event...' onChange={(e) => { setSearch(e.target.value) }} />
                        <button>Find</button>
                    </div>
                    <div className="filter-dropdown">
                        <div>Filter By</div>
                        <span>Tag:</span>
                        <select onChange={(e)=> setTag(e.target.value)} id="filters">
                            {tags.map(tagItem => (
                                <option value={tagItem}>{tagItem}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="event-list">
                    {events.filter(event => (
                        search.trim() === '' || event.name.toLowerCase().includes(search.toLowerCase())
                    )).filter(event => (
                        tag === "none" || event.tags.some(tagItem => tagItem === tag)
                    )).sort((a,b) => {
                        // parse dates
                        const dateA = parseEventDate(a.timing);
                        const dateB = parseEventDate(b.timing);

                        // sort in ascending order (by date)
                        return dateA - dateB;
                    }).map(event => (
                        <Event key={event.id} event={event}/>
                    ))}
                    {console.log(tag)}
                </div>
            </div>
        </div>
    )
}

export default Events;