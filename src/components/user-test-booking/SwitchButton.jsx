import { useEffect, useState } from "react";
import PackagesCard from "../Packages";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TestsCard from "./TestCards";
import { useSelector } from "react-redux";
import { cartValue } from "../../Redux/reducer";
import CartIcon from "./CartIcon";
import CartSidebar from "./CartSidebar";
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
  const [dmlCharge, setDMLcharge] = useState("");

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
    let idsArr = [];
    let nameArr = [];
    let priceArr = [];
    const cartDetails = [...packages, ...tests];
    cartDetails.forEach((item) => {
      idsArr.push(item.id);
      nameArr.push(item.name);
      priceArr.push(Number(item.price));
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
        Swal.fire({
          icon: "error",
          title: "Failed to add tests to the cart.",
        });
        return;
      }

      cartId = bookTest.data.cart.id;
    } catch (err) {
      console.error("Add to cart error:", err);
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
          amount: cartData.total - (customPrice || 0) + Number(dmlCharge || 0),
          scheduled_date: selectedDate,
          timeslot: selectedTimeSlot,
          dmlCharges: Number(dmlCharge || 0),
        }
      );

      if (bookTestCOD.status !== 201) {
        Swal.fire({
          icon: "error",
          title: "Failed to book the test via COD.",
        });
        return;
      } else {
        Swal.fire({
          icon: "success",
          title: "Booking done",
        });
      }

      bookingId = bookTestCOD.data.booking.booking_id;
      return bookingId;
    } catch (err) {
      console.error("COD booking error:", err);
      Swal.fire({
        icon: "error",
        title: "COD Booking Error",
        text: "Unable to complete your COD booking.",
      });
      return;
    }
  };

  const handleYes = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      Swal.fire({
        icon: "warning",
        title: "Please select a date and time slot before booking.",
      });
      return;
    }
    try {
      Swal.fire({
        title: "Processing your order...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const bookingId = await orderCodPlaced();

      if (!bookingId) {
        Swal.fire({
          icon: "error",
          title: "Failed to book the test via COD.",
        });
        return null;
      }
      try {
        await axios.post(
          "https://api.swasthyapro.com/api/mail/send-cod-recieved-mail",
          {
            userName: userData.fullName,
            userEmail: userData.email,
            orderId: bookingId,
            amount:
              cartData.total - (customPrice || 0) + Number(dmlCharge || 0),
            paymentMethod: "UPI",
          }
        );
        await axios.post("https://api.swasthyapro.com/api/sms/send-whatsapp", {
          mobile: "91" + userData.contact,
          template_name: "path_order_confirm",
          template_values: {
            1: userData.fullName,
            2: bookingId,
            3: cartData.total - (customPrice || 0) + Number(dmlCharge || 0),
          },
        });
        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Booking done",
          text: `Booking ID: ${bookingId}. Confirmation email sent.`,
        });
        setIsModalOpen(false);
        setTimeout(() => {
          navigate("/user-orders");
        }, 2000);
      } catch (mailErr) {
        console.log(mailErr);
        setIsModalOpen(false);
        setTimeout(() => {
          navigate("/user-orders");
        }, 2000);
      }
      return bookingId;
    } catch (err) {
      console.error("COD booking error:", err);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "COD Booking Error",
        text: "Unable to complete your COD booking.",
      });
      return null;
    }
  };

  const handleNo = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      Swal.fire({
        icon: "warning",
        title: "Please select a date and time slot before booking.",
      });
      return;
    }
    try {
      Swal.fire({
        title: "Processing your order...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const bookingId = await orderCodPlaced();
      if (!bookingId) {
        Swal.fire({
          icon: "error",
          title: "Failed to book the test via COD.",
        });
        return null;
      }
      try {
        await axios.post("https://api.swasthyapro.com/api/mail/send-cod-mail", {
          userName: userData.fullName,
          userEmail: userData.email,
          orderId: bookingId,
          amount: cartData.total - (customPrice || 0) + Number(dmlCharge || 0),
        });
          await axios.post("https://api.swasthyapro.com/api/sms/send-whatsapp", 
       { "mobile": "91" + userData.contact,
  "template_name": "path_order_confirm",
  "template_values": {
    "1": userData.fullName,
    "2":bookingId ,
    "3":  cartData.total - (customPrice || 0) + Number(dmlCharge || 0),
  }
});
        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Booking done",
          text: `Booking ID: ${bookingId}. Confirmation email sent.`,
        });
        setIsModalOpen(false);
        setTimeout(() => {
          navigate("/user-orders");
        }, 2000);
      } catch (mailErr) {
        console.error("Send COD email error:", mailErr);
        Swal.fire({
          icon: "success",
          title: "Booking done",
          text: `Booking ID: ${bookingId}. (Email could not be sent)`,
        });
        setIsModalOpen(false);
        setTimeout(() => {
          navigate("/user-orders");
        }, 2000);
      }
      return bookingId;
    } catch (err) {
      console.error("COD booking error:", err);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "COD Booking Error",
        text: "Unable to complete your COD booking.",
      });
      return null;
    }
  };

  function askPaymentConfirmation(onYes, onNo) {
    Swal.fire({
      title: "Have you received the payment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (typeof onYes === "function") onYes();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (typeof onNo === "function") onNo();
      }
    });
  }
  const handleClick = (label) => {
    if (label === "COD") {
      askPaymentConfirmation(handleYes, handleNo);
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

  const { tests, packages } = cartData;

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

      <CartIcon openModal={openModal} cart={cart} />

      {/* Content */}
      <div className="mt-8">{renderComponent(selectedTab)}</div>

      {/* Modal */}
      <CartSidebar
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        tests={tests}
        packages={packages}
        handleDeleteTest={handleDeleteTest}
        handleDeletePackage={handleDeletePackage}
        customPrice={customPrice}
        setCustomPrice={setCustomPrice}
        dmlCharge={dmlCharge}
        setDMLcharge={setDMLcharge}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
        timeSlots={timeSlots}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
        cartData={cartData}
        handleClick={handleClick}
        loading={loading}
      />
    </div>
  );
};

export default SwitchTabs;
