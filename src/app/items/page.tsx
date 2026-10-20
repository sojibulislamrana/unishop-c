import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { getApiUrl } from '@/lib/config';

async function getItems() {
  try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/items`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      return res.json();
  } catch (error) {
      console.error(error);
      return [];
  }
}

interface Item {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
}

export default async function ItemsPage() {
  const items: Item[] = await getItems();

  // Group items by category
  const categorizedItems: Record<string, Item[]> = {};
  items.forEach(item => {
    const cat = item.category || 'General';
    if (!categorizedItems[cat]) categorizedItems[cat] = [];
    categorizedItems[cat].push(item);
  });

  const categories = Object.keys(categorizedItems).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Campus Collections</h1>
        <p className="text-muted-foreground">Everyday bags, timepieces, streetwear, and study essentials designed for university life.</p>
        
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map(cat => (
              <a 
                key={cat} 
                href={`#${cat}`} 
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {cat} ({categorizedItems[cat].length})
              </a>
            ))}
          </div>
        )}
      </div>
      
      {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
              <p className="text-lg">No items found or server is connecting...</p>
          </div>
      ) : (
          <div className="space-y-16">
            {categories.map(category => (
                <section key={category} id={category} className="scroll-mt-24">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold">{category}</h2>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
                          {categorizedItems[category].length} items
                        </span>
                        <div className="h-px bg-border flex-1" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categorizedItems[category].map(item => (
                            <ProductCard key={item._id} item={item} />
                        ))}
                    </div>
                </section>
            ))}
          </div>
      )}
    </div>
  );
}
