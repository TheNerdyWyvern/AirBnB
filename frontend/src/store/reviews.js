import { csrfFetch } from "./csrf";

const GET_REVIEWS_BY_SPOT = "review/getReviewsBySpot";
const CREATE_REVIEW = "review/createReview";
const DELETE_REVIEW = "review/deleteReview";

const loadReviewsBySpot = reviews => {
    return {
        type: GET_REVIEWS_BY_SPOT,
        reviews
    }
}

const addReview = review => {
    return {
        type: CREATE_REVIEW,
        payload: review
    }
}

const removeReview = id => {
    return {
        type: DELETE_REVIEW,
        id
    }
}

export const getReviewsBySpot = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/reviews`);

    if (res.ok) {
        const data = await res.json();
        // console.log("in get reviews", data);
        dispatch(loadReviewsBySpot(data.Reviews))
        return data;
    }
}

export const createReview = (newReview, id) => async (dispatch) => {
    const { review, stars } = newReview;
    const res = await csrfFetch(`/api/spots/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({
            review,
            stars
        })
    });

    const data = await res.json();

    console.log("review reducer", data);
    dispatch(addReview(data));
    return data;
}

export const deleteReview = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${id}`, {
        method: "DELETE"
    });
    console.log("inside delete review", res);
    dispatch(removeReview(id));
    return res;
}

const initialState = { allReviewsBySpot: {}, newReview: {} }

const reviewReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_REVIEWS_BY_SPOT:
            newState = { ...state, allReviewsBySpot: {}, newReview: {} };
            for (let review of action.reviews) {
                newState.allReviewsBySpot[review.id] = review;
            }
            // console.log("in reviews reducer", newState);
            return newState;
        case CREATE_REVIEW:
            newState = { ...state, allReviewsBySpot: {}, newReview: action.payload };
            return newState;
        case DELETE_REVIEW:
            newState = { ...state, allReviewsBySpot: {...state.allReviewsBySpot}, newReview: {} }
            delete newState.allReviewsBySpot[action.id]
            return newState;
        default:
            return state;
    }
}

export default reviewReducer;