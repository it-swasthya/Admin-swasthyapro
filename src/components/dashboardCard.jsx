import React from "react";
import { Layers } from "lucide-react";

function DashboardCard({ title, value, color, icon }) {
  const Icon = icon || Layers;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 shadow-md bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-xl transition-all duration-300`}
    >
      {/* Decorative glow circle */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl"
           style={{ backgroundColor: color.replace("bg-", "") }}></div>

      {/* Icon container */}
      <div
        className={`w-14 h-14 ${color} bg-opacity-90 rounded-xl mb-5 flex items-center justify-center text-white shadow-lg shadow-${color}/40`}
      >
        <Icon size={28} />
      </div>

      {/* Title */}
      <h3 className="text-gray-600 text-lg font-semibold tracking-wide mb-1">
        {title}
      </h3>

      {/* Value */}
      <p className="text-4xl font-extrabold text-gray-900">{value}</p>

      {/* Accent bar */}
      <div className={`absolute bottom-0 left-0 w-full h-1 ${color} rounded-b-2xl`}></div>
    </div>
  );
}

export default DashboardCard;
