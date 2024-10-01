import type { Product } from "@server/db/schema";
import type { productDTO } from "@server/src/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const client = {
  get: async (endpoint: string): Promise<Product[] | undefined> => {
    try {
      const response = await fetch(`${endpoint}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error in GET request:", error);
      return undefined;
    }
  },
  post: async (
    endpoint: string,
    data: any,
  ): Promise<typeof productDTO | undefined> => {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error in POST request:", error);
    }
  },
  delete: async (endpoint: string) => {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error in DELETE request:", error);
    }
  },
};

export const api = client;
