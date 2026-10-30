'use client';

import React, { useState, useEffect } from 'react';
import {
  LANGUAGES,
  ALPHABETS,
  GRAMMAR_LESSONS,
  QUIZ_QUESTIONS,
  UI_TRANSLATIONS,
  getVocabularyForLanguage,
} from '@/data/languagesData';
import {
  ActiveTab,
  Language,
  SubscriptionPlan,
  ThemeMode,
  UILocale,
  UserSubscription,
  VocabWord,
  isLanguageFree,
} from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VocabularyDeck } from '@/components/VocabularyDeck';
import { PronunciationStudio } from '@/components/PronunciationStudio';
import { AlphabetView } from '@/components/AlphabetView';
import { GrammarGuide } from '@/components/GrammarGuide';
import { QuizArena } from '@/components/QuizArena';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import {
  BookOpen,
  Mic,
  Languages as LanguagesIcon,
  HelpCircle,
  Sparkles,
  Lock,
  Crown,
  Zap,
} from 'lucide-react';

const STORAGE_KEY = 'lingosphere_user_progress_v2';
const THEME_KEY = 'lingosphere_theme_mode';
const SUBSCRIPTION_STORAGE_KEY = 'lingosphere_user_subscription_v2';

function createSubscriptionExpiry(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString();
}

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('words');
  const [uiLocale, setUiLocale] = useState<UILocale>('uz');
  const [activePracticeWord, setActivePracticeWord] = useState<VocabWord | null>(null);

  // Subscription Modal state
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [subscriptionTargetLang, setSubscriptionTargetLang] = useState<Language | null>(null);

  // Theme Mode: Light or Dark
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'dark' || saved === 'light') return saved;
        return 'dark';
      } catch {
        // ignore
      }
    }
    return 'dark';
  });

  // User Subscription state (Free: Uzbek, Russian, English. Others: Paid $10-$20)
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.isVip === 'boolean') return parsed;
        }
      } catch {
        // ignore
      }
    }
    return {
      isVip: false,
      planId: 'none',
      unlockedLanguageIds: [],
    };
  });

  // Synchronize 'dark' class on html document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User persistent progress
  const [xp, setXp] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.xp === 'number') return parsed.xp;
        }
      } catch {
        // ignore
      }
    }
    return 100;
  });

  const [streakDays] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.streakDays === 'number') return parsed.streakDays;
        }
      } catch {
        // ignore
      }
    }
    return 4;
  });

  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.masteredIds)) return parsed.masteredIds;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.soundEnabled === 'boolean') return parsed.soundEnabled;
        }
      } catch {
        // ignore
      }
    }
    return true;
  });

  // Save progress
  const saveProgress = (newXp: number, newMastered: string[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          xp: newXp,
          streakDays,
          masteredIds: newMastered,
          soundEnabled,
        })
      );
    } catch {
      // LocalStorage fallback
    }
  };

  const handleRewardXP = (amount: number, wordOrQuizId: string) => {
    setXp((prev) => {
      const updated = prev + amount;
      const updatedMastered = masteredIds.includes(wordOrQuizId)
        ? masteredIds
        : [...masteredIds, wordOrQuizId];
      setMasteredIds(updatedMastered);
      saveProgress(updated, updatedMastered);
      return updated;
    });
  };

  const handleToggleMastered = (wordId: string) => {
    const isMastered = masteredIds.includes(wordId);
    const updated = isMastered
      ? masteredIds.filter((id) => id !== wordId)
      : [...masteredIds, wordId];

    setMasteredIds(updated);
    const updatedXp = isMastered ? xp : xp + 10;
    setXp(updatedXp);
    saveProgress(updatedXp, updated);
  };

  // Subscription Actions
  const handleRequestSubscribe = (targetLang?: Language) => {
    setSubscriptionTargetLang(targetLang || null);
    setIsSubscriptionModalOpen(true);
  };

  const handleActivatePlan = (plan: SubscriptionPlan) => {
    const updated: UserSubscription = {
      isVip: true,
      planId: plan.id,
      planName: plan.name,
      expiresAt: createSubscriptionExpiry(),
      unlockedLanguageIds: LANGUAGES.map((l) => l.id),
    };
    setSubscription(updated);
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    if (subscriptionTargetLang) {
      handleDirectSelectLanguage(subscriptionTargetLang);
    }
  };

  const handleUnlockSingleLanguage = (lang: Language) => {
    const updated: UserSubscription = {
      ...subscription,
      unlockedLanguageIds: subscription.unlockedLanguageIds.includes(lang.id)
        ? subscription.unlockedLanguageIds
        : [...subscription.unlockedLanguageIds, lang.id],
    };
    setSubscription(updated);
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    handleDirectSelectLanguage(lang);
  };

  const handleResetSubscription = () => {
    const reset: UserSubscription = {
      isVip: false,
      planId: 'none',
      unlockedLanguageIds: [],
    };
    setSubscription(reset);
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(reset));
    } catch {}

    if (selectedLanguage && !isLanguageFree(selectedLanguage.id)) {
      setSelectedLanguage(null);
    }
  };

  const handleDirectSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    setActiveTab('words');
    const words = getVocabularyForLanguage(lang.id);
    if (words && words.length > 0) {
      setActivePracticeWord(words[0]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLanguage = (lang: Language) => {
    const isFree = lang.isFree || isLanguageFree(lang.id);
    const isUnlocked =
      isFree ||
      subscription.isVip ||
      subscription.unlockedLanguageIds.includes(lang.id);

    if (!isUnlocked) {
      handleRequestSubscribe(lang);
      return;
    }

    handleDirectSelectLanguage(lang);
  };

  const handleOpenPracticeForWord = (word: VocabWord) => {
    setActivePracticeWord(word);
    setActiveTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;
  const currentLangId = selectedLanguage ? selectedLanguage.id : 'en';
  const currentWords = getVocabularyForLanguage(currentLangId);
  const currentAlphabet = ALPHABETS[currentLangId] || ALPHABETS.en;
  const currentGrammar = GRAMMAR_LESSONS[currentLangId] || GRAMMAR_LESSONS.en;
  const currentQuiz = QUIZ_QUESTIONS[currentLangId] || QUIZ_QUESTIONS.en;

  const currentPracticeWord =
    activePracticeWord && currentWords.some((w) => w.id === activePracticeWord.id)
      ? activePracticeWord
      : currentWords[0];

  const tabs = [
    { id: 'words', label: t.wordsTab, icon: BookOpen },
    { id: 'practice', label: t.practiceTab, icon: Mic },
    { id: 'alphabet', label: t.alphabetTab, icon: LanguagesIcon },
    { id: 'grammar', label: t.grammarTab, icon: Sparkles },
    { id: 'quiz', label: t.quizTab, icon: HelpCircle },
  ];

  // Check if currently opened language is unlocked
  const isCurrentLangUnlocked = selectedLanguage
    ? isLanguageFree(selectedLanguage.id) ||
      subscription.isVip ||
      subscription.unlockedLanguageIds.includes(selectedLanguage.id)
    : true;

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'dark' : ''
      } bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-red-500 selection:text-white`}
    >
      {/* Navigation Header */}
      <Navbar
        selectedLanguage={selectedLanguage}
        onBackToHome={() => setSelectedLanguage(null)}
        uiLocale={uiLocale}
        onLocaleChange={setUiLocale}
        xp={xp}
        streakDays={streakDays}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        subscription={subscription}
        onOpenSubscription={() => handleRequestSubscribe()}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto app-container py-6 sm:py-8">
        {!selectedLanguage ? (
          /* View 1: Language Selection (3 Free, 17 Subscription) */
          <LanguageSelector
            languages={LANGUAGES}
            onSelectLanguage={handleSelectLanguage}
            uiLocale={uiLocale}
            masteredWordsCount={masteredIds.length}
            subscription={subscription}
            onRequestSubscribe={handleRequestSubscribe}
          />
        ) : !isCurrentLangUnlocked ? (
          /* Guard fallback if user navigates to locked language without VIP */
          <div className="bg-white dark:bg-[#0b0f19] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <span className="text-4xl">{selectedLanguage.flag}</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {selectedLanguage.name} — VIP Obuna Talab Qilinadi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                🇺🇿 O&apos;zbek, 🇷🇺 Rus va 🇬🇧 Ingliz tillari butunlay bepul. Ushbu tilni o&apos;rganish uchun $10 dan $20 gacha bo&apos;lgan obunani faollashtiring.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => handleRequestSubscribe(selectedLanguage)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-slate-900 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Obunani Faollashtirish ($10-$20)</span>
              </button>
              <button
                onClick={() => setSelectedLanguage(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                Tekin tillarga qaytish
              </button>
            </div>
          </div>
        ) : (
          /* View 2: Active Language Learning Section (1000+ words) */
          <div className="space-y-6">
            {/* Language Sub-Header Banner (Blue & Red themed) */}
            <div className="bg-white dark:bg-[#0b0f19] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-4xl sm:text-5xl drop-shadow-xs select-none">
                  {selectedLanguage.flag}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {selectedLanguage.name} ({selectedLanguage.localName})
                    </h2>
                    {isLanguageFree(selectedLanguage.id) ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                        Tekin
                      </span>
                    ) : (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-500" />
                        <span>VIP Ochilgan</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">
                    <span className="text-blue-600 dark:text-blue-400 font-mono">
                      {selectedLanguage.speechCode}
                    </span>
                    <span className="mx-1.5">·</span>
                    <span className="text-red-600 dark:text-red-400 font-bold">
                      {currentWords.length} ta o&apos;quv so&apos;zi
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('practice')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold rounded-xl text-xs shadow-md transition-all hover:scale-[1.02]"
                >
                  <Mic className="w-4 h-4" />
                  <span>Ovozli mashqni boshlash</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs (Zero-Pill, functional button segmented controls) */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-[#0b0f19] border border-transparent dark:border-slate-800 rounded-xl overflow-x-auto scrollbar-none transition-colors">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`tab-pill-btn flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-transparent dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'words' && (
                <VocabularyDeck
                  language={selectedLanguage}
                  words={currentWords}
                  uiLocale={uiLocale}
                  masteredIds={masteredIds}
                  onToggleMastered={handleToggleMastered}
                  onOpenPractice={handleOpenPracticeForWord}
                  soundEnabled={soundEnabled}
                />
              )}

              {activeTab === 'practice' && (
                <PronunciationStudio
                  key={currentPracticeWord.id}
                  language={selectedLanguage}
                  words={currentWords}
                  activeWord={currentPracticeWord}
                  onSelectWord={setActivePracticeWord}
                  uiLocale={uiLocale}
                  soundEnabled={soundEnabled}
                  onRewardXP={handleRewardXP}
                />
              )}

              {activeTab === 'alphabet' && (
                <AlphabetView
                  language={selectedLanguage}
                  letters={currentAlphabet}
                  uiLocale={uiLocale}
                  soundEnabled={soundEnabled}
                />
              )}

              {activeTab === 'grammar' && (
                <GrammarGuide
                  language={selectedLanguage}
                  lessons={currentGrammar}
                  uiLocale={uiLocale}
                  soundEnabled={soundEnabled}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizArena
                  language={selectedLanguage}
                  questions={currentQuiz}
                  uiLocale={uiLocale}
                  soundEnabled={soundEnabled}
                  onRewardXP={handleRewardXP}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        targetLanguage={subscriptionTargetLang}
        subscription={subscription}
        onActivatePlan={handleActivatePlan}
        onUnlockSingleLanguage={handleUnlockSingleLanguage}
        onResetSubscription={handleResetSubscription}
        uiLocale={uiLocale}
        soundEnabled={soundEnabled}
      />

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-bold text-slate-700 dark:text-slate-300">
            © {new Date().getFullYear()} <span className="text-blue-600 dark:text-blue-400">Lingo</span>
            <span className="text-red-600 dark:text-red-500">Sphere</span> · Ko&apos;p Tilli Til O&apos;rganish Platformasi
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">3 ta Tekin Til (UZ, RU, EN)</span>
            <span>·</span>
            <span className="text-red-600 dark:text-red-400 font-bold">17 ta VIP Obunali Til ($10-$20)</span>
            <span>·</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">1,000+ So&apos;z (har bir tilda)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
