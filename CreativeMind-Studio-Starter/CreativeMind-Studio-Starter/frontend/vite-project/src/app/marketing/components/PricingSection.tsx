/**
 * PricingSection — Section 12: Three premium pricing tiers
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, ArrowRight, Building2 } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For solo creators',
    priceMonthly: 29,
    priceAnnual: 19,
    color: '#6366F1',
    highlighted: false,
    features: [
      '3 active projects',
      '2 AI agents per project',
      'Research Lab (10 sources)',
      'Basic editor workspace',
      'Single platform distribution',
      '5GB asset storage',
      'Community support',
    ],
    cta: 'Start Free Trial',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For growing teams',
    priceMonthly: 89,
    priceAnnual: 59,
    color: '#7C3AED',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Unlimited projects',
      'All 6 AI agents',
      'Strategy Room (full)',
      'Virality Twin analysis',
      'Advanced editor + captions',
      'Multi-platform distribution',
      'Rights & brand safety',
      '100GB asset storage',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For large organizations',
    priceMonthly: null,
    priceAnnual: null,
    color: '#EC4899',
    highlighted: false,
    features: [
      'Everything in Pro',
      'Custom AI agent training',
      'White-label workspace',
      'SSO & SAML auth',
      'Advanced compliance tools',
      'Dedicated infrastructure',
      'Custom contract & SLA',
      'Unlimited storage',
      'Dedicated success manager',
    ],
    cta: 'Talk to Sales',
  },
];

export const PricingSection: React.FC = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#7C3AED]/07 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.35, ease }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <span className="inline-block mb-4 text-[11px] font-mono font-semibold tracking-widest uppercase text-[#9D6CFF]">
            Pricing
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            Simple, transparent pricing.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Start free. Scale when you're ready. No hidden fees, no per-seat gotchas for core features.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-6 p-1 rounded-xl bg-[#10101A] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                !annual ? 'bg-white/[0.08] text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                annual ? 'bg-white/[0.08] text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Annual
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/25 text-[#10B981]">
                Save 34%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08, ease }}
              whileHover={{ y: -4 }}
              className={`relative flex flex-col rounded-2xl border overflow-hidden ${
                plan.highlighted
                  ? 'border-[#7C3AED]/50 bg-gradient-to-b from-[#7C3AED]/10 to-[#10101A]/80 shadow-[0_8px_48px_rgba(124,58,237,0.25)]'
                  : 'border-white/[0.08] bg-[#10101A]/80'
              } backdrop-blur-xl`}
            >
              {/* Highlighted glow line */}
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent" />
              )}

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#9D6CFF]">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-7 flex flex-col flex-1">
                {/* Plan header */}
                <div className="mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border mb-4"
                    style={{ backgroundColor: `${plan.color}15`, borderColor: `${plan.color}30` }}
                  >
                    {plan.id === 'starter' ? (
                      <Zap className="w-5 h-5" style={{ color: plan.color }} />
                    ) : plan.id === 'pro' ? (
                      <Zap className="w-5 h-5" style={{ color: plan.color }} />
                    ) : (
                      <Building2 className="w-5 h-5" style={{ color: plan.color }} />
                    )}
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-1">{plan.name}</h3>
                  <p className="text-[13px] text-slate-500">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="mb-7">
                  {plan.priceMonthly !== null ? (
                    <div className="flex items-end gap-2">
                      <span className="font-display font-bold text-4xl text-white">
                        ${annual ? plan.priceAnnual : plan.priceMonthly}
                      </span>
                      <span className="text-slate-500 text-[14px] mb-1 font-sans">/month</span>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2">
                      <span className="font-display font-bold text-3xl text-white">Custom</span>
                    </div>
                  )}
                  {plan.priceMonthly !== null && annual && (
                    <p className="text-[11px] text-slate-600 font-mono mt-1">
                      Billed ${(annual ? plan.priceAnnual! : plan.priceMonthly!) * 12}/year
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div
                        className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${plan.color}15` }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: plan.color }} />
                      </div>
                      <span className="text-[13px] text-slate-300 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)]'
                      : 'bg-white/[0.06] border border-white/[0.1] text-white hover:bg-white/[0.1] hover:border-white/[0.15]'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3, ease }}
          className="text-center text-slate-600 text-[12px] font-mono mt-10"
        >
          All plans include a 14-day free trial · No credit card required · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
};
