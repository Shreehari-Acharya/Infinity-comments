import { User } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import request from "@/lib/request";

export default function Sidebar() {

    const [user, setUser] = useState<User | null>(null);
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
        <div className="h-full w-full py-6 flex border-r flex-col justify-between">
            <ul className="space-y-2">
                <li className="h-10 text-xl flex items-center justify-start">
                    <Link href="/explore" className="text-blue-300 hover:underline">
                        Explore
                    </Link>
                </li>
                <li className="h-10 text-xl flex items-center justify-start">
                    <Link href="/explore/your-comments" className="text-blue-300 hover:underline">
                        Your Comments
                    </Link>
                </li>
                <li className="h-10 text-xl flex items-center justify-start">
                    <Link href="/explore/deleted-comments" className="text-blue-300 hover:underline">
                        Deleted Comments
                    </Link>
                </li>
                <li className="h-10 text-xl flex items-center justify-start">
                    <Link href="/explore/notifications" className="text-blue-300 hover:underline">
                        Notifications
                    </Link>
                </li>
            </ul>
            <div className="mt-8">
                <h2 className="text-lg font-semibold">User Profile</h2>
                {user ? (
                    <div className="mt-2">
                        <p className="text-sm">Username: {user.username}</p>
                        <p className="text-sm">Email: {user.email}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No user information available.</p>
                )}
            </div>
        </div>
    );
}