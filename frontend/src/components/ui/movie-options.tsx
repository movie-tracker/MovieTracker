import { useState } from 'react';
import { Star, Heart, Eye, MessageSquare, X } from 'lucide-react';
import { Button } from './button';
import { useTranslation } from 'react-i18next';

interface MovieOptionsProps {
  movieId: string;
  isWatched: boolean;
  isFavorite: boolean;
  rating: number;
  comment: string;
  onToggleWatched: () => void;
  onToggleFavorite: () => void;
  onRate: (rating: number) => void;
  onComment: (comment: string) => void;
}

export function MovieOptions({
  isWatched,
  isFavorite,
  rating,
  comment,
  onToggleWatched,
  onToggleFavorite,
  onRate,
  onComment,
}: MovieOptionsProps) {
  const { t } = useTranslation();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [localComment, setLocalComment] = useState(comment);

  const handleCommentSubmit = () => {
    onComment(localComment);
    setShowCommentModal(false);
  };

  return (
    <div className="space-y-4 p-4 bg-slate-800 rounded-lg">
      <div className="flex w-full justify-center gap-2 mb-4">
        <Button
          variant={isWatched ? "default" : "outline"}
          size="sm"
          onClick={onToggleWatched}
          className="flex items-center gap-2 cursor-pointer w-[140px] justify-center"
        >
          <span className="inline-flex items-center justify-center bg-gray-200 rounded-full p-1 mr-1"><Eye className="w-4 h-4 text-black" /></span>
          {isWatched ? t('movie.watched', 'Watched') : t('movie.markAsWatched', 'Mark as Watched')}
        </Button>
        <Button
          variant={isFavorite ? "default" : "outline"}
          size="sm"
          onClick={onToggleFavorite}
          className="flex items-center gap-2 cursor-pointer w-[140px] justify-center"
        >
          <span className="inline-flex items-center justify-center bg-gray-200 rounded-full p-1 mr-1"><Heart className="w-4 h-4 text-black" /></span>
          {isFavorite ? t('movie.favorite', 'Favorite') : t('movie.addToFavorites', 'Add to Favorites')}
        </Button>
      </div>

      <div className="h-[160px] space-y-4 flex flex-col">
        <div className="flex items-center gap-2 opacity-100 transition-opacity duration-200" 
             style={{ opacity: isWatched ? 1 : 0.3, pointerEvents: isWatched ? 'auto' : 'none' }}>
          <span className="text-sm font-medium">{t('movie.yourRating', 'Your Rating')}:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => isWatched && onRate(star)}
                className="focus:outline-none"
              >
                <span className="inline-flex items-center justify-center bg-gray-200 rounded-full p-1">
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-100 transition-opacity duration-200"
             style={{ opacity: isWatched ? 1 : 0.3, pointerEvents: isWatched ? 'auto' : 'none' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isWatched) {
                setShowCommentModal(true);
                setLocalComment(comment);
              }
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="inline-flex items-center justify-center bg-gray-200 rounded-full p-1 mr-1"><MessageSquare className="w-4 h-4 text-black" /></span>
            {comment ? t('movie.editComment', 'Edit Comment') : t('movie.addComment', 'Add Comment')}
          </Button>
        </div>

        <div className="flex-1 min-h-[60px]">
          {comment && (
            <div className="bg-blue-100 rounded-lg px-3 py-2 flex gap-2 w-full opacity-100 transition-opacity duration-200"
                 style={{ opacity: isWatched ? 1 : 0.3 }}>
              <p className="text-sm text-black break-words break-all whitespace-pre-line flex-1 hyphens-auto" style={{ hyphens: 'auto' }} lang="pt">{comment}</p>
              {isWatched && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onComment('')}
                  className="text-red-400 hover:text-red-600"
                  title={t('movie.removeComment', 'Remove comment')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" />
                  </svg>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {showCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={() => setShowCommentModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">{t('movie.addComment', 'Add Comment')}</h2>
            <textarea
              value={localComment}
              onChange={(e) => setLocalComment(e.target.value)}
              placeholder={t('movie.writeComment', 'Write your comment here...')}
              className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleCommentSubmit} className="flex-1">
                {t('movie.saveComment', 'Save')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentModal(false);
                  setLocalComment(comment);
                }}
                className="flex-1"
              >
                {t('movie.cancel', 'Cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}