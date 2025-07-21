import { useEffect, useState } from "react";
import PackagesCard from "./Packages";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TestsCard from "./TestCards";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { cartValue } from "../Redux/reducer";
import { LucideDelete } from "lucide-react";
const SwitchTabs = ({ userData }) => {
  const [selectedTab, setSelectedTab] = useState("tests");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [cartData, setCartData] = useState({
    tests: [],
    packages: [],
    total: 0,
  });

  const timeSlots = [
    "06:00 AM - 08:00 AM",
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
  ];

  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const cart = useSelector(cartValue);
  const [customPrice, setCustomPrice] = useState("");

  useEffect(() => {
    fetch("https://api.swasthyapro.com/api/coupons/all-coupon")
      .then((res) => res.json())
      .then((data) => setCoupons(data))
      .catch((err) => console.error("Error loading coupons:", err));
  }, []);

  const renderComponent = (tab) => {
    return tab === "tests" ? <TestsCard /> : <PackagesCard />;
  };

  const orderCodPlaced = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      Swal.fire({
        icon: "warning",
        title: "Please select a date and time slot before booking.",
      });
      return;
    }

    let idsArr = [];
    let nameArr = [];
    let priceArr = [];
    const cartDetails = [...packages, ...tests];

    cartDetails.forEach((item) => {
      idsArr.push(item.id);
      nameArr.push(item.name);
      priceArr.push(Number(item.price));
    });

    Swal.fire({
      title: "Processing your order...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    let cartId;
    try {
      const bookTest = await axios.post(
        "https://api.swasthyapro.com/api/cart/add-cart",
        {
          userId: userData.id,
          testIds: idsArr,
          testNames: nameArr,
          testPrices: priceArr,
        }
      );
      if (!bookTest.data.cart) {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Failed to add tests to the cart.",
        });
        return;
      }

      cartId = bookTest.data.cart.id;
    } catch (err) {
      console.error("Add to cart error:", err);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Cart Error",
        text: "Something went wrong while adding items to the cart.",
      });
      return;
    }

    let bookingId;
    try {
      const bookTestCOD = await axios.post(
        "https://api.swasthyapro.com/api/book/book-test-cod",
        {
          user_id: userData.id,
          cart_id: cartId,
          amount: cartData.total - (customPrice || 0),
          scheduled_date: selectedDate,
          timeslot: selectedTimeSlot,
        }
      );

      if (bookTestCOD.status !== 201) {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Failed to book the test via COD.",
        });
        return;
      }

      bookingId = bookTestCOD.data.booking.booking_id;
    } catch (err) {
      console.error("COD booking error:", err);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "COD Booking Error",
        text: "Unable to complete your COD booking.",
      });
      return;
    }

    try {
      const sendCOD_email = await axios.post(
        "https://api.swasthyapro.com/api/mail/send-cod-mail",
        {
          userName: userData.fullName,
          userEmail: userData.email,
          orderId: bookingId,
          amount: cartData.total - (customPrice || 0),
        }
      );

      Swal.close();

      if (sendCOD_email.status === 200) {
        Swal.fire({
          icon: "success",
          title: "COD test booked!",
          text: "Please assign the DML.",
        });
        setIsModalOpen(false);
        setTimeout(() => {
          navigate("/user-orders");
        }, 2000);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Booking succeeded, but failed to send email.",
        });
      }
    } catch (err) {
      console.error("Email error:", err);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Booking done, but email failed!",
      });
    }
  };

  const handleClick = (label) => {
    if (label === "COD") {
      orderCodPlaced();
    } else {
      OrderPlaced(label);
    }
  };

  const handleDeleteTest = (indexToRemove) => {
    const updatedTests = [...cartData.tests];
    updatedTests.splice(indexToRemove, 1);
    localStorage.setItem("tests", JSON.stringify(updatedTests));
    const updatedTotal =
      updatedTests.reduce((sum, item) => sum + Number(item.price), 0) +
      cartData.packages.reduce((sum, item) => sum + Number(item.price), 0);

    setCartData({
      ...cartData,
      tests: updatedTests,
      total: updatedTotal,
    });
  };

  const handleDeletePackage = (indexToRemove) => {
    const updatedPackages = [...cartData.packages];
    updatedPackages.splice(indexToRemove, 1);

    localStorage.setItem("packages", JSON.stringify(updatedPackages));

    const updatedTotal =
      cartData.tests.reduce((sum, item) => sum + Number(item.price), 0) +
      updatedPackages.reduce((sum, item) => sum + Number(item.price), 0);

    setCartData({
      ...cartData,
      packages: updatedPackages,
      total: updatedTotal,
    });
    cart.length < 0 && setIsModalOpen(false);
  };

  const openModal = () => {
    const tests = JSON.parse(localStorage.getItem("tests")) || [];
    const packages = JSON.parse(localStorage.getItem("packages")) || [];
    const total =
      tests.reduce((sum, item) => sum + Number(item.price), 0) +
      packages.reduce((sum, item) => sum + Number(item.price), 0);
    if (tests.length > 0 || packages.length > 0) {
      setIsModalOpen(true);
      setCartData({ tests, packages, total });
    } else {
      Swal.fire({
        icon: "error",
        title: "Please Select At Least One Test",
      });
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const { tests, packages, total } = cartData;

  const OrderPlaced = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please select a date and time slot before booking.",
      });
      return;
    }

    const dateTime = new Date(selectedDate);
    dateTime.setHours(10, 30, 0, 0);
    const formattedDate = dateTime.toISOString();
    const data = {
      userid: userData.id,
      name: userData.fullName,
      email: userData.email,
      amount: cartData.total - (customPrice || 0),
      scheduled_date: formattedDate,
      timeSlot: selectedTimeSlot,
      tests,
      packages,
      couponName: selectedCoupon?.coupon_name || null,
      couponDiscount: selectedCoupon?.discount_percentage || 0,
    };

    try {
      Swal.fire({
        title: "Booking in progress...",
        text: "Please wait while we process your request.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        "https://api.swasthyapro.com/api/book/admin/send-payment-link",
        data
      );

      if (response.data.message === "Payment link created and email sent") {
        Swal.fire({
          title: "Success!",
          text: "Test booked successfully. Payment link sent via email.",
          icon: "success",
          confirmButtonText: "OK",
        });
        localStorage.removeItem("tests");
        localStorage.removeItem("packages");

        setTimeout(() => {
          navigate("/all-users");
          Swal.close();
        }, 2000);
      }
    } catch (err) {
      console.error("Booking Error:", err);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Something went wrong!",
        timer: 1000,
      });
      // Swal.close()
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg text-center relative">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button
          onClick={() => setSelectedTab("tests")}
          className={`w-48 py-3 px-8 rounded-lg font-semibold transition ${
            selectedTab === "tests"
              ? "bg-blue-600 text-white shadow-lg"
              : "border border-blue-600 text-blue-600 bg-blue-200"
          }`}
        >
          Tests
        </button>
        <button
          onClick={() => setSelectedTab("packages")}
          className={`w-48 py-3 px-8 rounded-lg font-semibold transition ${
            selectedTab === "packages"
              ? "bg-blue-600 text-white shadow-lg"
              : "border border-blue-600 text-blue-600 bg-blue-200"
          }`}
        >
          Packages
        </button>
      </div>

      {/* Cart Icon */}
      <div className="absolute top-6 right-6">
        <button
          onClick={openModal}
          className="relative text-blue-600 hover:text-blue-800 transition-all"
          title="View Cart"
        >
          <ShoppingCartIcon className="w-8 h-8" />
          {(JSON.parse(localStorage.getItem("tests"))?.length || 0) +
            (JSON.parse(localStorage.getItem("packages"))?.length || 0) >
            0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 shadow-md">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="mt-8">{renderComponent(selectedTab)}</div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-opacity-30 backdrop-blur-sm">
          <div className="relative w-full sm:w-[400px] max-w-full bg-white h-screen shadow-lg flex flex-col rounded-l-xl">
            {/* Header */}
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-blue-600">
                Booking Summary
              </h2>
              <button
                onClick={closeModal}
                className="absolute text-2xl text-gray-500 top-4 right-4 hover:text-gray-700"
                aria-label="Close Modal"
              >
                &times;
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-4 py-4 flex-1 space-y-4">
              {/* Tests */}
              {tests.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-black">Tests</h3>
                  <ul className="space-y-2 text-black">
                    {tests.map((test, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-gray-500">
                            ₹{test.price}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTest(idx)}
                          title="Remove test"
                          className="text-red-500 hover:text-red-700"
                        >
                          <LucideDelete className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Packages */}
              {packages.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-black">Packages</h3>
                  <ul className="space-y-2 text-black">
                    {packages.map((pkg, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div>
                          <div className="font-medium">{pkg.name}</div>
                          <div className="text-sm text-gray-500">
                            ₹{pkg.price}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePackage(idx)}
                          title="Remove package"
                          className="text-red-500 hover:text-red-700"
                        >
                          <LucideDelete className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="text-left text-black">
                <label htmlFor="customPrice" className="block mb-1 font-medium">
                  Discount Price :
                </label>
                <input
                  type="number"
                  id="customPrice"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your price"
                  min={0}
                />
              </div>

              {/* Date Picker */}
              <div className="text-left text-black">
                <label htmlFor="date" className="block mb-1 font-medium">
                  Select Date:
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Time Slot */}
              <div className="text-left text-black">
                <label htmlFor="timeSlot" className="block mb-1 font-medium">
                  Select Time Slot:
                </label>
                <select
                  id="timeSlot"
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Choose Time Slot --</option>
                  {timeSlots.map((slot, idx) => (
                    <option key={idx} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coupons */}
              {coupons.length > 0 && (
                <div className="text-left text-black">
                  <label
                    htmlFor="couponSelect"
                    className="block mb-1 font-medium"
                  >
                    Available Coupons:
                  </label>
                  <div className="relative">
                    <select
                      id="couponSelect"
                      value={selectedCoupon?.id || ""}
                      onChange={(e) => {
                        const selected = coupons.find(
                          (c) => c.id === e.target.value
                        );
                        setSelectedCoupon(selected || null);
                      }}
                      className="w-full px-3 py-2 border border-blue-600 rounded-md text-sm text-blue-600 bg-white"
                    >
                      <option value="">-- Select a Coupon --</option>
                      {coupons.map((coupon) => (
                        <option key={coupon.id} value={coupon.id}>
                          {coupon.coupon_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 pb-2 text-black border-t">
              <div className="flex justify-between items-center pt-4">
                <span className="font-semibold text-lg">Total Price:</span>
                <span className="font-bold text-xl text-green-600">
                  ₹{cartData.total - (customPrice || 0)}
                </span>
              </div>
              {selectedCoupon && (
                <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                  <span>Coupon Applied:</span>
                  <span className="text-blue-600">
                    -{selectedCoupon?.discount_percentage}%
                  </span>
                </div>
              )}
            </div>
            {/* Bottom Buttons */}
            <div className="p-4 border-t bg-white sticky bottom-0 z-10">
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                {["Book Test", "COD"].map((label) => (
                  <button
                    key={label}
                    onClick={() => handleClick(label)}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwitchTabs;
