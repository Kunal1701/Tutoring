import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/styles/LoginRegister.css";

function RegisterTeacher() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmedPassword: "",
    first_name: "",
    last_name: "",
    gender: "",
    education: "",
    subjects: "",
    image: "",
    hours: [],
    location: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const navigate = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register-teacher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    handleRegister();
    const resRegUser = await res.json();
    alert(resRegUser.message);
  };

  const onInputChange = (evt) => {
    const { value, name } = evt.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(evt);
  };

  const validateInput = (evt) => {
    let { name, value } = evt.target;
    setError((prev) => {
      const obj = { ...prev, [name]: "" };
      if (user.password && value !== user.password) {
        obj[name] = "The confirmed password does not match with the password";
      }
      return obj;
    });
  };

  const handleRegister = () => {
    navigate("/login", { replace: true });
  };

  function previewfiles(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUser((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
  }

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      if (data.display_name) {
        const address = data.display_name;
        setUser((prevUser) => ({
          ...prevUser,
          location: address,
        }));
      } else {
        console.error("No address found for the given coordinates");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  return (
    <main className="container">
      <div className="card">
        <div className="card-body">
          <div className="alternate-text">
            <Link id="sign-in" to="/login">
              Already have an account? Sign In
            </Link>
          </div>
          <h1 className="card-title">Sign Up</h1>
          <form onSubmit={createUser}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                placeholder="Enter email"
                value={user.email}
                onChange={onInputChange}
                name="email"
                required
              />
              <div id="emailHelp" className="form-text">
                We will never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="inputPassword5" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="inputPassword5"
                placeholder="Enter password"
                name="password"
                value={user.password}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputConfirmedPassword5" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="inputConfirmedPassword5"
                placeholder="Confirm password"
                name="confirmedPassword"
                value={user.confirmedPassword}
                onChange={onInputChange}
                onBlur={validateInput}
                required
              />
              {error.confirmedPassword && (
                <div className="text-danger">{error.confirmedPassword}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="inputFirstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="inputFirstName"
                placeholder="Enter first name"
                value={user.first_name}
                onChange={onInputChange}
                name="first_name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputLastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="inputLastName"
                placeholder="Enter last name"
                value={user.last_name}
                onChange={onInputChange}
                name="last_name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputGender" className="form-label">
                Gender
              </label>
              <input
                type="text"
                className="form-control"
                id="inputGender"
                placeholder="Enter gender"
                value={user.gender}
                onChange={onInputChange}
                name="gender"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputEducation" className="form-label">
                Education
              </label>
              <input
                type="text"
                className="form-control"
                id="inputEducation"
                placeholder="Enter education"
                value={user.education}
                onChange={onInputChange}
                name="education"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputSubjects" className="form-label">
                Subjects
              </label>
              <input
                type="text"
                className="form-control"
                id="inputSubjects"
                placeholder="Enter subjects"
                value={user.subjects}
                onChange={onInputChange}
                name="subjects"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputLocation" className="form-label">
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="inputLocation"
                placeholder="Enter Location"
                value={user.location}
                onChange={onInputChange}
                name="location"
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={getCurrentLocation}
              >
                Use Current Location
              </button>
            </div>

            <div className="mb-3">
              <label htmlFor="inputimage" className="form-label">
                Profile Image
              </label>
              <input
                type="file"
                className="form-control"
                id="inputimage"
                name="image"
                onChange={(evt) => {
                  const file = evt.target.files[0];
                  previewfiles(file);
                }}
                accept="image/png, image/jpeg, image/jpg"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="inputHours" className="form-label">
                Hours
              </label>
              <input
                type="text"
                className="form-control"
                id="inputHours"
                placeholder="Enter hours (e.g., 15:00-17:00, 18:00-19:00)"
                value={user.hours.join(",")}
                onChange={(e) => {
                  setUser((prev) => ({
                    ...prev,
                    hours: e.target.value
                      .split(",")
                      .map((hours) => hours.split("!")),
                  }));
                }}
                name="hours"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default RegisterTeacher;
