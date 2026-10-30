'use client';

import React, { useState } from 'react';
import {
  X,
  Crown,
  CheckCircle2,
  Lock,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Zap,
  Globe2,
  RefreshCw,
} from 'lucide-react';
import { Language, SubscriptionPlan, UILocale, UserSubscription } from '@/lib/types';
import { SUBSCRIPTION_PLANS, UI_TRANSLATIONS } from '@/data/languagesData';
import { playSound } from '@/lib/speech';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLanguage: Language | null;
  subscription: UserSubscription;
  onActivatePlan: (plan: SubscriptionPlan) => void;
  onUnlockSingleLanguage: (lang: Language) => void;
  onResetSubscription?: () => void;
  uiLocale: UILocale;
  soundEnabled: boolean;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  targetLanguage,
  subscription,
  onActivatePlan,
  onUnlockSingleLanguage,
  onResetSubscription,
  uiLocale,
  soundEnabled,
}: SubscriptionModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<'starter' | 'pro' | 'unlimited'>('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;
  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  const handleSubscribe = () => {
    playSound('reward', soundEnabled);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onActivatePlan(selectedPlan);
      setSuccessMessage(
        uiLocale === 'uz'
          ? `Tabriklaymiz! "${selectedPlan.name}" obunasi muvaffaqiyatli faollashtirildi! Barcha 20 ta til ochildi.`
          : uiLocale === 'ru'
          ? `Поздравляем! Подписка "${selectedPlan.name}" успешно активирована! Все 20 языков разблокированы.`
          : `Congratulations! "${selectedPlan.name}" activated! All 20 languages are now unlocked.`
      );
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    }, 600);
  };

  const handleSingleUnlock = () => {
    if (!targetLanguage) return;
    playSound('reward', soundEnabled);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onUnlockSingleLanguage(targetLanguage);
      setSuccessMessage(
        uiLocale === 'uz'
          ? `Tabriklaymiz! ${targetLanguage.name} muvaffaqiyatli ochildi!`
          : uiLocale === 'ru'
          ? `Поздравляем! Язык "${targetLanguage.name}" успешно разблокирован!`
          : `Congratulations! ${targetLanguage.name} is now unlocked!`
      );
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1400);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner with Blue-Red-Black gradient */}
        <div className="relative bg-gradient-to-r from-blue-700 via-slate-900 to-red-600 p-6 sm:p-7 text-white overflow-hidden">
          {/* Background decorative shapes */}
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>VIP Premium Obuna</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
            {targetLanguage ? (
              <>
                <span className="mr-2 text-2xl">{targetLanguage.flag}</span>
                {targetLanguage.name} — O&apos;rganishni Boshlang!
              </>
            ) : (
              'LingoSphere Jahon Tillari VIP Obunasi'
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
            {uiLocale === 'uz' ? (
              <>
                🇺🇿 <strong className="text-white">O&apos;zbek</strong>, 🇷🇺 <strong className="text-white">Rus</strong> va 🇬🇧 <strong className="text-white">Ingliz</strong> tillari — <strong>butunlay bepul (tekin)</strong>!
                Qolgan 17 ta jahon tilini to&apos;liq o&apos;rganish uchun $10 dan $20 gacha bo&apos;lgan qulay VIP tarifni tanlang.
              </>
            ) : (
              t.subscriptionDesc
            )}
          </p>

          {/* Free languages indicator pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>O&apos;zbek tili (Tekin)</span>
            </span>
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Rus tili (Tekin)</span>
            </span>
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ingliz tili (Tekin)</span>
            </span>
          </div>
        </div>

        {/* Success Alert Banner if activated */}
        {successMessage && (
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Plans Grid (All between $10 and $20) */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>OBUNA REJASINI TANLANG:</span>
            <span className="text-red-600 dark:text-red-400 font-extrabold">$10 — $20 oralig&apos;ida</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    playSound('click', soundEnabled);
                  }}
                  className={`relative rounded-2xl p-4 cursor-pointer transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-500/30'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {plan.badge && (
                    <span
                      className={`absolute -top-2.5 right-3 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        plan.popular
                          ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}

                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {plan.displayPrice}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        / {plan.period}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    {plan.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-slate-900 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-black text-sm shadow-lg shadow-red-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Faollashtirilmoqda...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>
                    {selectedPlan.name} obunasini olish ({selectedPlan.displayPrice})
                  </span>
                </>
              )}
            </button>

            {/* Individual single language unlock option ($12) */}
            {targetLanguage && (
              <button
                onClick={handleSingleUnlock}
                disabled={isProcessing}
                className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                title={`Faqat ${targetLanguage.name} tilini bir umrga ochish`}
              >
                <span>Faqat {targetLanguage.name} ($12)</span>
              </button>
            )}
          </div>

          {/* Security & Free Guarantee Notice */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Xavfsiz to&apos;lov simulyatsiyasi · Istalgan vaqtda bekor qilish</span>
            </div>

            {subscription.isVip && onResetSubscription && (
              <button
                onClick={() => {
                  onResetSubscription();
                  playSound('click', soundEnabled);
                  onClose();
                }}
                className="text-red-500 hover:text-red-600 font-bold underline"
              >
                Obunani bekor qilish (Tekin rejimga qaytish)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
