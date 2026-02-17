export const hospitalFlattenRow = (row) => ({
  HospitalName: row.name,
  RegistrationNumber: row.registrationNumber,
  Type: row.type,
  ContactNumber: row.contactNumber,
  Email: row.email,
  Address: row.address,
  City: row.city,
  State: row.state,
  Pincode: row.pincode,
  Centers:
    row.centers && Array.isArray(row.centers)
      ? row.centers.map((c) => c.name).join(", ")
      : "-",
});
