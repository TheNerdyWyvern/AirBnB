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
    <nav>
      <NavLink id="home" exact to="/"><img src={require("./Spade.png")} alt="Home Icon" style={{maxHeight: "64px"}}/></NavLink>
      {sessionUser && <div id="create-spot-button" className="pointer" onClick={() => {
                    history.push(`/spots/new`);
                }}>Create Spot</div>}
      {isLoaded && <ProfileButton id="profileButton" user={sessionUser} /> }
    </nav>
  );
}

export default Navigation;