import React, { useState, useEffect } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import styles from "../../Styles/TestCarousel.module.css";
import TestWithPrices from "./TestsWithPrices";
import Card from "./Card";

const TestsCard = () => {
  const [testType, setTestType] = useState(null);
  const [facility, setFacility] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get(
          "https://api.swasthyapro.com/api/database/get-facility"
        );
        setFacility(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("We're unable to load test categories at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const handleCardClick = (data) => {
    setTestType(data.name);
    setSearchQuery("");
    setOpenModal(true); // Open modal when a card is clicked
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTestType(null); // Reset testType when closing modal
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update the search query state
  };

  const isModalContentReady = testType && facility.length > 0;

  if (loading) return <p className={styles.status}>Loading...</p>;
  if (error) return <p className={styles.status}>{error}</p>;

  return (
    <Card
      title={"Test Category"}
      searchQuery={searchQuery}
      handleSearchChange={handleSearchChange}
      openModal={openModal}
      handleCloseModal={handleCloseModal}
      facility={facility}
      handleCardClick={handleCardClick}
      testType={testType}
      isModalContentReady={isModalContentReady}
    />
  );
};

export default TestsCard;
