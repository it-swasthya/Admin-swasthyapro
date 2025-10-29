
import axios from 'axios';

export const refreshToken = async () => {
  const res = await fetch(`https://api.swasthyapro.com/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return await res.json();
};

// export const fetchProtectedData = async (url) => {
//   try{
//   let accessToken = localStorage.getItem("accessToken");
//   if (accessToken) {
//     const res = await fetch(url, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     if (res.status === 401) {
//       const refreshed = await refreshToken();
//       if (refreshed.accessToken) {
//         localStorage.setItem("accessToken", refreshed.accessToken);
//         return fetchProtectedData(url);
//       }
//     } else if (res.status === 404) {
//       return "Not found";
//     }
//     return await res.json();
//   } else {
//     return "Not found";
//   }
//   }catch(err){
//     console.log(err)
//   }

// };



// export const fetchProtectedData = async (url, method = 'GET', data = null) => {
//   try {
//     let accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       const config = {
//         method: method, // The HTTP method (GET, POST, PUT, PATCH, etc.)
//         url: url,
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       };

//       if (data) {
//         config.data = data; // Attach the body data for POST, PUT, or PATCH
//       }
//       console.log(config)
//       const res = await axios(config);
//    console.log(res)
//       // Handle any specific status codes if needed
//       if (res.status === 401) {
//         const refreshed = await refreshToken();
//         if (refreshed.accessToken) {
//           localStorage.setItem("accessToken", refreshed.accessToken);
//           return fetchProtectedData(url, method, data); // Retry the request
//         }
//       } else if (res.status === 404) {
//         return "Not found";
//       }

//       return res.data; // Axios automatically parses the JSON for you
//     } else {
//       return "Not found";
//     }
//   } catch (err) {
//     console.error(err);
//     return "An error occurred";
//   }
// };


export const fetchProtectedData = async (url, method = 'GET', data = null) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return "Not found";

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    };

    // Add body only for methods that support it
    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);

    // Handle 401 (unauthorized)
    if (res.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed?.accessToken) {
        localStorage.setItem("accessToken", refreshed.accessToken);
        return fetchProtectedData(url, method, data); // Retry request
      }
      return "Unauthorized";
    }

    // Handle 404 (not found)
    if (res.status === 404) {
      return "Not found";
    }

    // Handle other non-OK responses
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    // Parse and return JSON response
    const result = await res.json();
    return result;
  } catch (err) {
    console.error("Fetch error:", err);
    return "An error occurred";
  }
};

