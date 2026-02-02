"use client";

import { Link } from "@tanstack/react-router";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Header() {
	const { data: session } = authClient.useSession();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const navLinks = [
		{ label: "Home", to: "/" },
		{ label: "Gallery", to: "/gallery" },
		{ label: "About", to: "/about" },
		{ label: "Contact", to: "/contact" },
	];

	return (
		<header className="sticky top-0 z-50 w-full glass-pink border-b border-border/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-2 group">
						<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
							<Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
						</div>
						<span className="text-xl font-bold text-gradient-magenta font-display">
							Love by Lovef
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						{navLinks.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
								activeProps={{ className: "text-primary" }}
							>
								{link.label}
								<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
							</Link>
						))}
					</nav>

					{/* Auth Button - Desktop */}
					<div className="hidden md:flex items-center gap-4">
						{session ? (
							<Link to="/dashboard">
								<Button
									variant="default"
									size="sm"
									className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
								>
									Go to Dashboard
								</Button>
							</Link>
						) : (
							<Link to="/signin">
								<Button
									variant="outline"
									size="sm"
									className="rounded-full border-primary text-primary hover:bg-primary/10"
								>
									Sign In
								</Button>
							</Link>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<X className="w-6 h-6 text-foreground" />
						) : (
							<Menu className="w-6 h-6 text-foreground" />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-border/50">
						<nav className="flex flex-col gap-2">
							{navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent rounded-lg transition-colors"
									onClick={() => setMobileMenuOpen(false)}
								>
									{link.label}
								</Link>
							))}
							<div className="mt-4 pt-4 border-t border-border/50 px-4">
								{session ? (
									<Link
										to="/dashboard"
										onClick={() => setMobileMenuOpen(false)}
									>
										<Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
											Go to Dashboard
										</Button>
									</Link>
								) : (
									<Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
										<Button
											variant="outline"
											className="w-full rounded-full border-primary text-primary hover:bg-primary/10"
										>
											Sign In
										</Button>
									</Link>
								)}
							</div>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
