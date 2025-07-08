import RegisterForm from "./components/register-form";



export default function LoginPage() {
    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4">
           <div className="w-1/2 h-full">
             <RegisterForm />
           </div>
           <div className="w-1/2 h-full flex items-center justify-center gap-8">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-50 to-slate-500">INFINITY COMMENTS</h1>
           </div>
        </div>
    )
}