"use client";

import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, Eye, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Card {
  id: string;
  front: string;
  back: string;
  frontEn?: string | null;
  backEn?: string | null;
  type: string;
  articleRef?: string | null;
  difficulty: string;
  order: number;
}

interface FlashcardReviewProps {
  cards: Card[];
  deckTitleFa: string;
  deckTitleEn: string;
  onReview: (cardId: string, status: string) => Promise<void>;
  onComplete: () => void;
  onBack: () => void;
  masteredCardIds: Set<string>;
}

export function FlashcardReview({
  cards,
  deckTitleFa,
  deckTitleEn,
  onReview,
  onComplete,
  onBack,
  masteredCardIds,
}: FlashcardReviewProps) {
  const language = useAppStore((s) => s.language);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const [reviewStartTime, setReviewStartTime] = useState(Date.now());
  const [localMastered, setLocalMastered] = useState<Set<string>>(new Set(masteredCardIds));
  const [saving, setSaving] = useState(false);

  // Filter to cards not yet mastered for the session
  const remainingCards = cards.filter((c) => !localMastered.has(c.id));
  const currentCard = remainingCards[currentIndex % Math.max(remainingCards.length, 1)];
  const allMastered = remainingCards.length === 0;

  useEffect(() => {
    setReviewStartTime(Date.now());
    setShowAnswer(false);
    setButtonsEnabled(false);
  }, [currentIndex]);

  // Enable rating buttons after 3 seconds of showing the answer
  useEffect(() => {
    if (!showAnswer) {
      setButtonsEnabled(false);
      return;
    }
    const timer = setTimeout(() => setButtonsEnabled(true), 3000);
    return () => clearTimeout(timer);
  }, [showAnswer]);

  const handleRating = useCallback(
    async (status: string) => {
      if (!currentCard || saving) return;
      const elapsed = Date.now() - reviewStartTime;
      if (elapsed < 3000) return; // anti-cheat: minimum 3 seconds

      setSaving(true);
      try {
        await onReview(currentCard.id, status);

        if (status === "MASTERED") {
          setLocalMastered((prev) => new Set(prev).add(currentCard.id));
        }

        setShowAnswer(false);

        // Move to next card
        const nextRemaining = cards.filter(
          (c) => !localMastered.has(c.id) && !(status === "MASTERED" && c.id === currentCard.id)
        );
        if (nextRemaining.length === 0) {
          // All done
        } else {
          setCurrentIndex((i) => (i + 1) % nextRemaining.length);
        }
      } finally {
        setSaving(false);
      }
    },
    [currentCard, saving, reviewStartTime, onReview, cards, localMastered]
  );

  // Check completion
  useEffect(() => {
    if (allMastered && cards.length > 0) {
      onComplete();
    }
  }, [allMastered, cards.length, onComplete]);

  if (allMastered) {
    return null; // Parent handles the completion modal
  }

  if (!currentCard) return null;

  const progressText = `${localMastered.size} ${t("flashcard_of", language)} ${cards.length}`;

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ChevronLeft size={16} />
          {t("flashcard_back_to_decks", language)}
        </button>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {progressText}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full h-1.5 mb-6" style={{ background: "var(--bg-secondary)" }}>
        <div
          className="h-1.5 rounded-full transition-all"
          style={{
            width: `${(localMastered.size / cards.length) * 100}%`,
            background: "var(--accent-gradient)",
          }}
        />
      </div>

      {/* Card */}
      <div className="card p-6 sm:p-8 min-h-[280px] flex flex-col">
        {/* Article reference tag */}
        {currentCard.articleRef && (
          <span
            className="tag text-xs self-start mb-3"
          >
            {t("flashcard_article", language)} {currentCard.articleRef.replace("Article ", "")}
          </span>
        )}

        {/* Difficulty */}
        <span
          className="text-[10px] uppercase tracking-wider self-start mb-4"
          style={{
            color: currentCard.difficulty === "ADVANCED"
              ? "var(--error)"
              : currentCard.difficulty === "INTERMEDIATE"
                ? "var(--warning, #f59e0b)"
                : "var(--success, #22c55e)",
          }}
        >
          {currentCard.difficulty}
        </span>

        {/* Front (question) */}
        <div className="flex-1 flex items-center justify-center">
          <p
            className="text-base sm:text-lg font-medium text-center leading-relaxed"
            style={{ color: "var(--text-primary)", direction: language === "fa" ? "rtl" : "ltr" }}
          >
            {language === "en" && currentCard.frontEn ? currentCard.frontEn : currentCard.front}
          </p>
        </div>

        {/* Answer section */}
        {showAnswer ? (
          <div
            className="mt-6 pt-4 border-t"
            style={{ borderColor: "var(--border)", direction: language === "fa" ? "rtl" : "ltr" }}
          >
            <p
              className="text-sm sm:text-base leading-relaxed mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {language === "en" && currentCard.backEn ? currentCard.backEn : currentCard.back}
            </p>

            {/* Rating buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRating("SEEN")}
                disabled={saving || !buttonsEnabled}
                className="py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  color: "var(--error)",
                  opacity: buttonsEnabled ? 1 : 0.4,
                  cursor: buttonsEnabled ? "pointer" : "not-allowed",
                }}
              >
                {t("flashcard_didnt_know", language)}
              </button>
              <button
                onClick={() => handleRating("LEARNING")}
                disabled={saving || !buttonsEnabled}
                className="py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all"
                style={{
                  background: "rgba(245,158,11,0.15)",
                  color: "var(--warning, #f59e0b)",
                  opacity: buttonsEnabled ? 1 : 0.4,
                  cursor: buttonsEnabled ? "pointer" : "not-allowed",
                }}
              >
                {t("flashcard_almost", language)}
              </button>
              <button
                onClick={() => handleRating("MASTERED")}
                disabled={saving || !buttonsEnabled}
                className="py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "var(--success, #22c55e)",
                  opacity: buttonsEnabled ? 1 : 0.4,
                  cursor: buttonsEnabled ? "pointer" : "not-allowed",
                }}
              >
                {t("flashcard_knew_it", language)}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            className="mt-6 btn-primary w-full justify-center"
          >
            <Eye size={16} />
            {t("flashcard_show_answer", language)}
          </button>
        )}
      </div>

      {/* Card counter */}
      <p className="text-center text-xs mt-3" style={{ color: "var(--text-muted)" }}>
        {currentIndex + 1} / {remainingCards.length} {t("flashcard_cards", language)}
      </p>
    </div>
  );
}
