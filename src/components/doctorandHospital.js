export const fetchDoctors = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Dr. Amit Sharma",
          specialty: "Cardiologist",
          experience: "12 Years",
        },
        {
          id: 2,
          name: "Dr. Neha Verma",
          specialty: "Dermatologist",
          experience: "8 Years",
        },
        {
          id: 3,
          name: "Dr. Rahul Mehta",
          specialty: "Orthopedic",
          experience: "10 Years",
        },
      ]);
    }, 800); // simulate API delay
  });
};



export const fetchHospitals = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "City Care Hospital",
          location: "Delhi",
          beds: 120,
        },
        {
          id: 2,
          name: "Green Life Hospital",
          location: "Noida",
          beds: 200,
        },
        {
          id: 3,
          name: "Sunrise Multispeciality",
          location: "Gurgaon",
          beds: 150,
        },
      ]);
    }, 800); // simulate API delay
  });
};
