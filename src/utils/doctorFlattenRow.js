export const doctorFlattenRow = (row) => ({
  Name: row.name,
  Specialty: row.specialty,
  RegistrationNumber: row.registrationNumber,
  Experience: row.experience,
  Email: row.email,
  Contact: row.contactNumber,
  Hospitals: row.hospitalNames,
});
