import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowRight, Star, Truck, ShieldCheck, RefreshCw, Zap, GraduationCap } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from "@/components/sections/NewsletterForm";

import ProductCard from '@/components/ProductCard';

import { getApiUrl } from '@/lib/config';

async function getTrendingItems() {
  try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/items`, { cache: 'no-store' }); 
      if (!res.ok) return [];
      const items = await res.json();
      return items.slice(0, 4); // Just take first 4 as trending
  } catch (error) {
      console.error(error);
      return [];
  }
}

const CATEGORIES = [
  {
    name: "Bags & Backpacks",
    slug: "Bags",
    tagline: "Commuter & Campus Totes",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Watches",
    slug: "Watches",
    tagline: "Minimalist Daily Timepieces",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Clothing & Apparel",
    slug: "Clothing",
    tagline: "Heavyweight Hoodies & Tees",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Study & Tech Gear",
    slug: "Tech",
    tagline: "Laptop Stands & Daily Carry",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
  },
];

export default async function Home() {
  const trendingItems = await getTrendingItems();

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-black text-white isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="text-center space-y-6 px-4 max-w-4xl mx-auto animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sm text-gray-200 border border-white/20">
            <GraduationCap className="w-4 h-4 text-primary" /> Curated For University Students
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Campus Essentials, Styled For You.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light">
            Minimal, modern gear tailored for university life — bags, watches, apparel, and daily essentials.
          </p>
          <div className="flex justify-center gap-4 pt-4">
             <Link href="/items">
                <Button size="lg" className="rounded-full px-8 text-lg font-medium shadow-lg hover:shadow-xl transition-all">
                  Shop Student Gear
                </Button>
             </Link>
             <Link href="/items">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-lg bg-transparent text-white border-white hover:bg-white hover:text-black transition-all">
                  View Collections
                </Button>
             </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shop by Category</h2>
          <p className="text-muted-foreground mt-2">Everything you need for lectures, dorm, and campus life.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link key={i} href={`/items#${cat.slug}`} className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all block">
              <div className="absolute inset-0 bg-secondary transition-transform duration-700 group-hover:scale-105">
                 <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                    priority={i < 2}
                 />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity group-hover:from-black/90" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-semibold tracking-wider uppercase text-gray-300 mb-1">{cat.tagline}</p>
                <h3 className="text-2xl font-bold">{cat.name}</h3>
                <p className="text-sm text-primary-foreground/90 mt-2 flex items-center gap-1 font-medium transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Trending Now */}
      <section className="container mx-auto px-4 bg-secondary/30 py-16 rounded-3xl">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl font-bold">Campus Favorites</h2>
                <p className="text-muted-foreground mt-2">Top-rated picks by students this semester.</p>
            </div>
            <Link href="/items">
              <Button variant="ghost" className="hidden md:flex gap-2">View All <ArrowRight className="w-4 h-4" /></Button>
            </Link>
        </div>
        
        {trendingItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {trendingItems.map((item: any) => (
                    <ProductCard key={item._id} item={item} />
                ))}
            </div>
        ) : (
             <div className="text-center py-12 text-muted-foreground">
                <p>No trending items found yet. Seed the database to display student essentials.</p>
             </div>
        )}

        <div className="mt-8 text-center md:hidden">
            <Link href="/items">
              <Button variant="outline" className="w-full">View All Student Gear</Button>
            </Link>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-2xl bg-card border border-border space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Fast Campus Delivery</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Direct delivery to university dorms, student halls, and campus drop-points.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Secure Online Payment</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Encrypted card checkout with student-friendly billing and instant receipts.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Hassle-Free Student Returns</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Wrong size or changed your mind? 14-day simple exchange on all gear.</p>
            </div>
        </div>
      </section>

      {/* 5. Special Offers */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 skew-x-12 transform translate-x-20"></div>
            <div className="relative z-10 p-10 md:p-20 text-center md:text-left md:flex justify-between items-center">
                <div className="space-y-6 max-w-xl">
                    <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
                        <Zap className="w-4 h-4 inline mr-1" /> Student Special Discount
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Get 10% Off Your First Order</h2>
                    <p className="text-base md:text-lg opacity-90">Gear up for class. Enter coupon code <span className="font-mono font-bold bg-white/20 px-2 py-1 rounded">CAMPUS10</span> at checkout.</p>
                    <Link href="/items">
                      <Button size="lg" variant="secondary" className="rounded-full px-8 shadow-md hover:scale-105 transition-transform">Shop With Discount</Button>
                    </Link>
                </div>
                <div className="hidden md:block">
                    <div className="w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
      </section>

      {/* 6. Customer Reviews */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah K.",
                major: "Design Student, Class of '26",
                comment: "The commuter backpack easily fits my 16-inch MacBook and sketchpad. Waterproof and super sleek!"
              },
              {
                name: "Marcus T.",
                major: "Computer Science, 3rd Year",
                comment: "Minimalist watch has that clean Scandi aesthetic without breaking a student budget. Highly recommend."
              },
              {
                name: "Ayesha N.",
                major: "Business & Marketing",
                comment: "Fast campus dorm delivery and the oversized hoodie quality is unmatched. UniShop is my go-to now."
              }
            ].map((review, i) => (
                <div key={i} className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex gap-1 text-yellow-500 mb-4">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-base italic mb-6 leading-relaxed text-foreground">"{review.comment}"</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{review.name}</p>
                            <p className="text-xs text-muted-foreground">{review.major}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 7. Newsletter */}
      <section className="container mx-auto px-4 mb-16">
        <div className="bg-muted rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the Campus Community</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Get notified on seasonal drops, student flash sales, and university pop-ups.</p>
            <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
