import React, { useState, useEffect } from "react";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, TextField } from "@mui/material";
import styles from "../Styles/TestCarousel.module.css";
import TestWithPrices from "./TestsWithPrices";
import SearchTests from "./SearchTest";

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
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2>
          Select a <span className={styles.highlight}>Test Category</span>
        </h2>
        <p className={styles.subtext}>
          Explore our available diagnostic categories to get started.
        </p>
      </header>
      <div className={styles.searchWrapper}>
 <TextField
        label="Search for tests"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb:1 }}
        placeholder="Search for tests..."
      />
      </div>
      {
        searchQuery.trim() &&(<TestWithPrices searchQuery={searchQuery}/>
        )
      }
      <div className={styles.grid}>
        {facility.length > 0 ? (
          facility
            .filter((item) => item.name.toLowerCase() !== "packages")
            .map((item, index) => (
              <div
                key={index}
                className={styles.card}
                onClick={() => handleCardClick(item)}
              >
                <LazyLoadImage
                  src={item.image_url}
                  alt={item.name}
                  className={styles.image}
                  effect="opacity"
                />
                <div className={styles.cardBody}>
                  <h3>{item.name}</h3>
                </div>
              </div>
            ))
        ) : (
          <p className={styles.status}>No categories available.</p>
        )}
      </div>

      {/* Modal for Test Details */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="lg">
        <DialogTitle>{testType ? `Tests in ${testType}` : "Loading..."}</DialogTitle>
        <DialogContent>
          {/* Show loading spinner if data is not ready */}
          {!isModalContentReady ? (
            <CircularProgress />
          ) : (
            <TestWithPrices facilityName={testType} searchQuery={searchQuery} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default TestsCard;
