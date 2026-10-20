'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ShoppingBag, Settings, PlusCircle, PackageCheck, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { getApiUrl } from '@/lib/config';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/api/orders/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin & Store Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {session?.user?.name || 'Store Owner'}. Monitor student orders and catalog performance.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Sales</span>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${stats ? stats.totalRevenue.toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Processed online orders</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
              <PackageCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats ? stats.totalOrders : '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Campus student orders</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Pending Drop</span>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats ? stats.pendingOrders : '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting dispatch</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Delivered</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats ? stats.deliveredOrders : '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completed campus drops</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <PackageCheck className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Campus Orders</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              View incoming orders, check dorm delivery addresses, and mark as delivered.
            </p>
            <Link href="/dashboard/orders">
              <Button className="w-full rounded-xl">
                View Orders
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Manage Catalog</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Browse your student product collections and inventory.
            </p>
            <Link href="/items">
              <Button variant="outline" className="w-full rounded-xl">
                Go to Shop
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <PlusCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Add Product</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Publish a new student product listing to the store.
            </p>
            <Link href="/admin/add">
              <Button variant="outline" className="w-full rounded-xl">
                Add Item
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-primary/10 rounded-full">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Store Settings</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Update store profile, campus delivery options, and credentials.
            </p>
            <Link href="/settings">
              <Button variant="outline" className="w-full rounded-xl">
                View Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
