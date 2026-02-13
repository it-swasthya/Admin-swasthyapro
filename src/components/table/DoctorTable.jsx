import React, { useEffect, useMemo, useState } from "react";
import TableComponent from "./Table";
import { fetchDoctors } from "../doctorandHospital";


const DoctorTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchDoctors().then(setData);
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "specialty", header: "Specialty", filterVariant: "select" },
      { accessorKey: "experience", header: "Experience", filterVariant: "range" },
      { accessorKey: "joiningDate", header: "Joining Date", filterVariant: "date" },
      { accessorKey: "status", header: "Status", filterVariant: "select" },
    ],
    []
  );

  const flattenRow = (row) => ({
    Name: row.name,
    Specialty: row.specialty,
    Experience: row.experience,
    JoiningDate: row.joiningDate,
    Status: row.status,
  });

  return (
    <TableComponent
      columns={columns}
      data={data}
      flattenRow={flattenRow}
      filename="Doctor_Data"
    />
  );
};

export default DoctorTable;
