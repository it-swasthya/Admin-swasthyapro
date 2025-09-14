import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Menu, Home, Plus, Package,
  Activity, Layers, ChevronDown, ChevronRight, ListCheck, Users,
  FileQuestion,
  FileScan,
  Ticket,
  Stethoscope,
} from 'lucide-react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DraftsIcon from '@mui/icons-material/Drafts';
import BiotechIcon from '@mui/icons-material/Biotech';
function Sidebar({ sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu }) {
  const [expandedMenus, setExpandedMenus] = useState({
    facilities: false,
    tests: false,
    packages: false,
    Faq: false,
  });

  const navigate = useNavigate();

  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    navigate(`/${menu}`);
  };

  const sidebarMenus = [
    { name: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    {
      name: 'facilities',
      label: 'Facilities',
      icon: <Layers size={20} />,
      submenus: [
        { name: 'add-facilities', label: 'Add Facilities', icon: <Plus size={16} /> },
        { name: 'list-facilities', label: 'Facilities List', icon: <ListCheck size={16} /> },
      ]
    },
    {
      name: 'tests',
      label: 'Tests',
      icon: <Activity size={20} />,
      submenus: [
        { name: 'add-tests', label: 'Add Tests', icon: <Plus size={16} /> },
        { name: 'list-tests', label: 'Tests List', icon: <ListCheck size={16} /> },
      { name: 'list-labs', label: 'Lab"s List', icon: <BiotechIcon size={16} /> },

      ]
    },
    {
      name: 'packages',
      label: 'Packages',
      icon: <Package size={20} />,
      submenus: [
        { name: 'add-packages', label: 'Add Packages', icon: <Plus size={16} /> },
        { name: 'list-packages', label: 'Packages List', icon: <Package size={16} /> },
      ]
    },
    // {
    //   name: 'Faq',
    //   label: 'FAQ',
    //   icon: <HelpOutlineIcon />,
    //   submenus: [
    //     { name: 'add-FAQ', label: 'Add FAQ', icon: <Plus size={16} /> },
    //     { name: 'list-FAQ', label: 'FAQ List', icon: <HelpOutlineIcon style={{ fontSize: 16 }} /> },
    //   ]
    // },
        {
      name: 'Coupon',
      label: 'Coupon',
      icon: <Ticket/>,
      submenus: [
        { name: 'add-coupon', label: 'Add Coupon', icon: <Plus size={16} /> },
        { name: 'coupon-list', label: 'Coupon List', icon: <Ticket style={{ fontSize: 16 }} /> },
      ]
    },
   { name: 'view-prescriptions', label: 'Prescriptions', icon: <ListCheck size={20} /> },
  // { name: 'user-orders', label: 'Orders', icon: <Package size={20} /> },
   {
      name: 'Orders',
      label: 'Orders',
      icon: <Package/>,
      submenus: [
  { name: 'user-orders', label: 'Pathology', icon: <Package size={20} /> },
        // { name: 'coupon-list', label: 'Coupon List', icon: <Ticket style={{ fontSize: 16 }} /> },
      ]
    },
  { name: 'all-users', label: 'Users', icon: <Users size={20} /> },
  { name: 'user-Query', label: 'Query', icon: <FileQuestion size={20} /> },
  { name: 'user-invoices', label: 'Invoices', icon: <FileScan size={20} /> },
    { name: 'radiology-appointments', label: 'Radiology-Appoint', icon: <Stethoscope size={20} /> },

  // { name: 'email-payments', label: 'Email Pay', icon: <DraftsIcon style={{ fontSize: 20 }} /> },
  ];

  const lastFiveMenus = sidebarMenus.slice(-6);

  const renderMenuItem = (menu) => {
    if (menu.submenus) {
      return (
        <>
          <button
            onClick={() => toggleSubmenu(menu.name)}
            className={`mt-3 bg-transparent flex items-center w-[90%]  transition-colors duration-200 ml-2
              hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 
              ${sidebarOpen ? 'justify-between' : 'justify-center'}`}
          >
            <div className="flex items-center">
              <span className="mr-3">{menu.icon}</span>
              {sidebarOpen && <span>{menu.label}</span>}
            </div>
            {sidebarOpen && (
              expandedMenus[menu.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )}
          </button>
          {expandedMenus[menu.name] && sidebarOpen && (
            <ul className="pl-6 pb-2">
              {menu.submenus.map((submenu) => (
                <li key={submenu.name}>
                  <button
                    onClick={() => handleMenuClick(submenu.name)}
                    className={`mt-3 bg-transparent flex items-center w-[90%] px-6 py-2 transition-colors duration-200 
                      hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 
                      ${activeMenu === submenu.name ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : ''}`}
                  >
                    <span className="mr-3">{submenu.icon}</span>
                    <span>{submenu.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      );
    } else {
      return (
        <button
          onClick={() => handleMenuClick(menu.name)}
          className={`bg-transparent flex items-center w-[90%] ml-2 px-6 py-3 transition-colors duration-200 
            hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 
            ${activeMenu === menu.name ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : ''} 
            ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
        >
          <span className={sidebarOpen ? 'mr-3' : ''}>{menu.icon}</span>
          {sidebarOpen && <span>{menu.label}</span>}
        </button>
      );
    }
  };

  return (
    <>
<div className={`hidden md:flex bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white transition-all duration-300 
  ${sidebarOpen ? 'w-64' : 'w-20'} flex-col shadow-lg mt-0 md:mt-0`}
>
        {/* Logo and Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen ? (
            <div className="flex items-center">
              <img
                src="https://swasthyapro.com/static/media/headerLogo.f6b8431e7ff8639b5c0b.png"
                alt="SwasthyaPro Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
          ) : (
            <div className="w-full flex justify-center" />
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-transparent p-1 rounded-md hover:bg-gray-700">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav>
            <ul>
              {sidebarMenus.map((menu) => (
                <li key={menu.name} className="mb-1">
                  {renderMenuItem(menu)}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

{/* Bottom nav for mobile */}
<div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 pb-[env(safe-area-inset-bottom,0)]">
  <ul className="flex  whitespace-nowrap no-scrollbar text-white text-xs px-2">
    {lastFiveMenus.map((menu) => (
      <li key={menu.name} className="flex-none w-[60px] text-center">
        <button
          onClick={() => handleMenuClick(menu.name)}
          className={`flex flex-col items-center justify-center py-2 w-full transition-colors duration-150 ${
            activeMenu === menu.name ? 'text-blue-400' : 'text-white'
          }`}
          aria-label={menu.label}
        >
          <div className="w-5 h-5 mb-0.5 flex items-center justify-center">
            {React.cloneElement(menu.icon, { size: 20 })}
          </div>
          <span className="text-[10px] leading-tight px-1 break-words">
            {menu.label}
          </span>
        </button>
      </li>
    ))}
  </ul>
</div>



    </>
  );
}

export default Sidebar;
