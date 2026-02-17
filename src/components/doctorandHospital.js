
import axios from "axios";



export const fetchDoctors = async () => {
  try {
    const response = await axios.get(
      "https://api.swasthyapro.com/api/clinic/doctors/list"
    );

    console.log(response.data, "doctor data response");

    if (response.data?.success && Array.isArray(response.data?.data)) {

      //  Parse hospitals string into array
      const formattedDoctors = response.data.data.map((doctor) => ({
        ...doctor,
        hospitals: doctor.hospitals
          ? JSON.parse(doctor.hospitals)
          : [],
        
      }));

      return formattedDoctors;
    }

    return [];
  } catch (error) {
    console.error(
      "Fetch Doctors Error:",
      error.response?.data || error.message
    );
    return [];
  }
};




export const fetchHospitals = async () => {
  try {
    const response = await axios.get(
      "https://api.swasthyapro.com/api/clinic/hospital/list",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    return [];
  }
};




// add doctor data 


const BASE_URL = "https://api.swasthyapro.com/api";

/**
 * Add Doctor API
 */
export const addDoctor = async (doctorData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/clinic/doctors/add-doctors`,
      doctorData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Add Doctor API Error:", error.response?.data || error.message);
    throw error;
  }
};


// add hospital

 export const addHospital  = async (HospitalData) => {

    try {

      const response = await axios.post(`${BASE_URL}/clinic/hospital/add-hospital`,
      HospitalData,
      {
        headers: {
          "Content-Type": "application/json",
        },

    })

    console.log("data ", response.data);
    

    return response?.data;
      
    } catch (error) {
       console.error("Add Hospital  API Error:", error.response?.data || error.message);
    throw error;
  }
    
}






export const fetchDoctorById = async (doctorId) => {
  try {
    const response = await axios.get(
      `https://api.swasthyapro.com/api/clinic/doctors/${doctorId}`
    );

    if (!response.data.success) return null;

    const doc = response.data.data;

    //  Parse hospitals safely
    let parsedHospitals = [];

    if (doc.hospitals) {
      if (typeof doc.hospitals === "string") {
        parsedHospitals = JSON.parse(doc.hospitals);
      } else {
        parsedHospitals = doc.hospitals;
      }
    }

    return {
      id: doc.doctor_id,
      name: doc.name,
      specialty: doc.specialty,
      registrationNumber: doc.registration_number,
      experience: doc.experience,
      email: doc.email,
      contactNumber: doc.contact_number,

      //  Normalize structure
      hospitals: parsedHospitals.map((h, index) => ({
        id: h.name || index,  
        name: h.name,
      })),
    };
  } catch (error) {
    console.error("Error fetching doctor by id:", error);
    return null;
  }
};



export const deleteDoctor = async (doctorId, payload) => {
  try {
    const response = await axios.delete(
      `https://api.swasthyapro.com/api/clinic/doctors/delete/${doctorId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        data: payload, 
      }
    );

    return response.data;
  } catch (error) {
    console.error("Delete Doctor Error:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteHospital = async (hospitalId, payload) => {
  try {
    const response = await axios.delete(
      `https://api.swasthyapro.com/api/clinic/hospital/delete/${hospitalId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete Hospital Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};



export const fetchHospitalById = async (hospitalId) => {
  try {
    const response = await axios.get(
      `https://api.swasthyapro.com/api/clinic/hospital/${hospitalId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Fetch Hospital Details Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};





