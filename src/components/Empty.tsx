import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ShoppingCart, Package, Heart, ClipboardList } from 'lucide-react';

// Empty component
export function Empty({ type = 'default' }: { type?: 'cart' | 'orders' | 'wishlist' | 'default' }) {
  const getIcon = () => {
    switch(type) {
      case 'cart':
        return <ShoppingCart size={48} className="text-gray-300 mb-4" />;
      case 'orders':
        return <Package size={48} className="text-gray-300 mb-4" />;
      case 'wishlist':
        return <Heart size={48} className="text-gray-300 mb-4" />;
      default:
        return <ClipboardList size={48} className="text-gray-300 mb-4" />;
    }
  };

  const getMessage = () => {
    switch(type) {
      case 'cart':
        return 'Your cart is empty';
      case 'orders':
        return 'No orders found';
      case 'wishlist':
        return 'Your wishlist is empty';
      default:
        return 'No items found';
    }
  };

  return (
    <div className={cn("flex flex-col h-full items-center justify-center py-12")} onClick={() => toast('Coming soon')}>
      {getIcon()}
      <h3 className="text-xl font-semibold mb-2">{getMessage()}</h3>
      <p className="text-gray-500 text-center max-w-md">
        {type === 'cart' ? 'Looks like you haven\'t added any items to your cart yet.' : 
         type === 'orders' ? 'You haven\'t placed any orders yet.' : 
         type === 'wishlist' ? 'Save your favorite items for later.' : 
         'Try adjusting your filters or search criteria.'}
      </p>
    </div>
  );
}