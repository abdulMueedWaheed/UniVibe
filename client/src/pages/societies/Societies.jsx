import { useState } from "react";
import "./societies.scss";
import SocietyCard from "../../components/society/Society";

const Societies = () => {
  // State for search
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // TEMPORARY DATA
  const categories = ["all", "academic", "cultural", "technical", "sports", "arts", "community", "entrepreneurship"];
  
  const societies = [
    {
      id: 1,
      name: "NUST ACM",
      logo: "https://images.unsplash.com/photo-1557825835-70d97c4aa567?q=80&w=2070&auto=format&fit=crop",
      description: "Promoting computer science knowledge and fostering technical skills among students.",
      founding_date: "2010",
      category: "technical",
      members: 120,
      social_media: {
        instagram: "nust_acm",
        facebook: "nustacm",
        twitter: "nustacm"
      },
      contact_email: "acm@nust.edu.pk"
    },
    {
      id: 2,
      name: "NUST Dramatics Club",
      logo: "https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?q=80&w=2070&auto=format&fit=crop",
      description: "Exploring theatrical arts and fostering creativity through dramatic performances.",
      founding_date: "2008",
      category: "arts",
      members: 85,
      social_media: {
        instagram: "nust_drama",
        facebook: "nustdrama",
        twitter: "nustdrama"
      },
      contact_email: "drama@nust.edu.pk"
    },
    {
      id: 3,
      name: "NUST Sports Society",
      logo: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
      description: "Promoting sports activities and organizing sports competitions across the university.",
      founding_date: "2005",
      category: "sports",
      members: 200,
      social_media: {
        instagram: "nust_sports",
        facebook: "nustsports",
        twitter: "nustsports"
      },
      contact_email: "sports@nust.edu.pk"
    },
    {
      id: 4,
      name: "NUST Music Society",
      logo: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
      description: "Providing a platform for music enthusiasts to showcase their talents and organize music events.",
      founding_date: "2009",
      category: "cultural",
      members: 110,
      social_media: {
        instagram: "nust_music",
        facebook: "nustmusic",
        twitter: "nustmusic"
      },
      contact_email: "music@nust.edu.pk"
    },
    {
      id: 5,
      name: "NUST Entrepreneurs Club",
      logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
      description: "Fostering entrepreneurial mindset and providing resources for student startups.",
      founding_date: "2012",
      category: "entrepreneurship",
      members: 95,
      social_media: {
        instagram: "nust_entrepreneurs",
        facebook: "nustentrepreneurs",
        twitter: "nustentrepreneurs"
      },
      contact_email: "entrepreneurs@nust.edu.pk"
    },
    {
      id: 6,
      name: "NUST Literary Society",
      logo: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070&auto=format&fit=crop",
      description: "Celebrating literature, poetry and writing skills through various literary events.",
      founding_date: "2007",
      category: "cultural",
      members: 75,
      social_media: {
        instagram: "nust_literary",
        facebook: "nustliterary",
        twitter: "nustliterary"
      },
      contact_email: "literary@nust.edu.pk"
    },
    {
      id: 7,
      name: "NUST Community Service Club",
      logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2070&auto=format&fit=crop",
      description: "Engaging students in community service activities and charitable causes.",
      founding_date: "2011",
      category: "community",
      members: 150,
      social_media: {
        instagram: "nust_community",
        facebook: "nustcommunity",
        twitter: "nustcommunity"
      },
      contact_email: "community@nust.edu.pk"
    },
    {
      id: 8,
      name: "NUST Science Society",
      logo: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
      description: "Promoting scientific research and innovation among students.",
      founding_date: "2010",
      category: "academic",
      members: 90,
      social_media: {
        instagram: "nust_science",
        facebook: "nustscience",
        twitter: "nustscience"
      },
      contact_email: "science@nust.edu.pk"
    },
    {
      id: 9,
      name: "NUST Photography Club",
      logo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070&auto=format&fit=crop",
      description: "Exploring the art of photography and conducting photography competitions and exhibitions.",
      founding_date: "2013",
      category: "arts",
      members: 80,
      social_media: {
        instagram: "nust_photography",
        facebook: "nustphotography",
        twitter: "nustphotography"
      },
      contact_email: "photography@nust.edu.pk"
    },
    {
      id: 10,
      name: "NUST Debating Society",
      logo: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop",
      description: "Enhancing public speaking and debating skills through various debating competitions.",
      founding_date: "2006",
      category: "academic",
      members: 100,
      social_media: {
        instagram: "nust_debating",
        facebook: "nustdebating",
        twitter: "nustdebating"
      },
      contact_email: "debating@nust.edu.pk"
    }
  ];



  return (
    <div className='societies'>
      <div className="container">
        <div className="filter-bar">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder='Find Society...' 
              onChange={(e) => { setSearch(e.target.value) }} 
            />
            <button>Find</button>
          </div>
          <div className="filter-dropdown">
            <div>Filter By</div>
            <span>Category:</span>
            <select 
              onChange={(e) => setCategory(e.target.value)} 
              id="filters"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="societies-grid">
          {societies
            .filter(society => (
              search.trim() === '' || 
              society.name.toLowerCase().includes(search.toLowerCase()) ||
              society.description.toLowerCase().includes(search.toLowerCase())
            ))
            .filter(society => (
              category === "all" || society.category === category
            ))
            .map(society => (
              <SocietyCard key={society.id} society={society} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Societies;