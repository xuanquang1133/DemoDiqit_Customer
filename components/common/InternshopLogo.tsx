import CustomerShoppingBagIcon from '@/components/icons/CustomerShoppingBagIcon';

interface InternshopLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function InternshopLogo({ className = '', size = 'md' }: InternshopLogoProps) {
  const sizeClasses = {
    sm: 'text-sm [&_svg]:w-4 [&_svg]:h-4',
    md: 'text-lg [&_svg]:w-5 [&_svg]:h-5',
    lg: 'text-2xl [&_svg]:w-6 [&_svg]:h-6',
  };

  return (
    <div className={`flex items-center gap-2 font-bold text-slate-800 ${sizeClasses[size]} ${className}`}>
      <CustomerShoppingBagIcon />
      <span>InternShop</span>
    </div>
  );
}
