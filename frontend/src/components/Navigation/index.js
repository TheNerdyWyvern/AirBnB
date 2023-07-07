import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <NavLink id="home" exact to="/"><img src={require("./Spade.png")} alt="Home Icon" style={{"objectFit": "cover"}}/></NavLink>
      <ProfileButton id="profileButton" user={sessionUser} />
    </nav>
  );
}

export default Navigation;