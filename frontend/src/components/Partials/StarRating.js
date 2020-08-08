import React, {useState, useEffect, useRef } from 'react';

const StarRating =({rating, numberOfStars, setRating, setHover}) => {

  const [currentRating, setCurrentRating] = useState(rating);
  const ratingRef = useRef(null);

  useEffect(() =>{
    setStars();
  },[]);

  const hoverHandler = ev => {
    const stars = ev.target.parentElement.getElementsByClassName('star');
    const hoverValue = ev.target.dataset.value;
    setHover(hoverValue);
    Array.from(stars).forEach(star => {
      star.style.color = hoverValue >= star.dataset.value ? 'red' : 'gray';
    });
  };

  const setStars = ev => {
    const stars = ratingRef.current.getElementsByClassName('star');
    Array.from(stars).forEach(star => {
      star.style.color =
        currentRating >= star.dataset.value ? 'red' : 'gray';
    });
  };

  const starClickHandler = ev => {
    let rating = ev.target.dataset.value;
    setCurrentRating(rating); // set state so the rating stays highlighted
    setRating(rating); // emit the event up to the parent
  };

  const mouseLeaveHandle = () => {
    setHover(0);
  };

  return (
      <div
        ref={ratingRef}
        data-rating={currentRating}
        onMouseOut={setStars}
      >
         {[...Array(+numberOfStars).keys()].map(n => {
          return (
            <span
              className="star"
              style = {{fontSize: "1.8rem", cursor: "pointer"}}
              key={n+1}
              data-value={n+1}
              onMouseOver={hoverHandler}
              onClick={starClickHandler}
              onMouseLeave={mouseLeaveHandle}
            >
              &#9733;
            </span>
          );
        })}
      </div>
    );
  
}

export default StarRating;