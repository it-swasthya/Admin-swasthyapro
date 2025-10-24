export const UserFlattenRow = (user) => ({
  ID: user.id,
  FullName: user.fullName,
  firstName:user.firstName,
  lastName:user.lastName,
  employee_id:user.employee_id,
  serving:user.serving,
  organisation_name:user.organisation_name,
  ministry:user.ministry,
  Contact: user.contact,
  Email: user.email,
  Age: user.age,
  Address: user.address,
  Pincode: user.pincode,
  State: user.state,
  DOB: new Date(user.DOB).toLocaleDateString(),
  gender:user.gender
});
