import React, { useEffect } from "react";
import * as spotActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetails.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const SpotDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const spot = useSelector(state => state.spots.spotById);

    useEffect(() => {
        dispatch(spotActions.getSpotById(id))
    }, [dispatch, id]);

    return (
        <>
        </>
    )
}

export default SpotDetails;