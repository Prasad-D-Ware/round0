"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Chrome, Loader2 } from "lucide-react";

interface AuthComponentProps {
	mode: "login" | "signup";
	onModeChange?: (mode: "login" | "signup") => void;
	onGoogleAuth?: () => void;
	onSubmit?: (data: { email: string; password: string; name?: string }) => void;
	onForgotPassword?: () => void;
	isLoading?: boolean;
}

export default function Auth({
	mode = "login",
	onModeChange,
	onGoogleAuth,
	onSubmit,
	onForgotPassword,
	isLoading = false,
}: AuthComponentProps) {
	const isLogin = mode === "login";
	const isSignup = mode === "signup";

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = {
			email: formData.get("email") as string,
			password: formData.get("password") as string,
			...(isSignup && { name: formData.get("name") as string }),
		};
		onSubmit?.(data);
	};

	return (
		<div className="min-h-screen app-surface flex items-center justify-center p-4">
			<div className="w-full max-w-sm">
				<Card className="py-0">
					<CardContent className="p-6">
						<div className="text-center mb-7">
							<div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-sm ring-1 ring-inset ring-white/10">
								<span className="text-primary-foreground font-bold text-lg">R</span>
							</div>
							<h1 className="text-xl font-semibold tracking-tight">
								{isLogin ? "Welcome back" : "Create account"}
							</h1>
							<p className="text-sm text-muted-foreground mt-1">
								{isLogin
									? "Sign in to continue to Round0."
									: "Get started with Round0."}
							</p>
						</div>

						<div className="space-y-4">
							<Button
								variant="outline"
								className="w-full h-10 text-sm font-medium"
								onClick={onGoogleAuth}
							>
								<Chrome className="mr-2 h-4 w-4" />
								{isLogin ? "Continue with Google" : "Sign up with Google"}
							</Button>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background/60 px-2 text-muted-foreground backdrop-blur-sm rounded-full">
										or
									</span>
								</div>
							</div>

							<form className="space-y-3" onSubmit={handleSubmit}>
						{isSignup && (
							<div className="space-y-1.5">
								<Label htmlFor="name" className="text-xs">Full Name</Label>
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="John Doe"
									required
								/>
							</div>
						)}

						<div className="space-y-1.5">
							<Label htmlFor="email" className="text-xs">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="name@example.com"
								required
							/>
						</div>

						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<Label htmlFor="password" className="text-xs">Password</Label>
								{isLogin && (
									<button
										type="button"
										className="text-xs text-muted-foreground hover:text-foreground transition-colors"
										onClick={onForgotPassword}
									>
										Forgot password?
									</button>
								)}
							</div>
							<Input
								id="password"
								name="password"
								type="password"
								required
								minLength={isSignup ? 8 : undefined}
							/>
						</div>

						{isSignup && (
							<div className="space-y-1.5">
								<Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									required
								/>
							</div>
						)}

						<Button type="submit" className="w-full h-10 text-sm font-medium mt-2" disabled={isLoading}>
							{isLoading && isSignup ? (
								<div className="flex items-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span>Creating Account...</span>
								</div>
							) : (
								isLogin ? "Sign In" : "Create Account"
							)}
						</Button>
							</form>

					{isSignup && (
						<p className="text-[11px] text-center text-muted-foreground">
							By creating an account, you agree to our{" "}
							<span className="underline cursor-pointer">Terms</span> and{" "}
							<span className="underline cursor-pointer">Privacy Policy</span>
						</p>
					)}

					<p className="text-center text-sm text-muted-foreground pt-2">
						{isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
						<button
							className="text-foreground font-medium hover:underline"
							onClick={() => onModeChange?.(isLogin ? "signup" : "login")}
						>
							{isLogin ? "Sign up" : "Sign in"}
						</button>
					</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
