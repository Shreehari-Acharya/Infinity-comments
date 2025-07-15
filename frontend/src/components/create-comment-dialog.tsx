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
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { useAuthenticatedRequest } from "@/lib/request"
import { toast } from "sonner"

export function CreateCommentDialog() {
  const [open, setOpen] = useState(false)
  const request = useAuthenticatedRequest()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const comment = formData.get("comment") as string
    try {
        const { data } = await request.post(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
          content: comment,
        })
    
        form.reset() 
        setOpen(false) 
        toast.success(data.message || "Comment created successfully!")
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
        <Button
          variant="default"
          className="fixed bottom-6 text-white font-medium right-6 z-50 bg-blue-500 rounded-xl shadow-lg"
        >
          New Comment
        </Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent>
        <form onSubmit={handleSubmit} className="w-full">
          <DialogHeader>
            <DialogTitle>What is your comment?</DialogTitle>
            <DialogDescription>
              Share your thoughts with the world. Your comment will be visible to everyone.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Textarea
              name="comment"
              placeholder="Write your comment here..."
              className="resize-none h-32"
              required
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Comment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
