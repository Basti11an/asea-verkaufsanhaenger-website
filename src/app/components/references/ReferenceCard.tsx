import type { AdminReference } from '../../context/AdminDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { getReferenceDescription, getReferenceModelLabel } from '../../lib/referenceUtils';

interface ReferenceCardProps {
  reference: AdminReference;
  className?: string;
  compact?: boolean;
}

export function ReferenceCard({ reference, className = '', compact = false }: ReferenceCardProps) {
  const { t } = useLanguage();
  const initials = reference.kundenname
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const description = getReferenceDescription(reference, t);

  return (
    <article className={`glass rounded-xl overflow-hidden shadow-md group ${className}`}>
      <div className={`relative ${compact ? 'h-32' : 'h-44'} bg-[#77756f]/10 overflow-hidden`}>
        {reference.bildUrl ? (
          <ImageWithFallback
            src={reference.bildUrl}
            alt={reference.kundenname}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#f3efe8]">
            <span className="text-2xl md:text-3xl font-bold tracking-[0.12em] text-[#b08a57]/70">
              {initials || 'ASEA'}
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="inline-block bg-[#2f2f2d]/70 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full">
            {getReferenceModelLabel(reference.modell, t)}
          </span>
        </div>
      </div>

      <div className={`${compact ? 'p-4' : 'p-4 md:p-5'} bg-white/80 backdrop-blur-sm`}>
        <h3 className={`${compact ? 'text-base' : 'text-base md:text-lg'} text-[#2f2f2d] mb-1`}>
          {reference.kundenname}
        </h3>
        <div className="text-xs text-[#77756f] mb-2 md:mb-3">
          {reference.ort} - {reference.jahr}
        </div>
        {description && (
          <p className={`text-[#77756f] text-sm leading-relaxed ${compact ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {description}
          </p>
        )}
      </div>
    </article>
  );
}
