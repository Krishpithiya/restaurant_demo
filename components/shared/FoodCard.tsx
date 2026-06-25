'use client';
import { FoodItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, Minus, Flame, Leaf } from 'lucide-react';
import Image from 'next/image';

interface FoodCardProps {
  item: FoodItem;
  quantity?: number;
  onAdd?: (item: FoodItem) => void;
  onRemove?: (item: FoodItem) => void;
  selectable?: boolean;
}

const spiceColors = {
  mild: 'text-green-600',
  medium: 'text-amber-600',
  hot: 'text-red-600',
};

const spiceCount = { mild: 1, medium: 2, hot: 3 };

export default function FoodCard({ item, quantity = 0, onAdd, onRemove, selectable = false }: FoodCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-card border border-brand-cream-dark overflow-hidden hover:shadow-card-hover transition-all duration-300 ${selectable ? 'cursor-default' : ''} ${!item.isAvailable ? 'opacity-60' : ''}`}>
      {/* Image */}
      <div className="relative h-40 bg-brand-cream-dark overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80';
          }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600 bg-white' : 'border-red-600 bg-white'}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </span>
        </div>
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-brand-brown text-xs font-bold px-3 py-1 rounded-full">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-brand-brown text-sm leading-snug line-clamp-1">{item.name}</h3>
          {item.spiceLevel && (
            <div className={`flex items-center gap-0.5 flex-shrink-0 ${spiceColors[item.spiceLevel]}`}>
              {Array.from({ length: spiceCount[item.spiceLevel] }).map((_, i) => (
                <Flame key={i} className="w-3 h-3" />
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-brand-brown-muted mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-brand-orange font-bold">{formatCurrency(item.price)}</span>

          {selectable && item.isAvailable && (
            <div className="flex items-center gap-2">
              {quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemove?.(item)}
                    className="w-7 h-7 rounded-lg bg-brand-cream-dark hover:bg-brand-orange/10 hover:text-brand-orange flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-brand-brown">{quantity}</span>
                  <button
                    onClick={() => onAdd?.(item)}
                    className="w-7 h-7 rounded-lg bg-brand-orange hover:bg-brand-orange-dark text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAdd?.(item)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
