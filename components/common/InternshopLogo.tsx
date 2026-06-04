interface InternshopLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function InternshopLogo({ className = '', size = 'md' }: InternshopLogoProps) {
  const sizeClasses = {
    sm: '[&_svg]:w-4 [&_svg]:h-4 text-sm',
    md: '[&_svg]:w-5 [&_svg]:h-5 text-base',
    lg: '[&_svg]:w-6 [&_svg]:h-6 text-xl',
  };

  return (
    <div className={`flex items-center gap-2 font-bold ${sizeClasses[size]} ${className}`}>
      <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
        <svg className="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
      <span className="text-black">
        Intern<span className="text-red-600">Shop</span>
      </span>
    </div>
  );
}
