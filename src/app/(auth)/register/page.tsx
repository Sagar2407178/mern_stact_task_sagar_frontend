"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [registerApi, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setServerError("");
      const response = await registerApi(data).unwrap();
      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        }),
      );
      toast.success("Account created successfully!");
      router.push("/products");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      const errMsg = error?.data?.message || "Failed to create account";
      setServerError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold tracking-tighter">
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your details below to create your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="p-3 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
              {serverError}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              className="bg-muted/50 focus-visible:ring-indigo-500"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className="bg-muted/50 focus-visible:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="bg-muted/50 focus-visible:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 bg-transparent border-t-0">
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-500 hover:text-indigo-400 underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
