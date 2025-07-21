import { Layers } from 'lucide-react';


function DashboardCard({ title, value, color, icon }) {
  const Icon = icon || Layers;
 
  return (
    <div className=" rounded-lg shadow p-6 shadow-sm shadow-cyan-500/50">
      <div className={`w-12 h-12 ${color} rounded-lg mb-4 flex items-center justify-center text-green shadow-lg shadow-cyan-500/50`}>
        <Icon size={24} />
      </div>
      <h3 className="text-gray-500 text-lg font-bold mb-1">{title}</h3>
      <p className="text-3xl text-green font-bold">{value}</p>
    </div>
  );
}

export default DashboardCard;