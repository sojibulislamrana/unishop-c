'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from './ui/Button';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    totalCount,
    setIsCheckoutOpen 
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Your Bag</h2>
              <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Your bag is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">Explore our student essentials and add your favorite gear.</p>
                </div>
                <Button 
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full px-6"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item._id} 
                  className="flex gap-4 p-3 bg-card border border-border rounded-xl shadow-xs"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name} 
                      fill 
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.category || 'Student Essential'}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-semibold text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border bg-card space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Campus Delivery</span>
                  <span className="text-emerald-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                onClick={handleCheckoutClick}
                className="w-full h-12 rounded-xl text-base font-semibold shadow-md flex items-center justify-center gap-2"
              >
                Checkout Now <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                🔒 Secure Student Checkout • Free Campus Delivery
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
