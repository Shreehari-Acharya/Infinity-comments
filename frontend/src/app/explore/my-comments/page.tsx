"use client";
import { useEffect, useState } from "react";
import request from "@/lib/request";
import { MyComment } from "@/types";
import MyCommentCard from "./components/my-comment-card";


export default function MyCommentsPage() {
    const [myComments, setMyComments] = useState<MyComment[]>([]);

    useEffect(() => {
        const fetchMyComments = async () => {
            try {
                const { data } = await request.get(`${process.env.NEXT_PUBLIC_API_URL}/comments/me`);
                setMyComments(data);
            } catch (error) {
                console.error("Error fetching my comments:", error);
            }
        };
        fetchMyComments();
    }, []);

    return (
        <div className="w-5/6 h-full flex flex-col items-center justify-start">
            {myComments.length > 0 ? (
                myComments.map((comment) => (
                    <MyCommentCard key={comment.id} comment={comment} />
                ))
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">No comments available.</p>
                </div>
            )
            }
        </div>
    );
}