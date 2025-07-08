"use client";
import request from "@/lib/request";
import { useEffect, useState } from "react";

export default function ExplorePage() {
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const { data } = await request.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`);
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }
        fetchUserDetails();
    }, []);

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4">
        <div className="w-1/2 h-full flex items-center justify-center gap-8">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-50 to-slate-500">
            EXPLORE COMMENTS
            </h1>
            {user ? (
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Welcome, {user.username}!</h2>
                    <p className="mt-2 text-lg">Explore the comments and engage with the community.</p>
                </div>
            ) : (
                <p className="text-lg">Loading user details...</p>
            )}
        </div>
        </div>
    );
    }