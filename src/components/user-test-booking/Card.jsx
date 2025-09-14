import React from "react";
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
import FacilityWithPrices from "../user-radiology-bookings/facilitiesWithPrices";

const Card = ({
  isRadiology = false,
  title,
  searchQuery,
  handleSearchChange,
  openModal,
  handleCloseModal,
  facility,
  handleCardClick,
  testType,
  isModalContentReady,
}) => {
  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2>
          Select a <span className={styles.highlight}>{title}</span>
        </h2>
      </header>
      <div className={styles.searchWrapper}>
        <TextField
          label="Search for tests"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 1 }}
          placeholder="Search for tests..."
        />
      </div>
      {searchQuery.trim() ? (
        isRadiology ? (
          <FacilityWithPrices searchQuery={searchQuery} />
        ) : (
          <TestWithPrices searchQuery={searchQuery} />
        )
      ) : null}
      <div className={styles.grid}>
        {facility.length > 0 ? (
          facility
            .filter((item) => item?.name?.toLowerCase() !== "packages")
            .map((item, index) => (
              <div
                key={index}
                className={`${styles.card} ${isRadiology ? styles.centerCard : ""}`}
                onClick={() => handleCardClick(item)}
              >
                <LazyLoadImage
                  src={item.image_url || ""}
                  alt={item.name}
                  className={`${styles.image} ${isRadiology ? styles.smallImage : ""}`}
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
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          {testType ? `Tests in ${testType}` : "Loading..."}
        </DialogTitle>
        <DialogContent>
          {/* Show loading spinner if data is not ready */}
          {!isModalContentReady ? (
            <CircularProgress />
          ) : isRadiology ? (
            <FacilityWithPrices
              facilityName={testType}
              searchQuery={searchQuery}
            />
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

export default Card;
