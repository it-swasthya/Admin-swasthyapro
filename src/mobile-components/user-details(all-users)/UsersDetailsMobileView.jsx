import { useState } from "react";
import { Paper } from "@mui/material";

const UserDetailsMobileView = ({
  userData,
  // handleOpenModal,
  handleBookTest,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = userData.filter((user) =>
    Object.values(user).some((val) =>
      val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = text.toString().split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          style={{
            background: "linear-gradient(90deg, #f7b733, #fc4a1a)",
            color: "white",
            padding: "2px 4px",
            borderRadius: "4px",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-full mx-auto lg:shadow-lg rounded-lg lg:bg-white lg:p-4 mb-12">
      <div className="px-3 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        />
      </div>

      <div className="space-y-4 w-full px-3">
        {filteredUsers.map((user, index) => (
          <Paper
            key={index}
            className="p-3 rounded-xl shadow-sm border bg-white hover:shadow-md"
          >
            <div className="mb-2">
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                {highlightText(user.fullName, searchQuery)}
              </h2>
              <p className="text-xs text-gray-500">
                ID: {highlightText(user?.id, searchQuery)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-700 mb-3">
              {[
                ["Contact", user?.contact],
                ["Email", user?.email],
                ["Age", user?.age],
                ["Address", user?.address],
                ["Pincode", user?.pincode],
                ["State", user?.state],
                ["DOB", user?.DOB && new Date(user?.DOB).toLocaleDateString()],
              ].map(([label, value], idx) => (
                <div key={idx}>
                  <span className="font-medium text-gray-500 text-xs">
                    {label}:
                  </span>
                  <br />
                  {highlightText(value, searchQuery)}
                </div>
              ))}
            </div>

            <div className="mt-1.5 flex flex-wrap gap-2">
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md px-2 py-1"
                onClick={() => handleBookTest(user)}
              >
                Book Test
              </button>
              {/* <button
                className="bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-md px-2 py-1"
                onClick={() => handleOpenModal(user, "reports")}
              >
                Reports
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-medium rounded-md px-2 py-1"
                onClick={() => handleOpenModal(user, "prescriptions")}
              >
                Prescriptions
              </button> */}
            </div>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export { UserDetailsMobileView };
