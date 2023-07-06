import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
          console.log("Signup Errors", data);
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form id="signupForm" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            class="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p class="email">{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            class="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p class="username">{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            class="firstName"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p class="firstName">{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            class="lastName"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p class="lastName">{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            class="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p class="password">{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            class="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p class="confirmPassword">{errors.confirmPassword}</p>
        )}
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;