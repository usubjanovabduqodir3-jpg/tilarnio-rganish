'use client';

import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Mic,
  BookOpen,
  CheckCircle2,
  Lock,
  Crown,
  Zap,
} from 'lucide-react';
import { Language, UILocale, UserSubscription, isLanguageFree } from '@/lib/types';
import { UI_TRANSLATIONS } from '@/data/languagesData';

interface LanguageSelectorProps {
  languages: Language[];
  onSelectLanguage: (language: Language) => void;
  uiLocale: UILocale;
  masteredWordsCount: number;
  subscription: UserSubscription;
  onRequestSubscribe: (language?: Language) => void;
}

export function LanguageSelector({
  languages,
  onSelectLanguage,
  uiLocale,
  masteredWordsCount,
  subscription,
  onRequestSubscribe,
}: LanguageSelectorProps) {
  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;

  return (
    <div className="space-y-8 py-6 sm:py-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 px-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-200/80 dark:border-blue-800/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{languages.length} ta jahon tili · Har birida 1,000+ so&apos;z va Web Speech API</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance text-slate-900 dark:text-white">
          {uiLocale === 'uz' ? (
            <>
              Dunyoni yangi tillarda kashf eting:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-red-600 to-blue-500">
                LingoSphere
              </span>
            </>
          ) : uiLocale === 'ru' ? (
            <>
              Откройте мир на новых языках:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-red-600 to-blue-500">
                LingoSphere
              </span>
            </>
          ) : (
            <>
              Explore the World in New Languages:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-red-600 to-blue-500">
                LingoSphere
              </span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed text-balance max-w-2xl mx-auto">
          {t.selectLanguageDesc}
        </p>

        {/* Quick Highlights Strip */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Mic className="w-4 h-4 text-red-500 shrink-0" />
            <span>Ovozli tekshirish (Speech Recognition)</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
            <span>1,000+ so&apos;zlik lug&apos;at va alifbo</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{masteredWordsCount} ta o&apos;zlashtirilgan so&apos;z</span>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Banner */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-slate-900 to-red-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-red-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base">
                  3 TA TIL 100% TEKIN · QOLGAN TILLAR OBUNALI ($10 - $20)
                </span>
                <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Bepul
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                🇺🇿 <strong>O&apos;zbek</strong>, 🇷🇺 <strong>Rus</strong> va 🇬🇧 <strong>Ingliz</strong> tillari hamma uchun mutlaqo tekin! Boshqa 17 ta til uchun arzon VIP obuna ($10-$20).
              </p>
            </div>
          </div>

          <button
            onClick={() => onRequestSubscribe()}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-black text-xs transition-all shadow-md hover:scale-105 shrink-0 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-red-600" />
            <span>{subscription.isVip ? 'VIP Obunani Boshqarish' : 'VIP Obunani Faollashtirish'}</span>
          </button>
        </div>
      </div>

      {/* Language Grid (20 Languages: 3 Free, 17 Subscription) */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 grid-language-cards">
          {languages.map((lang) => {
            const isFree = lang.isFree || isLanguageFree(lang.id);
            const isUnlocked =
              isFree ||
              subscription.isVip ||
              subscription.unlockedLanguageIds.includes(lang.id);

            return (
              <div
                key={lang.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLanguage(lang);
                  } else {
                    onRequestSubscribe(lang);
                  }
                }}
                className={`group relative rounded-2xl border p-5 shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-500/50'
                    : 'bg-slate-50/80 dark:bg-[#0b0f19]/80 border-slate-200/70 dark:border-slate-800/70 hover:border-red-500/50 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Header: Flag, Status Badge & Difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl leading-none select-none drop-shadow-xs group-hover:scale-110 transition-transform">
                        {lang.flag}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                          <span>{lang.name}</span>
                          {!isUnlocked && (
                            <Lock className="w-3.5 h-3.5 text-red-500 inline-block shrink-0" />
                          )}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {lang.localName}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                      {lang.difficulty}
                    </span>
                  </div>

                  {/* Free or Subscription Status Badge */}
                  <div className="mb-3">
                    {isFree ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>Tekin (Bepul)</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                        <Crown className="w-3 h-3 text-amber-500" />
                        <span>VIP Ochilgan</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60">
                        <Lock className="w-3 h-3 text-red-500" />
                        <span>Obuna ($10 - $20)</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {lang.description}
                  </p>
                </div>

                {/* Footer info: 1,000+ words badge & CTA */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                    1,000+ so&apos;z
                  </span>

                  {isUnlocked ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all text-xs"
                    >
                      <span>{t.startLearning}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400 group-hover:underline transition-all text-xs"
                    >
                      <span>Ochish ($10-$20)</span>
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
