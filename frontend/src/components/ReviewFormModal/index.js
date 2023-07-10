import React, { useState , useEffect } from "react";
import * as spotActions from "../../store/spots";
import * as reviewActions from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./ReviewForm.css";

const ReviewFormModal = (spotId) => {
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.spotById);
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        dispatch(spotActions.getSpotById(spotId));
    }, [dispatch, spotId])

    if(!spot) return <></>;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(reviewActions.createReview({ review, stars: `${stars}` }, spot.id))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
                console.log("Review Creation Errors", data);
            }
        )
    }

    return (
        <>
            <h1>How was your stay?</h1>
            {errors && <p className="server-errors">{errors.message}</p>}
            <form id="review-form" onSubmit={handleSubmit}>
                <textarea 
                    type="comment"
                    value={review}
                    id="review-text"
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Leave your review here..."
                    required
                />
                <div id="stars">
                    {[...Array(5)].map((arrComp, index) => {
                        index += 1;
                        return (
                            <button
                                type="button"
                                key={index}
                                className="star-button"
                                onClick={() => setStars(index)}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(stars)}
                            >
                                {index <= (hover || stars) ? <span className="star" ><i className="fa fa-star" style={{color: "gold"}}/></span> : <span className="star"><i className="fa fa-star"/></span>}
                            </button>
                        );
                    })}
                    <span>Stars</span>
                </div>
                {errors.review && <p className="review-errors">{errors.review}</p>}
                <button type="submit" disabled={stars < 1 || review.length < 10}>Submit Your Review</button>
            </form>
        </>
    )
}

export default ReviewFormModal;