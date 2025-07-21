import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
  try {
    const tests = JSON.parse(localStorage.getItem("tests")) || [];
    const packages = JSON.parse(localStorage.getItem("packages")) || [];

    if (!Array.isArray(tests) || !Array.isArray(packages)) {
      return [];
    }

    return [...tests, ...packages];
  } catch (error) {
    console.error("Error parsing localStorage data", error);
    return [];
  }
};

const navBarSlice = createSlice({
  name: "navbar",
  initialState: {
    navBarValue: null,
    cart: getInitialCart(),
  },
  reducers: {
    changeNavValue: (state, action) => {
      state.navBarValue = action.payload;
    },
    addToCart: (state, action) => {
      const currentStored = JSON.parse(localStorage.getItem("tests")) || [];
      const testIndex = currentStored.findIndex(t => t.name === action.payload.test.test_name);
      let updatedTests = [...currentStored];

      if (action.payload.isSelected) {
        if (testIndex !== -1) {
          updatedTests = currentStored.filter((t) => t.name !== action.payload.test.test_name);
        }
      } else {
        if (testIndex === -1) {
          updatedTests.push({
            id:action.payload.test.id,
            name: action.payload.test.test_name,
            price: Number(action.payload.test.after_discount_price),
          });
        }
      }

      localStorage.setItem("tests", JSON.stringify(updatedTests));
      state.cart = getInitialCart();
    },
    addPackageToCart: (state, action) => {
      const currentStored = JSON.parse(localStorage.getItem("packages")) || [];
      const packageIndex = currentStored.findIndex(pkg => pkg.name === action.payload.package.Package_type);
      let updatedPackages = [...currentStored];

      if (action.payload.isSelected) {
        if (packageIndex !== -1) {
          updatedPackages = currentStored.filter((pkg) => pkg.name !== action.payload.package.Package_type);
        }
      } else {
        if (packageIndex === -1) {
          updatedPackages.push({
            id:action.payload.package.id,
            name: action.payload.package.Package_type,
            price: Number(action.payload.package.after_discount_price),
          });
        }
      }

      localStorage.setItem("packages", JSON.stringify(updatedPackages));

      state.cart = getInitialCart();
    },
  },
});

export const { changeNavValue, addToCart, addPackageToCart } = navBarSlice.actions;
export const navVal = (state) => state.navReducer.navBarValue;
export const cartValue = (state) => state.navReducer.cart;

export default navBarSlice.reducer;
