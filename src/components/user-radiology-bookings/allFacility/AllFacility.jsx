import React, { useState } from "react";
import { Box, Typography, Button, useMediaQuery, Skeleton } from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FacilityItem from "./FacilityCard";

const AllFacilityCards = ({ testData, onNext, onBack, currentPage, totalPages, isLoading }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Skeleton placeholders
  const skeletons = Array.from({ length: isMobile ? 3 : 6 }, (_, i) => (
    <Box key={i} sx={{ py: 1 }}>
      <Skeleton width="80%" height={20} />
      <Skeleton width="60%" height={20} />
      <Skeleton width="40%" height={20} />
    </Box>
  ));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1000px",
        mx: "auto",
        border: "1px solid #ddd",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        pt: 2,
        px: 2,
        bgcolor: "#fafafa",
        position: "relative",
      }}
    >
      {/* Loader or Data */}
      {isLoading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 6 }}>
          {skeletons}
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0, pb: 1}}>
          {testData.length > 0 ? (
            testData.map((data, index) => (
              <FacilityItem
                data={data}
                handleAddToCart={() => setSidebarOpen(true)}
                key={index}
              />
            ))
          ) : (
            <Typography
              color="error"
              textAlign="center"
              sx={{ width: "100%" }}
            >
              Nothing to Show
            </Typography>
          )}
        </Box>
      )}

      {/* Pagination */}
      {/* <Box
        sx={{
          width: "100%",
          bgcolor: "#fafafa",
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: isMobile ? 1 : 0,
        }}
      >
        <Button
          variant="contained"
          sx={{
            visibility: currentPage > 1 ? "visible" : "hidden",
            backgroundColor: "transparent",
            boxShadow: "none",
            color: "#16a34a",
            ":hover": { backgroundColor: "transparent", boxShadow: "none" },
          }}
          onClick={onBack}
        >
          <ArrowLeft /> Back
        </Button>

        <Button
          variant="contained"
          sx={{
            visibility: currentPage < totalPages ? "visible" : "hidden",
            backgroundColor: "transparent",
            boxShadow: "none",
            color: "#16a34a",
            ":hover": { backgroundColor: "transparent", boxShadow: "none" },
          }}
          onClick={onNext}
        >
          Next <ArrowRight />
        </Button>
      </Box> */}
    </Box>
  );
};

export default AllFacilityCards;
