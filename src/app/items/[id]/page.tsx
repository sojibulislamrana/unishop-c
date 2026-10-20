import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductActions from '@/components/ProductActions';
import { getApiUrl } from '@/lib/config';

async function getItem(id: string) {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/api/items/${id}`, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch item');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/items">
        <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all">&larr; Back to Shop</Button>
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square bg-secondary rounded-3xl overflow-hidden shadow-lg border border-border">
           <Image 
                src={item.imageUrl} 
                alt={item.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
            />
        </div>
        <div className="space-y-6 self-start">
            <div>
                <span className="text-xs font-semibold uppercase tracking-wider bg-secondary px-3 py-1 rounded-full text-secondary-foreground">
                  {item.category || 'Student Gear'}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">{item.name}</h1>
            </div>
            
            <p className="text-3xl font-extrabold text-primary">${item.price.toFixed(2)}</p>
            
            <p className="text-base text-muted-foreground leading-relaxed">
              {item.description}
            </p>
            
            {/* Interactive Actions (Quantity, Add to Cart, Buy Now, Checkout Modal) */}
            <ProductActions item={item} />
        </div>
      </div>
    </div>
  );
}
