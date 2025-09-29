import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addRadiologyItemToCart,
  cartValue,
  removeRadiologyItemFromCart,
} from "../../../Redux/reducer";

const FacilityItem = ({ data }) => {
  const dispatch = useDispatch();
  const cart = useSelector(cartValue);
  const isAdded = cart.some((item) => item.id === data.id);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.1,
          width: "100%", // take full row width
          "&:hover": {
            backgroundColor: "#f8fafc",
          },
        }}
      >
        {/* Left side (Details + Pricing) */}
        <Box sx={{ p: 1, flex: 1 }}>
          {/* Study Type */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ color: "#0f172a", whiteSpace: "nowrap" }}
            >
              {data.type_of_study}
            </Typography>

            <Typography
              fontWeight={500}
              sx={{ color: "red", whiteSpace: "nowrap" }}
            >
              ● {data.lab_details.lab_name}
            </Typography>
          </Box>

          {/* Pricing Section */}
          <Box sx={{ mt: 1 }}>
            <Typography
              fontWeight={600}
              sx={{ color: "blue", whiteSpace: "nowrap" }}
            >
              ● {data.facility}
            </Typography>
          </Box>

          {/* Pricing Section below */}
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mt: 1 }}>
            {/* Column 1: Standard Prices */}
            <Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: "#475569" }}
              >
                MRP
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  color: "#b91c1c",
                  backgroundColor: "#fee2e2",
                  px: 1,
                  borderRadius: 1,
                  display: "inline-block",
                  mt: 0.3,
                }}
              >
                ₹{data.mrp || "N/A"}
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: "#475569", mt: 1 }}
              >
                Swasthyapro Rate
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  color: "#15803d",
                  backgroundColor: "#dcfce7",
                  px: 1,
                  borderRadius: 1,
                  display: "inline-block",
                  mt: 0.3,
                }}
              >
                ₹{data.swasthyapro_max_rate || "N/A"}
              </Typography>
            </Box>

            {/* Column 2: Study Prices */}
            <Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: "#475569" }}
              >
                Plain Study
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "#1e293b" }}>
                ₹{data.plain_study || "N/A"}
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: "#475569", mt: 0.5 }}
              >
                Contrast Study
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "#1e293b" }}>
                ₹{data.contrast_study || "N/A"}
              </Typography>
            </Box>

            {/* Column 3: Swasthyapro Study Prices */}
            <Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: "#475569" }}
              >
                Plain (Swasthyapro)
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "#15803d", fontWeight: 600 }}
              >
                ₹{data.plain_swasthyapro_rate || "N/A"}
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: "#475569", mt: 0.5 }}
              >
                Contrast (Swasthyapro)
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "#15803d", fontWeight: 600 }}
              >
                ₹{data.contrast_swasthyapro_rate || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right side (Add to Cart button) */}
        <Stack direction="row" alignItems="center" sx={{ ml: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              isAdded
                ? dispatch(removeRadiologyItemFromCart(data))
                : dispatch(addRadiologyItemToCart(data))
            }
            sx={{
              backgroundColor: "#0f172a",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              "&:hover": { backgroundColor: "#1e293b" },
              whiteSpace: "nowrap",
            }}
          >
            {isAdded ? "Remove" : "Add to Cart"}
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default FacilityItem;
