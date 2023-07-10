import React from "react";
import * as reviewActions from "../../store/reviews";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteReview.css";

const DeleteReviewModal = ({ id }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    // console.log("delete review modal", id);

    const handleSubmit = (e) => {
        e.preventDefault();
        return dispatch(reviewActions.deleteReview(id))
            .then(closeModal)
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure want to delete this review?</p>
            <div>
                <button className="selector-button pointer" style={{backgroundColor: "red"}} onClick={handleSubmit}>Yes (Delete Review)</button>
            </div>
            <div>
                <button className="selector-button pointer" style={{backgroundColor: "grey"}} onClick={closeModal}>No (Keep Review)</button>
            </div>
        </>
    )
}

export default DeleteReviewModal;