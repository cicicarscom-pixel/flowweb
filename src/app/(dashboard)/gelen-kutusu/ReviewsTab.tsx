import React from 'react';

type ReviewsTabProps = {
  activeTab: "mesajlar" | "yorumlar" | "degerlendirmeler" | "bildirimler";
  isLoading: boolean;
  isSelectionMode: boolean;
  locale: string;
  reviews: any[];
  selectedItems: string[];
  toggleSelection: (id: string) => void;
};

export function ReviewsTab({ activeTab, isLoading, isSelectionMode, locale, reviews, selectedItems, toggleSelection }: ReviewsTabProps) {
  return (
    !isLoading && activeTab === 'degerlendirmeler' && (
      reviews.map(rev => (
        <div 
          key={rev.id}
          onClick={() => isSelectionMode ? toggleSelection(rev.id) : null}
          className={`glass flex flex-col gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
            selectedItems.includes(rev.id) 
              ? 'border-[#f59e0b] bg-[#f59e0b]/5' 
              : 'border-dark-border bg-dark-card hover:border-dark-muted/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isSelectionMode && (
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  selectedItems.includes(rev.id) ? 'bg-[#f59e0b] border-[#f59e0b] text-white' : 'border-dark-muted'
                }`}>
                  {selectedItems.includes(rev.id) && <i className="fa-solid fa-check text-xs"></i>}
                </div>
              )}
              <h3 className="font-semibold text-on-surface">{rev.reviewer_name}</h3>
            </div>
            <span className="text-xs text-dark-muted">
              {rev.created_at ? new Date(rev.created_at).toLocaleDateString(locale) : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <i key={star} className={`fa-solid fa-star text-sm ${star <= rev.rating ? 'text-[#f59e0b]' : 'text-gray-600'}`}></i>
            ))}
          </div>
          
          <p className="text-sm text-dark-muted leading-relaxed">
            "{rev.content}"
          </p>
        </div>
      ))
    )
  );
}
