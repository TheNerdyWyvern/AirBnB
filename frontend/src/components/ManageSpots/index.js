import React, { useEffect } from "react";
import * as spotActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import "./ManageSpots.css"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";

const ManageSpots = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spots = Object.values(useSelector(state => state.spots.allSpots));

    console.log("inside manageSpots", spots);

    useEffect(() => {
        dispatch(spotActions.getSpotsByCurrentUser());
    }, [dispatch])

    
    return (
        <>
            <h2>Manage Your Spots</h2>
            <button id="create-spot-button" className="pointer" style={{ marginBottom: "10px" }} onClick={() => {history.push(`/spots/new`);}}>Create a New Spot</button>
            <div id="all-spot-cards">
                {spots.map(e => (
                    <div className="spot-card">
                        <div className="spot-card pointer" key={e.id} onClick={() => {
                            history.push(`/spots/${e.id}`);
                        }}>
                            <div className="image-box" style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "black" }}>
                                <img className="spot-image"
                                src={e.previewImage}
                                alt={`Spot #${e.id}`} title={e.name}/>
                            </div>
                            <div className="spot-text">
                                <div className="spot-location-and-rating">
                                    <span className="spot-location">{`${e.city}, ${e.state}`}</span>
                                    <span className="spot-avg-rating"><i className="fa fa-star"/>{e.avgRating || "New"}</span>
                                </div>
                                <p className="spot-cost">{`$${e.price} night`}</p>
                            </div>
                        </div>
                        <div>
                                <span>
                                    <button style={{ margin: "5px"}} onClick={() => {history.push(`/spots/${e.id}/edit`)}}>Update</button>
                                </span>
                                <span>
                                    <OpenModalButton 
                                    buttonText="Delete"
                                    modalComponent={<DeleteSpotModal id={e.id}/>}/>
                                </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ManageSpots;