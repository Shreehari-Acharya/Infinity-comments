import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { useAuthenticatedRequest } from "@/lib/request"
import { toast } from "sonner"

interface DeleteCommentAlertDialogProps {
  commentId: string
}
export function DeleteCommentDialog({commentId}: DeleteCommentAlertDialogProps) {

    const request = useAuthenticatedRequest();
    
    const handleDelete = async () => {
        try {
            const { data } = await request.delete(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`)
            toast.success(data.message || "Comment deleted successfully!")
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error("An unexpected error occurred. Please try again later.")
            }
        }
    }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
            className="p-1.5 rounded-full hover:bg-gray-800 text-gray-500 hover:text-red-400 transition-colors"
            aria-label="Delete comment"
        >
            <Trash2 className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Wanna delete your comment?</AlertDialogTitle>
          <AlertDialogDescription>
            You can restore before 15 minutes if you change your mind. :)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
