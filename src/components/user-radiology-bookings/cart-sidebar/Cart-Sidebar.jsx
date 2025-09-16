import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  Tooltip,
 
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart, removeRadiologyItemFromCart } from "../../../Redux/reducer";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RadiologyCartSidebar = ({
  user,
  isModalOpen = true,
  closeModal = () => {},
  cartData = [],
  setCartData = () => {},
  selectedDate = "",
  setSelectedDate = () => {},
  selectedTimeSlot = "",
  setSelectedTimeSlot = () => {},
  timeSlots = [],
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Discount prices state per item
  const [discountPrices, setDiscountPrices] = useState(
    cartData.reduce((acc, item) => {
      acc[item.id] = 0;
      return acc;
    }, {})
  );

  // Pay Now modal
  const [totalDiscount, setTotalDiscount] = useState(0);
  const handleDiscountChange = (id, value) => {
    setDiscountPrices((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  // Remove item from cart
  const handleRemoveItem = (removedItem) => {
    const updatedCart = cartData.filter((item) => item.id !== removedItem.id);
    if (updatedCart.length === 0) {
      dispatch(clearCart());
      closeModal();
    } else {
      setCartData(updatedCart);
      dispatch(removeRadiologyItemFromCart(removedItem));

      const updatedDiscounts = { ...discountPrices };
      delete updatedDiscounts[removedItem.id];
      setDiscountPrices(updatedDiscounts);
    }
  };

  const totalPrice = cartData.reduce((acc, item) => {
    const discount = discountPrices[item.id] || 0;
    const netPrice = (item.swasthyapro_max_rate || 0) - discount;
    return Number(acc) + Number(netPrice);
  }, 0);

  const orderCodPlaced = async (atCenter) => {
    if (!selectedDate || !selectedTimeSlot) {
      Swal.fire({
        icon: "warning",
        title: "Please select a date and time slot before booking.",
      });
      return;
    }
    closeModal();
    let idsArr = [];
    let nameArr = [];
    let priceArr = [];

    cartData.forEach((item) => {
      idsArr.push(item.id);
      nameArr.push(item.type_of_study);
      priceArr.push(Number(item.swasthyapro_max_rate));
    });

    const total_amount = cartData.reduce((acc, item) => {
      return acc + Number(item.mrp || 0);
    }, 0);
   const total_swasthyaproPrice = cartData.reduce((acc, item) => {
      return acc + Number(item.swasthyapro_max_rate || 0);
    }, 0);
    const test_name = cartData.map((item) => ( 
      {
      
      name: item.type_of_study,
      netprice:
        Number(item.swasthyapro_max_rate) -
        Number(discountPrices[item.id]|| 0),
        price:item.swasthyapro_max_rate,
        discount:Number(discountPrices[item.id]|| 0)
    }
  ));
    try {
      // 🔵 Show loading alert
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we place your booking",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Step 1: Add to cart
      const bookTest = await axios.post(
        "https://api.swasthyapro.com/api/cart/add-cart",
        {
          userId: user.id,
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

      // Step 2: Book radiology test
      const response = await axios.post(
        "https://api.swasthyapro.com/api/labs/radiology/booking",
        {
          user_id: user.id,
          booking_date: selectedDate,
          labId: cartData[0]?.lab || "",
          slot_time: selectedTimeSlot,
          test_name,
          total_amount: total_swasthyaproPrice,
          additional_discount: totalDiscount,
          net_amount: totalPrice - Number(totalDiscount),
          payment_status: atCenter ? "pending" : "paid",
          report_status: "pending",
          report_shared: false,
          payment_method: "UPI",
        }
      );
      if (response.status === 201) {
        await axios.post("https://api.swasthyapro.com/api/sms/send-whatsapp", {
          mobile: "91" + user.contact,
          template_name: "radiology_book_confirm",
          template_values: {
            1: user.fullName,
            2: response.data.data.id,
            3: nameArr.map((item) => item).join(", "),
            4: response.data.data.net_amount,
            5: total_amount,
            6:
              Math.ceil(
                100 - (response.data.data.net_amount / total_amount) * 100
              ) + "%",
            7: atCenter ? "pending" : "paid",
            8: selectedTimeSlot,
            9: selectedDate,
            10: cartData[0]?.lab_details?.lab_name || "",
            11: cartData[0]?.lab_details?.location || "",
            12: cartData[0]?.lab_details?.phone,
            13: cartData[0]?.lab_details?.map_location_link || "",
          },
        });
        await axios.post(
          "https://api.swasthyapro.com/api/mail/send-radiology-appointment",
          {
            userName: user.fullName,
            userEmail: user.email,
            bookingId: response.data.data.id,
            testName: nameArr.map((item) => item).join(", "),
            mrp: total_amount,
            price: response.data.data.net_amount,
            discount:
              Math.ceil(
                100 - (response.data.data.net_amount / total_amount) * 100
              ) + "%",
            paymentStatus: atCenter ? "pending" : "paid",
            time: selectedTimeSlot,
            date: selectedDate,
            centerName: cartData[0]?.lab_details?.lab_name || "",
            centerAddress: cartData[0]?.lab_details?.location || "",
            centerPhone: cartData[0]?.lab_details?.phone,
            map_link: cartData[0]?.lab_details?.map_location_link || "",
          }
        );
        localStorage.removeItem("radiology");
        dispatch(clearCart());
        setSelectedDate("");
        setSelectedTimeSlot("");
        setTotalDiscount("");
        navigate("/radiology-orders");
        Swal.fire({
          icon: "success",
          title: "Booking Confirmed!",
          text: "Your tests have been booked successfully.",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Booking error:", err);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: "Something went wrong while placing your booking.",
      });
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/20 backdrop-blur-sm">
        <div className="relative w-full sm:w-[400px] max-w-full bg-white h-screen shadow-xl flex flex-col rounded-l-xl">
          {/* Header */}
          <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-700">Booking Summary</h2>
            <button
              onClick={closeModal}
              className="text-2xl text-gray-400 hover:text-gray-700 transition"
            >
              &times;
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto px-4 py-4 flex-1 space-y-4">
            {cartData.length === 0 && (
              <p className="text-gray-500 text-center mt-6">
                No items in the cart.
              </p>
            )}

            {cartData.map((item) => {
              const discount = discountPrices[item.id] || 0;
              const netPrice = (item.swasthyapro_max_rate || 0) - discount;

              return (
                <div
                  key={item.id}
                  className="p-3 border rounded-lg shadow-sm hover:shadow-md transition flex flex-col gap-2 bg-gray-50"
                >
                  {/* Header + Remove */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-900 text-base">
                        {item.type_of_study}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {item.facility}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Price Section */}
                  <div className="flex flex-wrap gap-3 items-center text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">MRP</span>
                      <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                        ₹{item.mrp || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        Swasthyapro Rate
                        {item.swasthyapro_rate && (
                          <Tooltip
                            title={`Maximum Rate: ₹${item.swasthyapro_rate}`}
                            arrow
                          >
                            <InformationCircleIcon className="text-gray-400 w-4 h-4 cursor-pointer" />
                          </Tooltip>
                        )}
                      </span>
                      <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                        ₹{item.swasthyapro_max_rate || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Discount & Net Price */}
                  <div className="flex gap-2 items-center mt-2">
                    <div className="flex-1">
                      <label className="block mb-1 text-gray-700 text-xs">
                        Discount Price
                      </label>
                      <input
                        type="string"
                        value={discount}
                        onChange={(e) =>
                          handleDiscountChange(item.id, e.target.value)
                        }
                        className="w-full px-2 py-1 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                        placeholder="Enter discount"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1 text-gray-700 text-xs">
                        Net Price
                      </label>
                      <input
                        type="number"
                        value={netPrice}
                        disabled
                        className="w-full text-black px-2 py-1 border border-gray-300 rounded-md text-sm bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mt-4">
              <label className="block mb-1 text-gray-700 text-sm">
                Additional Discount
              </label>
              <input
                type="string"
                value={totalDiscount}
                onChange={(e) => setTotalDiscount(e.target.value)}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>
            {/* Date Picker */}
            <div className="mt-4">
              <label className="block mb-1 text-gray-700 text-sm">
                <span className="text-red-600">*</span> Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                required
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>

            {/* Time Slot */}
            <div className="mt-4">
              <label className="block mb-1 text-gray-700 text-sm">
                <span className="text-red-600">*</span> Select Time Slot:
              </label>
              <select
                value={selectedTimeSlot}
                required
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              >
                <option value="">-- Choose Time Slot --</option>
                {timeSlots.map((slot, idx) => (
                  <option key={idx} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 border-t flex flex-col gap-3">
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-base text-black">
                Total Price:
              </span>
              <span className="font-bold text-lg text-green-700">
                ₹{totalPrice - Number(totalDiscount)}
              </span>
            </div>

            {/* Pay Now Button */}
           <button
  onClick={() => {
    if (!selectedDate || !selectedTimeSlot) {
      Swal.fire({
        icon: "warning",
        title: "Please select a date and time slot before booking.",
      });
      return;
    }

    // 🔵 Show SweetAlert with two options
    Swal.fire({
      title: "Choose Payment Option",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Pay at Swasthyapro",
      denyButtonText: "Pay at Center",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a", // green
      denyButtonColor: "#2563eb",    // blue
      cancelButtonColor: "#6b7280",  // gray
    }).then(async (result) => {
      if (result.isConfirmed) {
        await orderCodPlaced(false); // Swasthyapro
      } else if (result.isDenied) {
        await orderCodPlaced(true); // Center
      }
    });
  }}
  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
>
  Pay Now
</button>
          </div>
        </div>
      </div>
    )
  );
};

export default RadiologyCartSidebar;

