import {
  Layers,
  Activity,
  Package,
  User,
  BookCheckIcon,
  DatabaseIcon,
  CopyIcon,
} from "lucide-react";
import DashboardCard from "../components/dashboardCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";
import { routesToObfuscated } from "../utils/RoutesKey";
import { decryptEncryptedData } from "../utils/DecodeFormatData";

function Dashboard() {
  const [testCount, setTestCount] = useState(0);
  const [packagesCount, setPackagesCount] = useState(0);
  const [facilitytCount, setFacilitytCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPrescriptions, setTotalPrescriptions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeNavValue("Dashboard"));
    const getAllData = async () => {
      const [tests, packages, facility, users, orders, prescriptions] =
        await Promise.all([
          axios.get(
            `https://api.swasthyapro.com/api/database/${routesToObfuscated["get-test"]}`
          ),
          axios.get(
            `https://api.swasthyapro.com/api/database/${routesToObfuscated["get-packages"]}`
          ),
          axios.get("https://api.swasthyapro.com/api/database/get-facility"),
          axios.get("https://api.swasthyapro.com/api/user/get-user"),
          axios.get("https://api.swasthyapro.com/api/book/all-user"),
        ]);
      const decodeTest = await decryptEncryptedData(tests.data);
      const decodePackages = await decryptEncryptedData(packages.data);
      setTestCount(decodeTest.count);
      setPackagesCount(decodePackages.count);
      setFacilitytCount(facility.data.length);
      setUserCount(users.data.users.length);
      users.data.users.map((val) => {
        val.Prescriptions.map((prescriptions) => {
          setTotalPrescriptions((prevState) => [...prevState, prescriptions]);
        });
      });
      setTotalOrders(orders.data.testBookings.length);
    };
    getAllData();
  }, []);
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
        <DashboardCard
          title="Total Facilities"
          value={facilitytCount}
          color="bg-blue-500 "
          icon={Layers}
        />

        <DashboardCard
          title="Total Available Tests"
          value={testCount}
          color="bg-green-500"
          icon={Activity}
        />
        <DashboardCard
          title="Total Available Packages"
          value={packagesCount}
          color="bg-purple-500"
          icon={Package}
        />

        <DashboardCard
          title="Total Users"
          value={userCount}
          color="bg-purple-500"
          icon={User}
        />

        <DashboardCard
          title="Total Orders"
          value={totalOrders}
          color="bg-purple-500"
          icon={BookCheckIcon}
        />

        <DashboardCard
          title="Total Uploaded Prescriptions"
          value={totalPrescriptions.length}
          color="bg-purple-500"
          icon={CopyIcon}
        />
      </div>
    </div>
  );
}

export default Dashboard;
