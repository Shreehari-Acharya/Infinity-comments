"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Edit3, Trash2 } from "lucide-react"
import { MyComment } from "@/types"

interface CommentCardProps {
  comment: MyComment
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

export default function MyCommentCard({ comment }: CommentCardProps) {
  const isReply = comment.parent !== null


  const handleEdit = () => {
    console.log("Edit comment:", comment.id)
    // Implement edit functionality
  }

  const handleDelete = () => {
    console.log("Delete comment:", comment.id)
    // Implement delete functionality
  }

  return (
    <div className="w-5/6 text-white border-b border-gray-800 p-4 hover:bg-gray-950 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src="/placeholder.svg?height=40&width=40" />
          <AvatarFallback className="bg-gray-700 text-white text-sm">
            {comment.user?.username?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">@{comment.user?.username || ""}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{formatTimeAgo(comment.createdAt)}</span>
          </div>

          {/* Reply indicator */}
          {isReply && comment.parentUsername && (
            <div className="text-gray-500 text-sm mb-2">
              replied to <span className="text-blue-400">@{comment.parentUsername}</span>
            </div>
          )}

          {/* Comment text */}
          <div className="text-white mb-3 leading-relaxed">{comment.content}</div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Reply count */}
              {comment.repliesCount > 0 && (
                <div className="flex items-center gap-1 text-gray-500 hover:text-blue-400 transition-colors cursor-pointer">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{comment.repliesCount}</span>
                </div>
              )}
            </div>

           
            
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="p-1.5 rounded-full hover:bg-gray-800 text-gray-500 hover:text-blue-400 transition-colors"
                  aria-label="Edit comment"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-full hover:bg-gray-800 text-gray-500 hover:text-red-400 transition-colors"
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}