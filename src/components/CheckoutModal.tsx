'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  ArrowRight,
  Loader2,
  Tag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getApiUrl } from '@/lib/config';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function CheckoutModal() {
  const { 
    cart, 
    subtotal, 
    clearCart, 
    isCheckoutOpen, 
    setIsCheckoutOpen 
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Student form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    dormAddress: '',
    notes: '',
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Payment form state
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
    cardHolder: '',
  });

  if (!isCheckoutOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'CAMPUS10' || code === 'WELCOME20') {
      const percent = code === 'WELCOME20' ? 20 : 10;
      setAppliedDiscount({ code, percent });
    } else {
      setCouponError('Invalid promo code. Try "CAMPUS10"');
    }
  };

  const discountAmount = appliedDiscount 
    ? (subtotal * appliedDiscount.percent) / 100 
    : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = getApiUrl();
      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          university: formData.university || 'Campus Student',
          dormAddress: formData.dormAddress,
          notes: formData.notes,
        },
        items: cart,
        totalAmount: Number(finalTotal.toFixed(2)),
        discountCode: appliedDiscount?.code || null,
        discountAmount: Number(discountAmount.toFixed(2)),
        paymentMethod: 'online_card',
        paymentDetails: {
          transactionId: 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          cardBrand: 'Visa',
          last4: '4242',
          gateway: 'stripe_online'
        }
      };

      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to process order');
      }

      setOrderSuccess(data.order);
      clearCart();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Something went wrong while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderSuccess(null);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-2xl bg-background rounded-3xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">University Student Checkout</h3>
                <p className="text-xs text-muted-foreground">Fast campus delivery & secure online payment</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {orderSuccess ? (
            /* Order Success State */
            <div className="p-8 sm:p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Order Confirmed!</h2>
                <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                  Thank you, <span className="font-semibold text-foreground">{orderSuccess.customer.name}</span>. 
                  Your payment was successful and your gear is being prepped for campus delivery!
                </p>
              </div>

              <div className="bg-muted/50 p-6 rounded-2xl text-left text-sm space-y-3 border border-border max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono font-bold text-xs">{orderSuccess._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Campus Drop:</span>
                  <span className="font-medium text-foreground">{orderSuccess.customer.dormAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span className="text-emerald-600 font-semibold uppercase text-xs">Paid ({orderSuccess.paymentDetails.cardBrand} •••• {orderSuccess.paymentDetails.last4})</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                  <span>Total Paid:</span>
                  <span className="text-primary">${orderSuccess.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                onClick={handleClose}
                className="rounded-full px-8 h-12 text-base font-semibold"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
              
              {errorMessage && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Student Delivery Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  1. Campus Delivery Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Full Name *</label>
                    <Input 
                      required 
                      placeholder="e.g. Alex Johnson" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Student Email *</label>
                    <Input 
                      type="email"
                      required 
                      placeholder="alex@university.edu" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Phone / WhatsApp *</label>
                    <Input 
                      type="tel"
                      required 
                      placeholder="+1 (555) 000-0000" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">University / College</label>
                    <Input 
                      placeholder="e.g. State University" 
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Dorm / Hall / Delivery Address *</label>
                  <Input 
                    required 
                    placeholder="e.g. North Hall, Room 304 (or Campus Gate 2)" 
                    value={formData.dormAddress}
                    onChange={(e) => setFormData({ ...formData, dormAddress: e.target.value })}
                  />
                </div>
              </div>

              {/* Student Discount Coupon */}
              <div className="p-4 bg-secondary/50 rounded-2xl border border-border space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input 
                      placeholder="Promo code (e.g. CAMPUS10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="pl-9 h-10"
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleApplyCoupon}
                    className="h-10 text-xs px-4"
                  >
                    Apply
                  </Button>
                </div>
                {appliedDiscount && (
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Coupon {appliedDiscount.code} applied! ({appliedDiscount.percent}% OFF)
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-destructive">{couponError}</p>
                )}
              </div>

              {/* Online Payment Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    2. Online Payment Gateway (Stripe / Card)
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <Lock className="w-3.5 h-3.5" /> 256-bit SSL Encrypted
                  </div>
                </div>

                <div className="p-5 border border-primary/20 bg-card rounded-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Credit or Debit Card</span>
                    </div>
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Demo Card 4242 Ready
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Card Number</label>
                    <Input 
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      placeholder="4242 4242 4242 4242"
                      className="font-mono text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Expiration (MM/YY)</label>
                      <Input 
                        value={cardData.cardExp}
                        onChange={(e) => setCardData({ ...cardData, cardExp: e.target.value })}
                        placeholder="MM/YY"
                        className="font-mono text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">CVC Security Code</label>
                      <Input 
                        value={cardData.cardCvc}
                        onChange={(e) => setCardData({ ...cardData, cardCvc: e.target.value })}
                        placeholder="CVC"
                        className="font-mono text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-sm pt-2 border-t border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Student Discount ({appliedDiscount.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Campus Delivery</span>
                  <span className="text-emerald-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                  <span>Total Amount</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-13 text-base rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...
                    </>
                  ) : (
                    <>
                      Pay ${finalTotal.toFixed(2)} & Place Order <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  By clicking Pay, you agree to UniShop Campus Delivery Terms.
                </p>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
