import React from "react";

const formatINR = (n) => {
  if (n === 0) return "0";
  if (n == null || !isFinite(Number(n))) return "—";
  return new Intl.NumberFormat("en-IN").format(Number(n));
};

const PriceRow = ({ label, value, highlight }) => (
  <div className="flex justify-between text-xs">
    <span className="text-gray-500">{label}</span>
    <span
      className={highlight ? "font-semibold text-blue-600" : "text-gray-800"}
    >
      {value != null ? `₹${formatINR(value)}` : "—"}
    </span>
  </div>
);

const RadiologyFacility = ({
  facilityName,
  testList,
  selectedTestNames,
  handleCheckboxChange,
  highlightText,
  searchQuery,
}) => {
  return (
    <div className="w-full p-3 sm:p-4 max-w-5xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">
        {facilityName?.toUpperCase()}
      </h2>

      {testList.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No tests available.</p>
      ) : (
        <div className="space-y-3">
          {testList.map((test, idx) => {
            const name = test.test_name || test.type_of_study || "—";
            const selected = selectedTestNames.includes(name);

            const mrp = test.mrp ?? test.market_price ?? null;
            const plainStudy = test.plain_study ?? null;
            const contrastStudy = test.contrast_study ?? null;
            const plainRate = test.plain_swasthyapro_rate ?? null;
            const rate =
              test.swasthyapro_rate ?? test.after_discount_price ?? null;
            const contrastSwasthyaproRate =
              test.contrast_swasthyapro_rate ?? null;
            const primary = rate ?? plainRate ?? contrastStudy ?? mrp ?? 0;

            return (
              <label
                key={test.id ?? `${name}-${idx}`}
                className="flex justify-between items-start gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition"
              >
                {/* Left side: checkbox + name */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleCheckboxChange(test)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {highlightText ? highlightText(name, searchQuery) : name}
                  </span>
                </div>

                {/* Right side: compact price breakdown */}
                <div className="text-right space-y-1 min-w-[180px]">
                  <div className="text-blue-600 font-semibold text-base">
                    ₹{formatINR(primary)}
                  </div>
                  <PriceRow label="MRP" value={mrp} />
                  <PriceRow label="Plain Study" value={plainStudy} />
                  <PriceRow label="Contrast Study" value={contrastStudy} />
                  <PriceRow label="Plain SwasthyaPro" value={plainRate} />
                  <PriceRow label="SwasthyaPro Rate" value={rate} highlight />
                  <PriceRow
                    label="Contrast SwasthyaPro Rate"
                    value={contrastSwasthyaproRate}
                    highlight
                  />
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RadiologyFacility;
