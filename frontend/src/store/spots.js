import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/getSpots/all";
const GET_SPOT_BY_ID = "spots/getSpots/:id";
const GET_SPOTS_BY_CURRENT_USER = "spots/getSpots/current";
const CREATE_SPOT = "spots/createSpot";
const EDIT_SPOT = "spot/editSpot";
const DELETE_SPOT = "spot/deleteSpot";

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

const loadSpotsByCurrentUser = spots => {
    return {
        type: GET_SPOTS_BY_CURRENT_USER,
        spots
    }
}

const addSpot = spot => {
    return {
        type: CREATE_SPOT,
        payload: spot
    }
}

const modifySpot = spot => {
    return {
        type: EDIT_SPOT,
        payload: spot
    }
}

const removeSpot = id => {
    return {
        type: DELETE_SPOT,
        id
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

export const getSpotsByCurrentUser = () => async (dispatch) => {
    const res = await fetch("/api/spots/current");

    if (res.ok) {
        const data = await res.json();
        console.log("inside spot by current", data);
        dispatch(loadSpotsByCurrentUser(data.Spots))
        return res;
    }
}

export const createSpot = (spot, images) => async (dispatch) => {
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
    return dispatch(createImagesForSpot(data, images))
}

export const createImagesForSpot = (spot, images) => async (dispatch) => {
    if (images) {
        spot.SpotImages = [];
        for (let image of images) {
            if (image.url) {
                const res = await csrfFetch(`/api/spots/${spot.id}/images`, {
                    method: "POST",
                    body: JSON.stringify({
                        url: image.url,
                        preview: image.preview
                    })
                })
                const data = await res.json();
                spot.SpotImages.push(data);
            }
        }
    }
    dispatch(addSpot(spot));
    return spot;
}

export const editSpot = (spot) => async (dispatch) => {
    const { id, address, city, state, country, lat, lng, name, description, price } = spot;
    
    console.log("editspot", spot);

    const res = await csrfFetch(`/api/spots/${id}`, {
        method: "PUT",
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
    dispatch(modifySpot(data));
    return data;
}

export const deleteSpot = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}`, {
        method: "DELETE"
    });
    console.log("inside delete spot", res);
    dispatch(removeSpot(id));
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
        case GET_SPOTS_BY_CURRENT_USER:
            newState = { ...state, allSpots: {}, spotById: {}};
            for (let spot of action.spots) {
                newState.allSpots[spot.id] = spot;
            }
            return newState;
        case CREATE_SPOT:
            newState = { ...state, allSpots: {}, spotById: action.payload};
            return newState;
        case EDIT_SPOT:
            newState = { ...state, allSpots: {}, spotById: action.payload};
            return newState;
        case DELETE_SPOT:
            newState = { ...state, allSpots: {...state.allSpots}, spotById: {} }
            delete newState.allSpots[action.id]
            return newState;
        default:
            return state;
    }
}

export default spotReducer;