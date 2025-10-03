import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, logOutUser, navVal } from "../Redux/reducer";
import NotificationBell from "../pages/Notifications";
import { LogOutIcon } from "lucide-react";

function Navbar({ sidebarOpen, toggleSidebar, activeMenu }) {
  const navigate = useNavigate();
  const navValue = useSelector(navVal);
  const isLogin = useSelector(isLoggedIn)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logOutUser())
  };

  return (
    <header className="bg-white shadow-sm h-12 mt-4">
      <div className="h-full flex items-center justify-between px-6">
        <div className="text-lg font-semibold text-gray-700">{navValue}</div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          {isLogin ? (
            <>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-400 text-white font-semibold text-xs  border border-red-700 hover:border-red-500 rounded block sm:hidden px-0 py-0"
              >
                <LogOutIcon size={14} />
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-400 text-white font-semibold text-xs px-2 py-0.5 border border-red-700 hover:border-red-500 rounded hidden sm:block"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
