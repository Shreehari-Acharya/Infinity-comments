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
import {  useAuth } from "@/context/authContext"


export default function LoginForm() {
    const { setToken } = useAuth()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const usernameOrEmail = formData.get("usernameOrEmail") as string
    const password = formData.get("password") as string
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          usernameOrEmail,
          password
        },
        {
            withCredentials: true, // To get cookies from the server
        }
        )
        await setToken(data.access_token);
        setError(null) // Clear any previous error
        toast.success(data.message || "Login successful! Redirecting to dashboard...")
        form.reset() // Reset the form fields
        router.push("/explore") // Redirect to explore page after successful login
    } catch (error : any) {
        if(error.response?.data?.message){
            setError(error.response.data.message)
        } else {
            setError("An unexpected error occurred. Please try again later.")
        }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Login to infinity comments and start commenting now!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          

          <form onSubmit={handleLogin} className="space-y-6 flex flex-col justify-center items-center">
            <div className="space-y-2 w-full">
              <Label htmlFor="usernameOrEmail">Username or email</Label>
              <Input id="usernameOrEmail" name="usernameOrEmail" type="text" placeholder="Enter your username or email" required className="h-11" />
            </div>
            <div className="space-y-2 w-full">
                <Label htmlFor="username">Password</Label>
                <Input id="password" name="password" type="password" placeholder="password" required className="h-11" />
            </div>

            {error ? (<p className="text-red-500 text-lg">{error}</p>) : null}

            <Button type="submit" className="w-full h-11 text-sm font-medium">
              Login
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            Dont have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}