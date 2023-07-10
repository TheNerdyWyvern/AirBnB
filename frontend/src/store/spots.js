import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/getAllSpots";
const GET_SPOT_BY_ID = "spots/getSpotById";
const CREATE_SPOT = "spots/createSpot";

const loadAllSpots = spots => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

const loadSpotById = spot => {
    return {
        type: GET_SPOT_BY_ID,
        spot
    }
}

const addSpot = spot => {
    return {
        type: CREATE_SPOT,
        payload: spot
    }
}

export const getAllSpots = () => async (dispatch) => {
    const res = await fetch("/api/spots")

    if (res.ok) {
        const data = await res.json();
        dispatch(loadAllSpots(data.Spots));
        return res;
    }
}

export const getSpotById = (id) => async (dispatch) => {
    const res = await fetch(`/api/spots/${id}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpotById(data));
        return res;
    }
}

export const createSpot = (spot) => async (dispatch) => {
    const { address, city, state, country, lat, lng, name, description, price } = spot;
    const res = await csrfFetch('/api/spots', {
        method: "POST",
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
    });

    const data = await res.json();
    dispatch(addSpot(data));
    return res;
}

const initialState = { allSpots: {}, spotById: {} };

const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_SPOTS:
            newState = { ...state, allSpots: {...state.allSpots}, spotById: {} };
            for (let spot of action.spots) {
              newState.allSpots[spot.id] = spot;
            }
            return newState;
        case GET_SPOT_BY_ID:
            newState = { ...state, allSpots: {}, spotById: action.spot };
            return newState;
        case CREATE_SPOT:
            newState = { ...state, allSpots: {}, spotById: action.payload};
            return newState;
        default:
            return state;
    }
}

export default spotReducer;