import { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Pagination,
  IconButton,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import debounce from "lodash.debounce";
import FilterSidebar from "../../components/user-radiology-bookings/filter-sidebar/LabFilterSidebar";
import AllFacilityCards from "../../components/user-radiology-bookings/allFacility/AllFacility";
import { useDispatch, useSelector } from "react-redux";
import { cartValue, changeNavValue } from "../../Redux/reducer";
import RadiologyCartSidebar from "../../components/user-radiology-bookings/cart-sidebar/Cart-Sidebar";
import axios from "axios";
import { useLocation } from "react-router-dom";

const itemsPerPage = 4;

const fetchTests = async (center, test, cb) => {
  try {
    const res = await fetch(
      `https://api.swasthyapro.com/api/labs/search-radiology-tests?q=${test}&centre=${center}`
    );
    cb(null, await res.json());
  } catch (err) {
    console.error("❌ tests:", err);
    cb(err);
  }
};

const labs = [
  { name: "SRM", id: "Lab_51005236" },
  { name: "Capital Health & Diagnostic Clinic", id: "Lab_80577999" },
  { name: "Health quest imaging and diagnostics", id: "Lab_53885877" },
  { name: "Rayplus diagnostics", id: "Lab_51378981" },
];
const timeSlots = [
  "06:00 AM - 08:00 AM",
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

const RadiologyFacilities = () => {
  const [facilityName, setFacilityName] = useState("");
  const [tests, setTests] = useState([]);
  const [center, setCenter] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const cartData = useSelector(cartValue);
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = location.state || {};

  /* ---------------- Debounced search handler ---------------- */
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setFacilityName(value || "");
        setCurrentPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    dispatch(changeNavValue("Book test for " + user.fullName));
  }, []);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    fetchTests(center, facilityName, (err, data) => {
      if (!err && data) {
        setTests(data.data || []);
      }
      setLoading(false);
    });
  }, [center, facilityName]);

  // Reset pagination when center changes
  useEffect(() => {
    setCurrentPage(1);
  }, [center]);

  const fetRadiologyCart = async (stored) => {
    try {
      const res = await axios.post(
        "https://api.swasthyapro.com/api/labs/radiology-tests/by-ids",
        {
          ids: stored.map((i) => i.id),
        }
      );
      setCartItems(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Load cart items from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("radiology")) || [];
    if (stored?.length > 0) {
      fetRadiologyCart(stored);
    }
  }, [isModalOpen]);

  /* ---------------- Paginated Data ---------------- */
  const totalPages = Math.ceil(tests.length / itemsPerPage);
  const paginatedTests = tests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* 🔍 Searchbar + Chip + Cart Icon Section (TOP) */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Left Side: Search & Chip */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            onChange={handleSearchChange}
            placeholder="Search facility name..."
            size="small"
            variant="outlined"
            sx={{ width: { xs: "100%", sm: "250px" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Center Chip */}
          {center && (
            <Chip
              label={
                labs.find((lab) => lab.id === center)?.name || "Selected Center"
              }
              variant="outlined"
              onDelete={() => setCenter(undefined)}
            />
          )}
        </Box>

        {/* Right Side: Cart Icon */}
        <IconButton
          onClick={() => setIsModalOpen(true)}
          disabled={cartData.length === 0}
        >
          <Badge badgeContent={cartData.length} color="error">
            <ShoppingCartIcon color="action" />
          </Badge>
        </IconButton>
      </Box>

      {/* Sidebar + Cards (BELOW search bar) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Sidebar */}
        <FilterSidebar
          labs={labs}
          center={center}
          onFilterChange={setCenter}
          showAll={true}
        />

        {/* Facility Cards */}
        <Box sx={{ flex: 1, px: 2 }}>
          <AllFacilityCards
            testData={paginatedTests}
            isLoading={loading}
            center={center}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                shape="rounded"
              />
            </Box>
          )}
        </Box>
      </Box>

      <RadiologyCartSidebar
        user={user}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        cartData={cartItems}
        setCartData={setCartItems}
        timeSlots={timeSlots}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
      />
    </Box>
  );
};

export default RadiologyFacilities;
