import React, { useEffect, useMemo, useState } from "react";
import TableComponent from "./Table";
import { fetchHospitals } from "../doctorandHospital";


const HospitalTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHospitals().then(setData);
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Hospital Name" },
      { accessorKey: "location", header: "Location", filterVariant: "select" },
      { accessorKey: "established", header: "Established", filterVariant: "date" },
      { accessorKey: "status", header: "Status", filterVariant: "select" },
    ],
    []
  );

  const flattenRow = (row) => ({
    Name: row.name,
    Location: row.location,
    Established: row.established,
    Status: row.status,
  });

  return (
    <TableComponent
      columns={columns}
      data={data}
      flattenRow={flattenRow}
      filename="Hospital_Data"
    />
  );
};

export default HospitalTable;
