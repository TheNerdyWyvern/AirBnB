import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();

  // console.log("navigation", sessionUser);

  return (
    <nav style={{ borderBottomStyle: "solid", borderBottomWidth: "1px", borderBottomColor: "light grey" }}>
      <NavLink id="home" exact to="/"><img src={require("./Spade.png")} alt="Home Icon" style={{maxHeight: "64px"}}/></NavLink>
      <div style={{ display: "flex", flexWrap: "nowrap"}}>
        {sessionUser && <div id="create-spot-button" className="pointer" onClick={() => {history.push(`/spots/new`);}}>Create Spot</div>}
        <div style={{marginLeft: "10px"}}>{isLoaded && <ProfileButton id="profileButton" user={sessionUser} /> }</div>
      </div>
    </nav>
  );
}

export default Navigation;