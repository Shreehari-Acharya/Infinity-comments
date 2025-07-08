import { CreateCommentDialog } from "@/components/create-comment-dialog";
import Sidebar from "./components/sidebar";


export default function ExploreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full h-screen flex justify-start px-4">
            <div className="w-1/6 h-full">
                <Sidebar />
            </div>
            {children}

        <CreateCommentDialog />
        </div>
    );
}