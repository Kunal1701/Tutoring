import React, { useState, useEffect } from "react";
import "../assets/styles/SearchTutor.css";
import { useSearchParams } from "react-router-dom";
import study2 from "../assets/images/study2.jpg";
import PropTypes from "prop-types";

/** Yian
 * This module handles the search query for tutors
 * @param {function} handleQuery prop passed in from parent component in SearchTutor.js
 * @returns JSX of search tutor rendering
 */
function SearchTutor({ notFound, search, handleSubmit, page }) {
  const [searchword, setSearchword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams("");
  const [address, setAddress] = useState("");

  /**Yian Chen
   * function that handles change on search input
   * @param {*} evt
   */
  const handleChange = (evt) => {
    evt.preventDefault();
    setSearchword(evt.target.value);
    setSearchParams({ query: evt.target.value, page: page });
    fetchCurrentLocation();
  };

  useEffect(() => {
    if (!search) {
      setSearchParams("");
    }
  }, [search]);

  useEffect(() => {
    const keyDownHandler = (evt) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        handleSubmit(searchword, 0);
      }
    };
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [searchParams]);

  const handleClick = (evt) => {
    evt.preventDefault();
    fetchCurrentLocation();
  };

   const fetchCurrentLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      if (data.display_name) {
        const addresss = data.display_name;
        // setSearchword(address);
        // setSearchParams({ query: address, page: page });
        // console.log(address);
        // handleSubmit(address, 0);
        setAddress(addresss);
        console.log(address);
      } else {
        console.error("No address found for the given coordinates");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const noRes = () => {
    const res = (
      <div
        className="flash flash-warning alert alert-dismissible fade show"
        role="alert"
      >
        <span>No results. Please try another keyword. </span>
        <a data-bs-dismiss="alert" aria-label="Close">
          <i className="fas fa-times"></i>
        </a>
      </div>
    );
    return res;
  };

  return (
    <>
      <div className="wrap" role="main">
        <h1 className="searchHeader">Find a tutor</h1>
        <div className="search">
          <input
            type="text"
            className="searchTerm"
            value={searchword}
            onChange={handleChange}
            placeholder="What would you like to work on?"
          />
          <button
            type="button"
            aria-label="search"
            className="searchButton"
            onClick={() => handleSubmit(searchword, 0, address)}
          >
            <i className="fa fa-search"></i>
          </button>
          <button
            type="button"
            aria-label="use-current-location"
            className="locationButton"
            onClick={handleClick}
          >
            Use Current Location
          </button>
        </div>
      </div>
      <div className="imgContainer" role="complementary">
        {notFound ? noRes() : null}
        <div className="imageDiv">
          <img src={study2} className="study2pic" alt="study picture" />
        </div>
      </div>
    </>
  );
}

SearchTutor.propTypes = {
  notFound: PropTypes.bool,
  search: PropTypes.bool,
  page: PropTypes.number,
  handleSubmit: PropTypes.func,
};
export default SearchTutor;
