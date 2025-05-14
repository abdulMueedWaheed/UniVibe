const Society = ({ society }) => {
  return (
    <div className="society-card">
      <div className="logo">
        <img src={society.logo} alt={society.name} />
      </div>
      <div className="info">
        <h3>{society.name}</h3>
        <p className="description">{society.description}</p>
        <div className="details">
          <span className="category">Category: {society.category}</span>
          <span className="members">Members: {society.members}</span>
          <span className="founding">Founded: {society.founding_date}</span>
        </div>
        <div className="contact">
          {/* <a href={`mailto:${society.contact_email}`} className="contact-btn">Contact</a> */}
          <div className="social">
            {society.social_media.instagram &&
              <a href={`https://instagram.com/${society.social_media.instagram}`} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            }
            {society.social_media.facebook &&
              <a href={`https://facebook.com/${society.social_media.facebook}`} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
            }
            {society.social_media.twitter &&
              <a href={`https://twitter.com/${society.social_media.twitter}`} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Society;