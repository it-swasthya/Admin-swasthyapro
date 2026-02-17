import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@mui/material";
import TableComponent from "./Table";
import { fetchDoctors, deleteDoctor } from "../doctorandHospital";
import Swal from "sweetalert2";
import { doctorFlattenRow } from "../../utils/doctorFlattenRow";

const DoctorTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* ================= Fetch Doctors ================= */

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetchDoctors();
        setData(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Doctor Load Error:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  /* ================= Delete Handler With SweetAlert ================= */

  const handleDelete = useCallback(async (row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete Dr. ${row.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(row.id);

      await deleteDoctor(row.id, {
        name: row.name,
        specialty: row.specialty,
        registrationNumber: row.registrationNumber,
        experience: row.experience,
        email: row.email,
        contactNumber: row.contactNumber,
        hospitals: row.hospitals,
      });

      // Remove from UI
      setData((prev) =>
        prev.filter((doctor) => doctor.doctor_id !== row.id)
      );

      await Swal.fire({
        title: "Deleted!",
        text: "Doctor deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete Error:", error);

      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Failed to delete doctor.",
        icon: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }, []);

  /* ================= Format Data ================= */

  const formattedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((doctor) => {
      let hospitals = doctor?.hospitals;

      if (typeof hospitals === "string") {
        try {
          hospitals = JSON.parse(hospitals);
        } catch {
          hospitals = [];
        }
      }

      if (!Array.isArray(hospitals)) hospitals = [];

      return {
        id: doctor?.doctor_id,
        name: doctor?.name,
        specialty: doctor?.specialty,
        registrationNumber: doctor?.registration_number,
        experience: doctor?.experience,
        email: doctor?.email,
        contactNumber: doctor?.contact_number,
        hospitals,
        hospitalNames:
          hospitals.length > 0
            ? hospitals.map((h) => h.name).join(", ")
            : "-",
      };
    });
  }, [data]);

  /* ================= Columns ================= */

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "specialty", header: "Speciality" },
      { accessorKey: "registrationNumber", header: "Reg. Number" },
      { accessorKey: "experience", header: "Experience (Years)" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "contactNumber", header: "Contact" },
      { accessorKey: "hospitalNames", header: "Hospitals" },

      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <Button
            variant="contained"
            color="error"
            size="small"
            disabled={deletingId === row.original.id}
            onClick={() => handleDelete(row.original)}
          >
            {deletingId === row.original.id
              ? "Deleting..."
              : "Delete"}
          </Button>
        ),
      },
    ],
    [handleDelete, deletingId]
  );

  // /* ================= Flatten ================= */

  // const flattenRow = (row) => ({
  //   Name: row.name,
  //   Specialty: row.specialty,
  //   RegistrationNumber: row.registrationNumber,
  //   Experience: row.experience,
  //   Email: row.email,
  //   Contact: row.contactNumber,
  //   Hospitals: row.hospitalNames,
  // });

  return (
    <TableComponent
      columns={columns}
      data={formattedData}
      flattenRow={doctorFlattenRow}
      filename="Doctor_Data"
      loading={loading}
    />
  );
};

export default DoctorTable;
