import React, { useEffect, useMemo, useState, useCallback } from "react";
import TableComponent from "./Table";
import { fetchHospitals, deleteHospital } from "../doctorandHospital";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import { hospitalFlattenRow } from "../../utils/hospitalFlattenRow";

const HospitalTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  /* ================= Fetch Hospitals ================= */

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const res = await fetchHospitals();
        const hospitalArray = res?.data || [];

        const formattedData = hospitalArray.map((item) => {
          let parsedCenters = [];

          try {
            parsedCenters =
              typeof item.centers === "string"
                ? JSON.parse(item.centers)
                : item.centers || [];
          } catch {
            parsedCenters = [];
          }

          return {
            hospital_id: item.hospital_id,
            name: item.name,
            registrationNumber: item.registration_number,
            type: item.type,
            contactNumber: item.contact_number,
            email: item.email,
            address: item.address,
            city: item.city,
            state: item.state,
            pincode: item.pincode,
            status: item.status,
            centers: parsedCenters,
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error loading hospitals:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadHospitals();
  }, []);

  /* ================= Delete Handler With SweetAlert ================= */

  const handleDelete = useCallback(async (row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${row.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(row.hospital_id);

      await deleteHospital(row.hospital_id, {
        name: row.name,
        registrationNumber: row.registrationNumber,
        type: row.type,
        contactNumber: row.contactNumber,
        email: row.email,
        address: row.address,
        city: row.city,
        state: row.state,
        pincode: row.pincode,
        centers: row.centers,
      });

      // Remove from UI
      setData((prev) =>
        prev.filter((hospital) => hospital.hospital_id !== row.hospital_id)
      );

      await Swal.fire({
        title: "Deleted!",
        text: "Hospital deleted successfully.",
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
          "Failed to delete hospital.",
        icon: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }, []);

  /* ================= Columns ================= */

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Hospital Name",
      },
      {
        accessorKey: "registrationNumber",
        header: "Registration No.",
      },
      {
        accessorKey: "type",
        header: "Type",
        filterVariant: "select",
      },
      {
        accessorKey: "contactNumber",
        header: "Contact Number",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "city",
        header: "City",
        filterVariant: "select",
      },
      {
        accessorKey: "state",
        header: "State",
        filterVariant: "select",
      },
      {
        accessorKey: "pincode",
        header: "Pincode",
      },
      {
        accessorKey: "centers",
        header: "Centers",
        Cell: ({ cell }) => {
          const centers = cell.getValue();
          if (!centers || !Array.isArray(centers)) return "-";
          return centers.map((c) => c.name).join(", ");
        },
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <Button
            variant="contained"
            color="error"
            size="small"
            disabled={deletingId === row.original.hospital_id}
            onClick={() => handleDelete(row.original)}
          >
            {deletingId === row.original.hospital_id
              ? "Deleting..."
              : "Delete"}
          </Button>
        ),
      },
    ],
    [handleDelete, deletingId]
  );

  /* ================= Render ================= */

  return (
    <TableComponent
      columns={columns}
      data={data}
      flattenRow={hospitalFlattenRow}
      filename="Hospital_List"
      isLoading={loading}
    />
  );
};

export default HospitalTable;

