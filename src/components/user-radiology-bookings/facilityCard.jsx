import { useState } from "react";

import styles from "../../Styles/TestCarousel.module.css";
import Card from "../user-test-booking/Card";

const FacilityCard = ({extraLinks ,loading}) => {
  const [testType, setTestType] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);


  const handleCardClick = (data) => {
    setTestType(data.name);
    setSearchQuery("");
    setOpenModal(true); 
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTestType(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); 
  };

  const isModalContentReady = testType && extraLinks.length > 0;

  if (loading) return <p className={styles.status}>Loading...</p>;
  if (error) return <p className={styles.status}>{error}</p>;

  return (
    <Card
      title={"Facility Category"}
      searchQuery={searchQuery}
      handleSearchChange={handleSearchChange}
      openModal={openModal}
      handleCloseModal={handleCloseModal}
      facility={extraLinks}
      handleCardClick={handleCardClick}
      testType={testType}
      isModalContentReady={isModalContentReady}
      isRadiology={true}
    />
  );
};

export default FacilityCard;
