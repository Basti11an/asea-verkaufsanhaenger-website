interface AseaWordmarkProps {
  size?: 'header' | 'hero' | 'footer';
  tone?: 'bronze' | 'light' | 'dark';
  className?: string;
}

const sizeClasses = {
  header: 'text-[30px] leading-none tracking-[0.22em] font-bold',
  hero: 'text-[60px] sm:text-[72px] md:text-[96px] lg:text-[116px] xl:text-[136px] leading-[0.85] tracking-[0] font-extrabold',
  footer: 'text-[30px] leading-none tracking-[0.22em] font-bold',
};

const toneClasses = {
  bronze: 'text-[#b08a57]',
  light: 'text-white',
  dark: 'text-[#2f2f2d]',
};

export function AseaWordmark({ size = 'header', tone = 'bronze', className = '' }: AseaWordmarkProps) {
  return (
    <span
      aria-label="ASEA"
      className={`inline-block select-none uppercase ${sizeClasses[size]} ${toneClasses[tone]} ${className}`}
    >
      ASEA
    </span>
  );
}
