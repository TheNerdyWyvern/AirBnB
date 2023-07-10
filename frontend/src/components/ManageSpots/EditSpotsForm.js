import React, { useState, useEffect } from "react";
import * as spotActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import "./EditSpotForm.css";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

const EditSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoaded, setIsLoaded] = useState(false)
    const spot = useSelector(state => state.spots.spotById);

    useEffect(() => {
        dispatch(spotActions.getSpotById(id))
            .then(() => setIsLoaded(true));
    }, [dispatch, id]);
    
    useEffect(() => {
        // console.log("effect 2", spot);
        setCountry(spot.country);
        setAddress(spot.address);
        setCity(spot.city);
        setState(spot.state);
        setDescription(spot.description);
        setName(spot.name);
        setPrice(spot.price);
    }, [isLoaded, spot]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(spotActions.editSpot({ id, address, city, state, country, lat: 90, lng: 90, name, description, price }))
            .then(async (data) => {
                history.push(`/spots/${data.id}`);
            })
            .catch(async (data) => {
                if (data && data.errors) {
                    setErrors(data.errors);
                }
                console.log("Spot Creation Errors", data.errors);
            })
    }   

    return (
        <div id="create-spot-container">
            <h1>Update Your Spot</h1>
            <form id="create-spot-form" onSubmit={handleSubmit}>
                <div id="create-spot-location">
                    <h2>Where's your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <label>
                        Country
                        <input
                            type="text"
                            value={country}
                            className="country"
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                            required
                        />
                    </label>
                    {errors.country && <p className="country-errors">{errors.country}</p>}
                    <label>
                        Street Address
                        <input
                            type="text"
                            value={address}
                            className="Address"
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Address"
                            required
                        />
                    </label>
                    {errors.address && <p className="address-errors">{errors.address}</p>}
                    <span>
                        <label>
                            City
                            <input
                                type="text"
                                value={city}
                                className="city"
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                required
                            />
                        </label>, 
                        <label>
                            State
                            <input
                                type="text"
                                value={state}
                                className="state"
                                onChange={(e) => setState(e.target.value)}
                                placeholder="STATE"
                                required
                            />
                        </label>
                    </span>
                    {(errors.city || errors.state) && <span>
                        {errors.city && <p className="city-errors">{errors.city}</p>}
                        {errors.state && <p className="state-errors">{errors.state}</p>}
                    </span>}
                </div>
                <div id="create-spot-description">
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amentities like fast wif or parking, and what you love about the neighborhood.</p>
                    <textarea
                        value={description}
                        className="description"
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please write at least 30 characters"
                        required
                    />
                    {errors.description && <p className="description-errors">{errors.description}</p>}
                </div>
                <div id="create-spot-title">
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input
                        type="text"
                        value={name}
                        className="title"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of your spot"
                        required
                    />
                    {errors.name && <p className="title-errors">{errors.name}</p>}
                </div>
                <div id="create-spot-price">
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <span>$<span> </span>
                        <input
                            type="text"
                            value={price}
                            className="price"
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price per night (USD)"
                            required
                        />
                    </span>
                    {errors.price && <p className="price-errors">{errors.price}</p>}
                </div>
                <button type="submit">Update Your Spot</button>
            </form>
        </div>
    )
}

export default EditSpot;