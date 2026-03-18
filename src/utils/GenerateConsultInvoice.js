


export const buildConsultInvoicePayload = (data) => ({
    invoiceNumber: data.invoiceNumber,

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
    qualification: data.doctor_qualification ?? "mbbs",
    specialization: data.doctor_speciality ?? "general Physician",
    registration: data.doctor_registraton ?? "registration data",
    mode: data.booking_mode ?? "N/A",
  },

  services: [
    {
      name: "Doctor Consultation Fee",
      provider: "Consulting Doctor",
      qty: 1,
      rate: data.rate ?? 800,
      amount: data.doctor_fee ?? 249,
    },
    {
      name: "Platform / Facility Fee",
      provider: "SwasthyaPro",
      qty: 1,
      rate: data.platform_fee,
      amount: data.platform_fee ?? 0,
    },
  ],

 
  addOnServices: [
    {
      name: "After Hours Consultation",
      amount: data.after_hours_fee ?? 0,
    },
    {
      name: "Home Visit Facilitation",
      amount: data.home_visit_fee ?? 0,
    },
    {
      name: "Priority Slot Booking",
      amount: data.priority_fee ?? 0,
    },
    {
      name: "Medical Record Handling",
      amount: data.record_fee ?? 0,
    },
    {
      name: "Additional Charges",
      amount: data.extra_charges ?? 0,
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
    invoice_no: data.invoiceNumber,
    email: data.user_email,
    customer_name:data.user_name
});