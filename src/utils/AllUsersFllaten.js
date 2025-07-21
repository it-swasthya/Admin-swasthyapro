export const UserFlattenRow = (user) => ({
  ID: user.id,
  FullName: user.fullName,
  Contact: user.contact,
  Email: user.email,
  Age: user.age,
  Address: user.address,
  Pincode: user.pincode,
  State: user.state,
  DOB: new Date(user.DOB).toLocaleDateString(),
});
