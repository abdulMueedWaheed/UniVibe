import { useEffect, useState } from "react";
import Event from "../../components/event/Event";
import "./events.scss";

const Events = () => {
    // State for search
    const [search, setSearch] = useState("");
    const [tag, setTag] = useState("none");


    // TEMPORARY DATA
    const tags = ["none", "art", "sports", "music", "tech", "coding", "prizes", "culture", "competition", "entrepreneurship", "business", "workshop", "books", "poetry", "literature", "community", "photography", "science"];
    const events = [
        {
            id: 1,
            img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Super Cool Hackathon",
            description: "Are you ready to shine? Join the sooper cool hackathon and win amazing prizes.",
            timing: "May 15, 2025 - May 17, 2025",
            location: "SEECS Seminar Hall",
            category: "Tech",
            society_id: 1,
            tags: ["coding", "hackathon", "prizes"],
            registration_deadline: "May 10, 2025"
        },
        {
            id: 2,
            img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Arts & Culture Exhibition",
            description: "Explore the artistic talents of our university community. Various art forms including paintings, sculptures, and photography will be on display.",
            timing: "May 20, 2025 - May 23, 2025",
            location: "CIPS",
            category: "Art",
            society_id: 2,
            tags: ["exhibition", "art", "culture"],
            registration_deadline: "May 18, 2025"
        },
        {
            id: 3,
            img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Annual Sports Gala",
            description: "The biggest sporting event of the year! Compete in various sports and represent your department.",
            timing: "June 5, 2025 - June 10, 2025",
            location: "Sports Complex",
            category: "Sports",
            society_id: 3,
            tags: ["sports", "competition", "departments"],
            registration_deadline: "May 25, 2025"
        },
        {
            id: 4,
            img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Music Festival",
            description: "A night of musical performances by student bands and solo artists. Come enjoy the rhythm and melodies!",
            timing: "June 15, 2025",
            location: "NBS Ground",
            category: "Music",
            society_id: 4,
            tags: ["music", "bands", "performances"],
            registration_deadline: "June 10, 2025"
        },
        {
            id: 5,
            img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Entrepreneurship Workshop",
            description: "Learn from successful entrepreneurs and gain insights into starting your own business venture.",
            timing: "June 22, 2025",
            location: "NBS Auditorium",
            category: "Business",
            society_id: 5,
            tags: ["entrepreneurship", "business", "workshop"],
            registration_deadline: "June 15, 2025"
        },
        {
            id: 6,
            img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Robotics Competition",
            description: "Showcase your robotics skills and compete with teams from other universities for amazing prizes.",
            timing: "July 5, 2025 - July 6, 2025",
            location: "SEECS Robotics Lab",
            category: "Tech",
            society_id: 1,
            tags: ["robotics", "engineering", "competition"],
            registration_deadline: "June 25, 2025"
        },
        {
            id: 7,
            img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Literary Festival",
            description: "A celebration of literature with book launches, poetry readings, and discussions with renowned authors.",
            timing: "July 15, 2025 - July 17, 2025",
            location: "Central Library",
            category: "Literature",
            society_id: 6,
            tags: ["literature", "poetry", "books"],
            registration_deadline: "July 10, 2025"
        },
        {
            id: 8,
            img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Community Service Day",
            description: "Join hands to give back to the community. Various community service activities will be organized around the city.",
            timing: "July 25, 2025",
            location: "Multiple Locations",
            category: "Community",
            society_id: 7,
            tags: ["community", "service", "volunteer"],
            registration_deadline: "July 20, 2025"
        },
        {
            id: 9,
            img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Photography Contest",
            description: "Capture moments and tell stories through your lens. Theme: 'Urban Life'.",
            timing: "August 5, 2025",
            location: "Media Department",
            category: "Art",
            society_id: 2,
            tags: ["photography", "contest", "urban"],
            registration_deadline: "July 30, 2025"
        },
        {
            id: 10,
            img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Science Fair",
            description: "Showcase your scientific research and innovations. Open to all departments.",
            timing: "August 15, 2025 - August 16, 2025",
            location: "SEECS Lobby",
            category: "Science",
            society_id: 8,
            tags: ["science", "research", "innovation"],
            registration_deadline: "August 10, 2025"
        }
    ];

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
                        search.trim() === '' || event.name.toLowerCase().includes(search)
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