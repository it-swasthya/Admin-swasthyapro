export const buildConsultInvoicePayload = (data) => ({
  invoiceNumber: `SPDOC004`,

  invoiceDate: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),

  patient: {
    name: data.user_name,
    ageGender: `${data.user_age} / ${data.user_gender}`,
    mobile: data.user_contact,
    email: data.user_email,
    patientId: data.user_id, 
  },

  doctor: {
    name: data.doctor_name,
    qualification: data.doctor_qualification ?? "mbbs" ,
    specialization: data.doctor_speciality ?? "general Physician",
    registration: data.doctor_registraton ?? "registration data",
    mode: data.booking_mode ?? "N/A",
  },

  services: [
    {
      name: "Doctor Consultation Fee",
      provider: "Consulting Doctor",
      qty: 1,
      rate: data.rate ?? 4.5,
      amount: data.doctor_fee ?? 249,
    },
    {
      name: "Platform / Facility Fee",
      provider: "SwasthyaPro",
      qty: 1,
      rate: data.platform_fee,
      amount: data.amount ?? 249,
    },
  ],

  tax: {
    doctorFee: data.doctor_fee,
    platformFee: data.platform_fee,
    gst: data.gst,
    total: data.total_amount,
  },

  payment: {
    mode: data.payment_mode,
    status: data.payment_status,
  },
});



export const SendConsultInvoicePayload = (data)=> ({
    invoice_no:"SPDOC004",
    email: data.user_email,
    customer_name:data.user_name
});




// export const buildConsultInvoicePayload = (data) => ({
//   invoiceNumber: "SPDOC-TEST-001",

//   invoiceDate: new Date().toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }),

//   patient: {
//     name: "DHARAMWATI",
//     ageGender: "63 / Female",
//     mobile: "8851627424",
//     email: "rs8218167@gmail.com",
//     patientId: "USER000800",
//   },

//   doctor: {
//     name: "Dr. Ashima Khanna",
//     qualification: "M.D Medicine",
//     specialization: "Oncologist",
//     registration: "DMC/R/27661",
//     mode: "Physical",
//   },

//   services: [
//     {
//       name: "Doctor Consultation Fee",
//       provider: "Consulting Doctor",
//       qty: 1,
//       rate: 1100,
//       amount: 1100,
//     },
//     {
//       name: "Platform / Facility Fee",
//       provider: "SwasthyaPro",
//       qty: 1,
//       rate: 100,
//       amount: 100,
//     },
//   ],

//   tax: {
//     doctorFee: 1100,
//     platformFee: 100,
//     gst: 18,
//     total: 1218,
//   },

//   payment: {
//     mode: "UPI / Razorpay/CASH",
//     status: "Pending",
//   },
// });
