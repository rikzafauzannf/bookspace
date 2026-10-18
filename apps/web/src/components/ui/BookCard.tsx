import React from 'react';
import Link from 'next/link';
import { Badge } from './Badge';

export interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: 'COLLECTION' | 'OPEN_TRADE' | 'AVAILABLE_FOR_RENT' | 'RENTED' | 'TRADED';
  condition: number;
  ownerName: string;
  ownerCity: string;
  ownerTrustScore: number;
}

export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  coverUrl,
  status,
  condition,
  ownerName,
  ownerCity,
  ownerTrustScore,
}) => {
  const statusBadge = () => {
    switch (status) {
      case 'AVAILABLE_FOR_RENT':
        return <Badge variant="available">Bisa Dipinjam</Badge>;
      case 'OPEN_TRADE':
        return <Badge variant="trade">Open Trade</Badge>;
      case 'RENTED':
        return <Badge variant="rented">Sedang Dipinjam</Badge>;
      default:
        return <Badge variant="rented">Koleksi</Badge>;
    }
  };

  return (
    <Link href={`/books/${id}`} className="group block">
      <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
        {/* Cover Image */}
        <div className="relative w-full aspect-[2/3] bg-brand-paperDark rounded-xl overflow-hidden mb-3.5 flex items-center justify-center">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-center p-4">
              <span className="text-3xl block mb-1">📖</span>
              <span className="text-xs font-serif text-brand-muted line-clamp-2">{title}</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            {statusBadge()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-sm text-brand-charcoal line-clamp-1 group-hover:text-brand-wood transition-colors">
              {title}
            </h3>
            <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">{author}</p>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-600 font-medium">
              <span>★</span>
              <span>Kondisi {condition}/5</span>
            </div>
          </div>

          {/* Owner info */}
          <div className="mt-3 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="font-medium text-brand-charcoal block truncate">{ownerName}</span>
              <span className="text-[10px] text-brand-muted">{ownerCity}</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-100">
              {ownerTrustScore}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
