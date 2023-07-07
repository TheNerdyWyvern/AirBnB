import React, { useEffect } from "react";
import * as spotActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Home = () => {
    const dispatch = useDispatch();
    // const history = useHistory
    const spots = Object.values(useSelector(state => state.spots.allSpots));
    
    useEffect(() => {
        dispatch(spotActions.getAllSpots());
    }, [dispatch])

    return (
        <div id="all-spot-cards">
            {spots.map(e => (
                <div class="spot-card" key={e.id}>
                    <div class="image-box">
                        <img class="spot-image"
                        src={e.previewImage}
                        alt={`Spot #${e.id}`}/>
                    </div>

                    <div class="spot-text">
                        <h3><NavLink class="spot-title" to="/">{e.name}</NavLink></h3>
                        <div class="spot-location-and-rating">
                            <p class="spot-location">{`${e.city}, ${e.state}`}</p>
                            <p class="spot-avg-rating">{e.avgRating || "New"}</p>
                        </div>
                        <p class="spot-cost">{`$${e.price} per night`}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home;