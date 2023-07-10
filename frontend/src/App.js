import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import SpotDetails from "./components/SpotDetails";
import CreateSpot from "./components/CreateSpot";
import ManageSpots from "./components/ManageSpots";
import EditSpot from "./components/ManageSpots/EditSpotsForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path="/"><Home/></Route>
        <Route path="/spots/new"><CreateSpot/></Route>
        <Route path="/spots/current"><ManageSpots/></Route>
        <Route path="/spots/:id/edit"><EditSpot/></Route>
        <Route path="/spots/:id"><SpotDetails/></Route>
      </Switch>}
    </>
  );
}

export default App;