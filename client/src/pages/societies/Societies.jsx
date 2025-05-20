import { useState } from "react";
import "./societies.scss";
import SocietyCard from "../../components/society/Society";
import { societies } from "../../data/societiesData"; // Assuming you have a data file with society data

const Societies = () => {
  // State for search
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // TEMPORARY DATA
  const categories = ["all", "academic", "cultural", "technical", "sports", "art", "community", "entrepreneurship"];
  
  

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
              category === "all" || society.category.toLowerCase() === category.toLowerCase()
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