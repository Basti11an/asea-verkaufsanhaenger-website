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

const imageSizeClasses = {
  header: 'h-[30px] w-auto md:h-[34px]',
  hero: 'h-auto w-[255px] max-w-full sm:w-[315px] md:w-[360px] lg:w-[430px] xl:w-[500px]',
};

const toneClasses = {
  bronze: 'text-[#b08a57]',
  light: 'text-white',
  dark: 'text-[#2f2f2d]',
};

export function AseaWordmark({ size = 'header', tone = 'bronze', className = '' }: AseaWordmarkProps) {
  if (size === 'header' || size === 'hero') {
    return (
      <img
        src="/asea-logo.png"
        alt="ASEA"
        draggable={false}
        className={`block select-none object-contain ${imageSizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <span
      aria-label="ASEA"
      className={`inline-block select-none uppercase ${sizeClasses[size]} ${toneClasses[tone]} ${className}`}
    >
      ASEA
    </span>
  );
}
