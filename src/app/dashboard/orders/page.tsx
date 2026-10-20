'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  PackageCheck, 
  Clock, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Loader2
} from 'lucide-react';
import { getApiUrl } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    university?: string;
    dormAddress: string;
    notes?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  discountCode?: string;
  discountAmount?: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDetails?: {
    transactionId: string;
    cardBrand: string;
    last4: string;
    gateway?: string;
  };
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export default function OrdersDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/orders`);
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      toast('Failed to load orders. Verify server is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (!res.ok) throw new Error('Status update failed');
      
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus as any } : o));
      toast(`Order status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      toast('Could not update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold"><CheckCircle className="w-3.5 h-3.5" /> Delivered</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 font-semibold"><Truck className="w-3.5 h-3.5" /> Shipped</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 font-semibold"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-destructive/10 text-destructive font-semibold"><AlertCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 font-semibold"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Student Campus Orders</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage incoming student deliveries, campus drop points, and order statuses.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchOrders} 
            disabled={loading}
            className="self-start sm:self-auto gap-2 rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-muted-foreground space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Fetching student orders from database...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-border space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
              <PackageCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">No orders yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                When students place orders via checkout, they will appear right here in real time.
              </p>
            </div>
            <Link href="/items">
              <Button variant="outline" className="rounded-full">Visit Storefront</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order._id}
                className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm">#{order._id}</span>
                      {getStatusBadge(order.orderStatus)}
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1 text-foreground font-medium">
                        {order.customer.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {order.customer.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {order.customer.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <span className="text-lg font-bold text-primary">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className="text-xs font-semibold bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Campus Address & Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground">Campus Drop Location:</span>
                      <p className="text-muted-foreground">{order.customer.university ? `${order.customer.university} — ` : ''}{order.customer.dormAddress}</p>
                      {order.customer.notes && (
                        <p className="text-muted-foreground italic mt-0.5">Note: "{order.customer.notes}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 text-muted-foreground">
                    <div>
                      <span className="font-semibold text-foreground">Payment: </span>
                      <span className="capitalize">{order.paymentDetails?.gateway || 'Stripe Card'}</span>
                      {order.paymentDetails?.last4 && (
                        <span className="font-mono ml-1">({order.paymentDetails.cardBrand} •••• {order.paymentDetails.last4})</span>
                      )}
                    </div>
                    {order.discountCode && (
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                        Coupon {order.discountCode} (-${order.discountAmount?.toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>

                {/* Items Ordered */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Items ({order.items.reduce((s, i) => s + i.quantity, 0)}):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-background border border-border rounded-xl">
                        {item.imageUrl ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                            <Image 
                              src={item.imageUrl} 
                              alt={item.name} 
                              fill 
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                            <PackageCheck className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold truncate text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity}x @ ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
