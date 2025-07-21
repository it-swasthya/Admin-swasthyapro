import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BellIcon, X } from "lucide-react";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prevNotifs = useRef([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://api.swasthyapro.com/api/notification/all-notifications"
      );
      const data = Array.isArray(res.data) ? res.data : [];

      if (
        prevNotifs.current.length &&
        data.length > prevNotifs.current.length
      ) {
        const newOnes = data.slice(0, data.length - prevNotifs.current.length);
        newOnes.forEach((n) => {
          toast(`${n.title}: ${n.message}`);
        });
      }

      prevNotifs.current = data;
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setNotifications([]);
    }
  };

  const markAsRead = async (id) => {
    await axios.patch(
      `https://api.swasthyapro.com/api/notification/mark-read/${id}`
    );
    fetchNotifications();
  };

  const clearAll = async () => {
    await axios.delete(
      `https://api.swasthyapro.com/api/notification/delete-all`
    );
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.is_read).length
    : 0;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <div className="flex items-center justify-between ">
        {/* 🔔 Notification Summary */}
        <div className=" items-center space-x-3 overflow-hidden hidden md:flex">
          <div className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
            You have {notifications.length} message
            {notifications.length !== 1 ? "s" : ""}
          </div>

          {notifications.length > 0 && (
            <div className="bg-yellow-200 text-teal-800 text-md font-bold px-3 py-1 rounded-full shadow animate-pulse whitespace-nowrap overflow-hidden text-ellipsis ">
              {notifications[0].message} !!!
            </div>
          )}
        </div>

        {/* 🔔 Bell Icon */}
        <button onClick={() => setDrawerOpen(true)} className="relative">
          <BellIcon className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-black/30"
          onClick={() => setDrawerOpen(false)}
        >
          {/* Drawer Panel */}
          <div
            className="relative z-50 w-[350px] h-full bg-white shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-700">Notifications</h2>
              <button onClick={() => setDrawerOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Clear All */}
            <div className="flex justify-end mb-2">
              <button
                onClick={clearAll}
                className="text-xs text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700"
              >
                Clear All
              </button>
            </div>

            {/* Notification List */}
            {notifications.length ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`mb-3 p-3 rounded-md border ${
                    n.is_read ? "bg-gray-50" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <h3 className="font-semibold text-gray-800">{n.title}</h3>
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <div className="text-[11px] text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                  <button
                    onClick={() => !n.is_read && markAsRead(n.id)}
                    disabled={n.is_read}
                    className={`text-xs mt-2 px-3 py-1 rounded transition 
                ${
                  n.is_read
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                  >
                    {n.is_read ? "Read" : "Mark as Read"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mt-10 text-center">
                No notifications available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};





export default NotificationBell;
