"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


export default function RegisterForm() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)


  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          email,
          username,
          password
        })

        setError(null) // Clear any previous error
        toast.success(data.message || "Registration successful! You can now login.")
        form.reset() // Reset the form fields
        router.push("/login") // Redirect to login page after successful registration
        
    }catch (err : any) {
        console.log("Error during registration:", err)
        if(err.response?.data?.message){
            setError(err.response.data.message)
        }else{
            setError("An unexpected error occurred. Please try again later.")
        }
        return
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
          <CardDescription className="text-center">create your account and start commenting now!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          

          <form onSubmit={handleRegister} className="space-y-6 flex flex-col justify-center items-center">
            <div className="space-y-2 w-full">
              <Label htmlFor="username">Create a username</Label>
              <Input id="username" name="username" type="text" placeholder="give yourself a unique username" required className="h-11" />
            </div>
            <div className="space-y-2 w-full">
                <Label htmlFor="username">Your Email</Label>
                <Input id="email" name="email" type="email" placeholder="your email address" required className="h-11" />
            </div>
            <div className="space-y-2 w-full">
                <Label htmlFor="username">A strong password</Label>
                <Input id="password" name="password" type="password" placeholder="password" required className="h-11" />
            </div>
            {error ? (<p className="text-red-500 text-lg">{error}</p>) : null}
            <Button type="submit" className="w-full h-11 text-sm font-medium">
              Register
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}