import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useParams } from "react-router-dom";

const FilterSidebar = ({
  labs,
  center,
  onFilterChange,
  showAll = true,
}) => {
  const [selectedFilter, setSelectedFilter] = useState();
  const { facilityName } = useParams();

  useEffect(() => {
    onFilterChange(center || facilityName || "All");
    setSelectedFilter(center || facilityName || "All");
  }, [center]);

  useEffect(() => {
    onFilterChange(facilityName || center || "All");
    setSelectedFilter(facilityName || center || "All");
  }, [facilityName]);

  const handleCheckboxChange = (label) => {
    const newValue = selectedFilter === label ? "All" : label;
    setSelectedFilter(newValue);
    onFilterChange(newValue);
   
  };

  const filterContent = (
    <Box sx={{ width: 260, height: "80vh" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0f172a",
          p: 2,
          borderRadiusTop: "14px",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="white">
          Filters
        </Typography>
      </Box>

      <Typography
        fontWeight={600}
        gutterBottom
        sx={{ p: 1, textAlign: "center",color:"#0f172a" }}
      >
        Labs
      </Typography>
      <List>
        {showAll && (
          <ListItem disablePadding>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  checked={selectedFilter === "All"}
                  onChange={() => handleCheckboxChange("All")}
                  sx={{
                    color: "#0f172a",
                    "&.Mui-checked": {
                      color: "#0f172a",
                    },
                  }}
                />
              }
              label={"All"}
              sx={{
                ml: 1,
                "& .MuiFormControlLabel-label": {
                  textTransform: "capitalize",
                  fontWeight: 500,
                  color:"black"
                },
              }}
            />
          </ListItem>
        )}

        {labs.map((item, idx) =>
         <ListItem key={idx} disablePadding>
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    checked={selectedFilter === item.id}
                    onChange={() => handleCheckboxChange(item.id)}
                    sx={{
                      color: "#0f172a",
                      "&.Mui-checked": {
                        color: "#0f172a",
                      },
                    }}
                  />
                }
                label={item.name}
                sx={{
                  ml: 1,
                  "& .MuiFormControlLabel-label": {
                    textTransform: "capitalize",
                    fontWeight: 500,
                    color:"black"
                  },
                }}
              />
            </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
    

      {/* Desktop Sidebar */}
        <Box
          sx={{
            width: 260,
            height: "auto",
            border: "1px solid #eee",
            marginLeft: 10,
            borderRadius: "14px",
          }}
        >
          {filterContent}
        </Box>
    </>
  );
};

export default FilterSidebar;
