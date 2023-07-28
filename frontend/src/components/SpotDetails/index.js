import React, { useEffect } from "react";
import * as spotActions from "../../store/spots";
import * as reviewActions from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import DeleteReviewModal from "../DeleteReviewModal";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetails.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const SpotDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const spot = useSelector(state => state.spots.spotById);
    const reviews = Object.values(useSelector(state => state.reviews.allReviewsBySpot)).reverse();
    const sessionUser = useSelector(state => state.session.user) || {id: -1};
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        dispatch(spotActions.getSpotById(id));
        dispatch(reviewActions.getReviewsBySpot(id));
    }, [dispatch, id]);

    // console.log("b4 if", spot);

    if(!spot.SpotImages) {
        return <></>
    }

    console.log("in spot details", reviews[0]);

    const spotImages = spot.SpotImages;

    const preview = spot.SpotImages.find(e => e.preview === true);

    const handleReserveClick = () => {
        alert("Feature Coming Soon...");
    }

    const multiImageDisplay = () => {
        let imgArr = [];

        console.log("gamer", spotImages);

        if (spotImages.length < 4) {
            let add = 0;
            spotImages.forEach(e => {
                if (!e.preview){
                    imgArr.push(<div className="image-container"><img className="spot-images" src={e.url} key={e.id} alt={e.id}/></div>);
                }
                else add++;
            });
            for (let i = 0; i < (4-spotImages.length)+add; i++) {
                imgArr.push(<div className="image-container"><div className="spot-images grey-box" ></div></div>);
            }
            return imgArr;
        }
        else if (spotImages.length >= 4) {
            let add = 0;
            for (let i = 0; i < 4; i++) {
                if (!spotImages[i].preview) {
                    imgArr.push(<div className="image-container"><img className="spot-images" src={spotImages[i+add].url} key={spotImages[i+add].id} alt={spotImages[i+add].id}/></div>)
                }
                else add++;
            }
            return imgArr;
        }
    }

    return (
        <div id="spot-page">
            <div id="spot-container">
                <div id="spot-header">
                    <h2 id="spot-name">{spot.name}</h2>
                    <p id="spot-location">{spot.city}, {spot.state}, {spot.country}</p>
                </div>
                <div id="spot-image-container">
                    <div className="preview-container">
                        {preview ? <img className="preview-image" src={preview.url} alt="preview"/> : <div id="preview-image grey-box" ></div>}
                    </div>
                    {multiImageDisplay()}
                </div>
                <h2 id="host">Hosted By {spot.Owner?.firstName} {spot.Owner.lastName}</h2>
                <span id="buyer-info">
                    <span id="spot-cost">${spot.price} night</span>
                    <span id="spot-reviews"><i className="fa fa-star"/>{spot.avgStarRating || "New"}</span>
                    {spot.numReviews !== 0 && <><span id="spacer"> · </span><span>{spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}</span></>}
                    <button id="reserve-button" onClick={handleReserveClick}>Reserve</button>
                </span>
            </div>
            <div id="review-container">
                <h2 id="review-header">
                    <span id="spot-reviews"><i className="fa fa-user-circle-o" aria-hidden="true"></i>{spot.avgStarRating || "New"}</span>
                    {spot.numReviews !== 0 && <><span id="spacer"> · </span><span>{spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}</span></>}
                </h2>
                <div hidden={sessionUser.id === -1 ||
                            sessionUser.id === spot.Owner.id ||
                            reviews.some(e => e.userId === sessionUser.id)}><OpenModalButton 
                                                                            buttonText="Post Your Review"
                                                                            modalComponent={<ReviewFormModal spotId={spot.id}/>}
                /></div>
                {spot.numReviews === 0 ? (sessionUser.id !== spot.Owner.id ? <div id="no-reviews-placeholder">Be the first to post a review!</div>: <></>): 
                reviews.map(e => (
                    <div className="review-card" key={e.id}>
                        <div className="review-name">{e.User.firstName}</div>
                        <div className="review-date">{monthNames[new Date(e.updatedAt).getMonth()]} {new Date(e.updatedAt).getFullYear()}</div>
                        <p className="review-text">{e.review}</p>
                        {e.User.id === sessionUser.id ? <OpenModalButton 
                                                        buttonText="Delete"
                                                        modalComponent={<DeleteReviewModal id={e.id}/>}/>:<></>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SpotDetails;