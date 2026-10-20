'use client';

import React, { useState } from 'react';
import { ShoppingBag, Zap, Plus, Minus, ShieldCheck, Truck, Sparkles, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from './ui/Toast';
import { Button } from './ui/Button';

interface ProductActionsProps {
  item: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category?: string;
  };
}

export default function ProductActions({ item }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(item, quantity);
    setAdded(true);
    toast(`Added ${quantity}x ${item.name} to your bag!`, 'success');
    setIsCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(item, quantity);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="pt-6 border-t border-border space-y-6">
      
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
        <div className="flex items-center border border-border rounded-xl bg-card">
          <button 
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-l-xl transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 font-semibold text-sm min-w-8 text-center">{quantity}</span>
          <button 
            type="button"
            onClick={() => setQuantity(q => q + 1)}
            className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-r-xl transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> In Stock & Campus Ready
        </span>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          type="button"
          size="lg" 
          onClick={handleAddToCart}
          className="flex-1 text-base h-13 rounded-2xl font-semibold shadow-md flex items-center justify-center gap-2"
        >
          {added ? (
            <>
              <Check className="w-5 h-5 text-emerald-400" /> Added to Bag
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" /> Add to Cart
            </>
          )}
        </Button>
        <Button 
          type="button"
          size="lg" 
          variant="secondary" 
          onClick={handleBuyNow}
          className="flex-1 text-base h-13 rounded-2xl font-bold border-2 border-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5 text-primary" /> Buy Now
        </Button>
      </div>

      {/* University Student Assurance Badges */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3 bg-card border border-border rounded-xl flex items-center gap-2.5 text-xs text-muted-foreground">
          <Truck className="w-4 h-4 text-primary shrink-0" />
          <span>Free Dorm & Campus Drop</span>
        </div>
        <div className="p-3 bg-card border border-border rounded-xl flex items-center gap-2.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>Encrypted Card Checkout</span>
        </div>
      </div>

    </div>
  );
}
