'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, LogOut, PlusCircle, Settings, User, LayoutDashboard, PackageCheck } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useSession, signOut } from 'next-auth/react';
import { Avatar } from '@/components/ui/Avatar';
import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem } from '@/components/ui/Dropdown';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { totalCount, setIsCartOpen } = useCart();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/items', label: 'Shop' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">UniShop</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center animate-in zoom-in shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>

            {session ? (
                <>
                    <Link href="/admin/add">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <PlusCircle className="w-4 h-4" /> Add Item
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4 border-l border-border pl-4">
                        <DropdownMenu>
                            <DropdownTrigger>
                                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                    <span className="text-sm font-medium">{session.user?.name || "Admin"}</span>
                                    <Avatar src={session.user?.image} fallback={session.user?.name?.charAt(0) || "U"} className="w-8 h-8" />
                                </div>
                            </DropdownTrigger>
                            <DropdownContent align="right">
                                <Link href="/dashboard">
                                    <DropdownItem>
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </DropdownItem>
                                </Link>
                                <Link href="/dashboard/orders">
                                    <DropdownItem>
                                        <PackageCheck className="w-4 h-4 mr-2" />
                                        Orders
                                    </DropdownItem>
                                </Link>
                                <Link href="/settings">
                                    <DropdownItem>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </DropdownItem>
                                </Link>
                                <DropdownItem onClick={() => signOut({ callbackUrl: '/' })}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownItem>
                            </DropdownContent>
                        </DropdownMenu>
                    </div>
                </>
            ) : (
                <Link href="/login">
                    <Button size="sm">Login</Button>
                </Link>
            )}
          </div>

          {/* Mobile Right Controls: Cart & Menu */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground/80 hover:text-foreground rounded-full hover:bg-secondary transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-primary hover:text-primary/80 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  pathname === link.href
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                )}
              >
                {link.label}
              </Link>
            ))}
             <div className="px-3 pt-2 space-y-2">
                 {session ? (
                     <>
                        <Link href="/admin/add" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <PlusCircle className="w-4 h-4" /> Add Item
                            </Button>
                        </Link>
                        <Link href="/settings" onClick={() => setIsOpen(false)}>
                             <Button variant="ghost" className="w-full justify-start gap-2">
                                 <Settings className="w-4 h-4" /> Settings
                             </Button>
                        </Link>
                        <Button 
                            variant="destructive" 
                            className="w-full justify-start gap-2"
                            onClick={() => {
                                setIsOpen(false);
                                signOut({ callbackUrl: '/' });
                            }}
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </Button>
                     </>
                 ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">Login</Button>
                    </Link>
                 )}
             </div>
          </div>
        </div>
      )}
    </nav>
  );
}
