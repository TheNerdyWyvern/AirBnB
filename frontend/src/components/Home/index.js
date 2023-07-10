import React, { useEffect } from "react";
import * as spotActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Home = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spots = Object.values(useSelector(state => state.spots.allSpots));
    
    useEffect(() => {
        dispatch(spotActions.getAllSpots());
    }, [dispatch])

    return (
        <div id="all-spot-cards">
            {spots.map(e => (
                <div className="spot-card pointer" key={e.id} onClick={() => {
                    history.push(`/spots/${e.id}`);
                }}>
                    <div className="image-box">
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
            ))}
        </div>
    );
}

export default Home;