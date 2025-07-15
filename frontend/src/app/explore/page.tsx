"use client";
import { useAuthenticatedRequest } from "@/lib/request";
import { useEffect, useState } from "react";
import { Comment } from "@/types";
import CommentCard from "./components/comment-card";

export default function ExplorePage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const request = useAuthenticatedRequest();

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const { data } = await request.get(`${process.env.NEXT_PUBLIC_API_URL}/comments`);
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, []);
    
    if(loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Loading comments...</p>
            </div>
        );
    }

    return (
        <div className="w-5/6 h-full flex flex-col items-center justify-start pt-4">
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">No comments available.</p>
                </div>
            )}
        </div>
    );
    }