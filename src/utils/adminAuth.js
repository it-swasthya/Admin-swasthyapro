
export const refreshToken = async () => {
  const res = await fetch(`https://api.swasthyapro.com/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return await res.json();
};

export const fetchProtectedData = async (url) => {
  try{
  let accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed.accessToken) {
        localStorage.setItem("accessToken", refreshed.accessToken);
        return fetchProtectedData(url);
      }
    } else if (res.status === 404) {
      return "Not found";
    }
    return await res.json();
  } else {
    return "Not found";
  }
  }catch(err){
    console.log(err)
  }

};

// const BASE_URL = 'https://api.swasthyapro.com/api';

// export const refreshToken = async () => {
//   const res = await fetch(`https://api.swasthyapro.com/api/auth/refresh`, {
//     method: 'POST', // ✅ use POST not GET
//     credentials: 'include', // ✅ include cookies
//   });
//   return await res.json();
// };

// export const fetchProtectedData = async () => {
//   let accessToken = localStorage.getItem('accessToken');

//   const res = await fetch(`https://api.swasthyapro.com/api/auth/me`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include', // ✅ always include cookies
//   });

//   if (res.status === 401) {
//     const refreshed = await refreshToken();
//     if (refreshed.accessToken) {
//       localStorage.setItem('accessToken', refreshed.accessToken);

//       // 🔁 retry the original request
//       const retryRes = await fetch(`https://api.swasthyapro.com/api/auth/me`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${refreshed.accessToken}`,
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//       });

//       if (!retryRes.ok) throw new Error('Still unauthorized');
//       return await retryRes.json();
//     } else {
//       throw new Error('Refresh failed');
//     }
//   }

//   if (!res.ok) throw new Error('Failed to fetch protected data');
//   return await res.json();
// };
