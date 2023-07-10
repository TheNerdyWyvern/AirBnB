import React from "react";
import * as spotActions from "../../store/spots";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteSpot.css";

const DeleteSpotModal = ({ id }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    console.log("delete spot modal", id);

    const handleSubmit = (e) => {
        e.preventDefault();
        return dispatch(spotActions.deleteSpot(id))
            .then(closeModal)
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure want to remove this spot from the listings?</p>
            <div>
                <button className="selector-button pointer" style={{backgroundColor: "red"}} onClick={handleSubmit}>Yes (Delete Spot)</button>
            </div>
            <div>
                <button className="selector-button pointer" style={{backgroundColor: "grey"}} onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </>
    )
}

export default DeleteSpotModal;