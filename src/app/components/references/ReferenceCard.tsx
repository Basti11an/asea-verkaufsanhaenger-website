import { CalendarDays, MapPin, UserCircle2 } from 'lucide-react';
import type { AdminReference } from '../../context/AdminDataContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ReferenceCardProps {
  reference: AdminReference;
  className?: string;
  compact?: boolean;
}

export function ReferenceCard({ reference, className = '', compact = false }: ReferenceCardProps) {
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#77756f]/10 to-[#b08a57]/20">
            <UserCircle2 className="text-[#b08a57]/60" size={compact ? 42 : 56} />
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="inline-block bg-[#2f2f2d]/70 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full">
            {reference.modell}
          </span>
        </div>
      </div>

      <div className={`${compact ? 'p-4' : 'p-4 md:p-5'} bg-white/80 backdrop-blur-sm`}>
        <h3 className={`${compact ? 'text-base' : 'text-base md:text-lg'} text-[#2f2f2d] mb-1`}>
          {reference.kundenname}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 md:mb-3">
          <span className="flex items-center gap-1 text-xs text-[#77756f]">
            <MapPin size={11} className="text-[#b08a57]" />
            {reference.ort}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#77756f]">
            <CalendarDays size={11} className="text-[#b08a57]" />
            {reference.jahr}
          </span>
        </div>
        {reference.beschreibung && (
          <p className={`text-[#77756f] text-sm leading-relaxed ${compact ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {reference.beschreibung}
          </p>
        )}
      </div>
    </article>
  );
}
