const GET_ALL_SPOTS = "spots/getAllSpots";
// const GET_SPOT_BY_ID = "spots/getSpotById";

const loadAllSpots = spots => {
    return {
        type: GET_ALL_SPOTS,
        spots
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

const initialState = { allSpots: {}, spotById: {} };

const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_SPOTS:
            newState = { ...state, allSpots: {...state.allSpots}, spotById: {} };
            console.log("reducer spots", action.spots);
            for (let spot of action.spots) {
              newState.allSpots[spot.id] = spot;
            }
            return newState;
        default:
            return state;
    }
}

export default spotReducer;