import { LucideDelete } from "lucide-react";

const CartSidebar = ({
  isModalOpen,
  closeModal,
  tests,
  packages,
  handleDeleteTest,
  handleDeletePackage,
  customPrice,
  setCustomPrice,
  dmlCharge,
  setDMLcharge,
  additionalCharge,
  setAdditionalCharge,
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  timeSlots,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  cartData,
  handleClick,
  loading,
}) => {
  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() - 6);

  return (
    isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-start justify-end bg-opacity-30 backdrop-blur-sm">
        <div className="relative w-full sm:w-[400px] max-w-full bg-white h-screen shadow-lg flex flex-col rounded-l-xl">
          {/* Header */}
          <div className="p-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-blue-600">Booking Summary</h2>
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

            {/* Discount */}
            <div className="text-left text-black">
              <label htmlFor="customPrice" className="block mb-1 font-medium">
                Discount Price :
              </label>
              <input
                type="number"
                id="customPrice"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your price"
              />
            </div>
            {/* Additional Charge */}
            <div className="text-left text-black">
              <label
                htmlFor="additionalCharge"
                className="block mb-1 font-medium"
              >
                Additional Charges :
              </label>
              <input
                type="number"
                id="additionalCharge"
                value={additionalCharge}
                onChange={(e) => setAdditionalCharge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter Additional Charges"
              />
            </div>

            {/* DML Charge */}
            <div className="text-left text-black">
              <label htmlFor="dmlCharge" className="block mb-1 font-medium">
                DML Charge :
              </label>
              <input
                type="number"
                id="dmlCharge"
                value={dmlCharge}
                onChange={(e) => setDMLcharge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter DML Charge"
              />
            </div>

            {/* Date Picker */}
            <div className="text-left text-black">
              <label htmlFor="date" className="block mb-1 font-medium">
                <span className="text-red-600 p-1">*</span>Select Date:
              </label>
              {/* <input
                type="date"
                id="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              /> */}

              <input
                type="date"
                id="date"
                value={selectedDate}
                min={minDate.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Time Slot */}
            <div className="text-left text-black">
              <label htmlFor="timeSlot" className="block mb-1 font-medium">
                <span className="text-red-600 p-1">*</span> Select Time Slot:
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
                        (c) => c.id === e.target.value,
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

          {/* Footer */}
          <div className="px-4 pb-2 text-black border-t">
            <div className="flex justify-between items-center pt-4">
              <span className="font-semibold text-lg">Total Price:</span>
              <span className="font-bold text-xl text-green-600">
                {/* ₹{cartData.total - (customPrice || 0) + Number(dmlCharge || 0)} */}
                ₹
                {cartData.total -
                  Number(customPrice || 0) +
                  Number(dmlCharge || 0) +
                  Number(additionalCharge || 0)}
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
              {["Send Payment Link", "COD"].map((label) => (
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
    )
  );
};

export default CartSidebar;
