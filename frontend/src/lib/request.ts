"use client";

import axios from "axios";
import { useAuth } from "@/context/authContext";
import { useMemo } from "react";

export function useAuthenticatedRequest() {
  const { getToken, setToken, logout } = useAuth();

  const request = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    let isRefreshing = false;
    let failedQueue: any[] = [];

    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
      });
      failedQueue = [];
    };

    instance.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: (token: string) => {
                  originalRequest.headers["Authorization"] = `Bearer ${token}`;
                  resolve(axios(originalRequest));
                },
                reject: (err: any) => reject(err),
              });
            });
          }

          isRefreshing = true;

          try {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
              {},
              { withCredentials: true }
            );

            const newAccessToken = res.data.access_token;
            setToken(newAccessToken);

            processQueue(null, newAccessToken);

            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          } catch (err) {
            processQueue(err, null);
            logout(); // clean up and redirect
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [getToken, setToken, logout]);

  return request;
}
