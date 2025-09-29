import React from "react";

const Tests = ({
  facilityName,
  testList,
  selectedTestNames,
  handleCheckboxChange,
  highlightText,
  searchQuery,
}) => {
  return (
    <div className="w-full p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8 text-center">
        {facilityName?.toUpperCase()}
      </h2>

      {testList.length === 0 ? (
        <p className="text-center text-gray-500">
          No tests available for this category.
        </p>
      ) : (
        <div className="space-y-4">
          {testList.map((test) => {
            const selected = selectedTestNames.includes(
              test.test_name || test.type_of_study
            );
            return (
              <label
                key={test.id}
                className="flex justify-between items-center p-3 sm:p-4 border border-gray-300 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleCheckboxChange(test)}
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <span className="text-gray-800 font-medium text-base sm:text-lg">
                    {highlightText(
                      test.test_name || test.type_of_study,
                      searchQuery
                    )}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400 line-through">
                    MRP ₹{test.market_price || test.mrp}
                  </div>
                  <div className="text-blue-600 font-semibold text-lg sm:text-xl">
                    ₹{test.after_discount_price || test.swasthyapro_rate}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tests;
