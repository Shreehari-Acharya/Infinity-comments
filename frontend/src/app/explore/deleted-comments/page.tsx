"use client";
import { useEffect, useState } from "react";
import { useAuthenticatedRequest } from "@/lib/request";
import { MyComment } from "@/types";
import MyCommentCard from "./components/my-comment-card";


export default function DeletedCommentsPage() {
    const [myComments, setMyDeletedComments] = useState<MyComment[]>([]);
    const request = useAuthenticatedRequest();
    
    useEffect(() => {
        const fetchMyDeletedComments = async () => {
            try {
                const { data } = await request.get(`${process.env.NEXT_PUBLIC_API_URL}/comments/deleted`);
                setMyDeletedComments(data);
            } catch (error) {
                console.error("Error fetching deleted comments:", error);
            }
        };
        fetchMyDeletedComments();
    }, []);

    return (
        <div className="w-5/6 h-full flex flex-col items-center justify-start">
            {myComments.length > 0 ? (
                myComments.map((comment) => (
                    <MyCommentCard key={comment.id} comment={comment} />
                ))
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">You have no deleted comments</p>
                </div>
            )
            }
        </div>
    );
}