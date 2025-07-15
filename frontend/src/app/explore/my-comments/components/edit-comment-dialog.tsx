"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useAuthenticatedRequest } from "@/lib/request"
import { toast } from "sonner"
import { Edit3 } from "lucide-react"

interface EditCommentDialogProps {
  commentId: string
  initialContent: string
}

export function EditCommentDialog({commentId, initialContent}: EditCommentDialogProps) {
  const [open, setOpen] = useState(false)
  const request = useAuthenticatedRequest()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const comment = formData.get("content") as string
    try {
        const { data } = await request.patch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
          content: comment,
        })
    
        form.reset() 
        setOpen(false) 
        toast.success(data.message || "Comment updated successfully!")
    } catch (error: any) {
        if(error.response?.data?.message) {
            toast.error(error.response.data.message)
        } else {
            toast.error("An unexpected error occurred. Please try again later.")
        }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
            className="p-1.5 rounded-full hover:bg-gray-800 text-gray-500 hover:text-blue-400 transition-colors"
            aria-label="Edit comment"
        >
            <Edit3 className="h-4 w-4" />
        </button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent>
        <form onSubmit={handleSubmit} className="w-full">
          <DialogHeader>
            <DialogTitle>Oops! made a mistake?, we got you</DialogTitle>
            <DialogDescription>
              You can edit your comment before 15 minutes of posting it.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Textarea
              name="content"
              defaultValue={initialContent}
              className="resize-none h-32"
              required
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
