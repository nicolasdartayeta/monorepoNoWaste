// const client = {
//   get: async (endpoint: any) => {
//     try {
//       const response = await fetch(`http://localhost:3000${endpoint}`);
//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error("Error in GET request:", error);
//     }
//   },
//   post: async (endpoint: any, data: any) => {
//     try {
//       const response = await fetch(`http://localhost:3000${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error("Error in POST request:", error);
//     }
//   },
//   delete: async (endpoint: any) => {
//     try {
//       const response = await fetch(`http://localhost:3000${endpoint}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error("Error in DELETE request:", error);
//     }
//   },
// };

// export const api = client;
