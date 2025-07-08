"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"
import { Comment } from "@/types/comment.type"
import { useRouter } from "next/navigation"

interface CommentCardProps {
  comment: Comment
}

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  return `${Math.floor(diffInSeconds / 86400)}d`
}

export default function CommentCard({ comment }: CommentCardProps) {

    const router = useRouter()
  return (
    <div 
        className="w-5/6 text-white border-b border-gray-800 p-4 hover:bg-gray-950 transition-colors cursor-pointer"
        onClick={() => {
            router.push(`/explore/comments/${comment.id}`)
        }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src="/placeholder.svg?height=40&width=40" />
          <AvatarFallback className="bg-gray-700 text-white text-sm">
            {comment.user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">@{comment.user.username}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{formatTimeAgo(comment.createdAt)}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{comment.createdAt === comment.updatedAt ? "" : `(edited)`}</span>
          </div>

          {/* Comment text */}
          <div className="text-white mb-3 leading-relaxed">{comment.content}</div>

          {/* Actions */}
          {comment.repliesCount > 0 && (
            <div className="flex items-center gap-1 text-gray-500 hover:text-blue-400 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{comment.repliesCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
