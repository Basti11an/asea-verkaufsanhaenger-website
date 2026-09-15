import type { AdminReference } from '../../context/AdminDataContext';
import { ReviewCard } from '../reviews/ReviewCard';

interface ReferenceCardProps {
  reference: AdminReference;
  className?: string;
  compact?: boolean;
}

export function ReferenceCard({ reference, className = '', compact = false }: ReferenceCardProps) {
  return <ReviewCard review={reference} className={className} compact={compact} />;
}
