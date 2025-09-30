"use client"

import './Stars.css'

const Stars = () => {
    return (
        <div className="rating-stars">
            <input value="5" name="rating" id="star5" type="radio" aria-label="5 stars" />
            <label htmlFor="star5" aria-hidden="true"></label>
            <input value="4" name="rating" id="star4" type="radio" aria-label="4 stars" />
            <label htmlFor="star4" aria-hidden="true"></label>
            <input value="3" name="rating" id="star3" type="radio" aria-label="3 stars" />
            <label htmlFor="star3" aria-hidden="true"></label>
            <input value="2" name="rating" id="star2" type="radio" aria-label="2 stars" />
            <label htmlFor="star2" aria-hidden="true"></label>
            <input value="1" name="rating" id="star1" type="radio" aria-label="1 star" />
            <label htmlFor="star1" aria-hidden="true"></label>
        </div>
    );
};

export default Stars;
