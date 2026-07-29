"use client";

import { useState } from "react";
import { ArrowUpRight, Crosshair, Layers3, Lightbulb, Orbit } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ResearchSignal {
  title: string;
  body: string;
}

interface ResearchExperienceProps {
  eyebrow: string;
  title: string;
  description: string;
  signals: ResearchSignal[];
  notice: string;
}

interface ResearchJourneyProps {
  steps: ResearchSignal[];
}

const signalIcons = [Crosshair, Layers3, Lightbulb];

/**
 * This is intentionally a method canvas, not a simulated product result.
 * It gives visitors a tangible interaction before the real reverse-ASIN
 * result route is migrated, without making an unsupported data claim.
 */
export function ResearchExperience({ eyebrow, title, description, signals, notice }: ResearchExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSignal = signals[activeIndex] ?? signals[0];

  if (!activeSignal) return null;

  return (
    <section data-testid="research-workbench" aria-label="关键词研究工作台" className="relative overflow-hidden rounded-[2rem] border border-brand-ink/10 bg-[#20150d] p-3 shadow-[0_28px_80px_-36px_rgba(35,21,10,.6)] sm:p-5">
      <div aria-hidden="true" className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-44 w-44 rounded-full border-[22px] border-primary/15" />

      <div className="relative rounded-[1.5rem] border border-white/10 bg-[#2a1b11]/95 p-5 text-white sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">{eyebrow}</p>
            <h2 className="mt-2 max-w-md text-xl font-semibold tracking-[-.025em] sm:text-2xl">{title}</h2>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <span aria-hidden="true" className="h-1.5 w-1.5 animate-[signal-breathe_2.4s_ease-in-out_infinite] rounded-full bg-primary" />
            交互预览
          </span>
        </div>

        <p className="mt-3 max-w-xl text-sm leading-6 text-white/62">{description}</p>

        <div className="relative mt-5 min-h-[21rem] overflow-hidden rounded-2xl border border-white/10 bg-[#160e09] sm:min-h-[23rem]">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 520 380" preserveAspectRatio="none">
            <defs>
              <linearGradient id="signalLine" x1="0" x2="1">
                <stop offset="0%" stopColor="#ff9200" stopOpacity=".15" />
                <stop offset="50%" stopColor="#ff9200" stopOpacity=".85" />
                <stop offset="100%" stopColor="#ff9200" stopOpacity=".15" />
              </linearGradient>
            </defs>
            <path className="animate-[signal-dash_7s_linear_infinite]" d="M80 88 C166 70, 224 150, 260 185 S386 280, 452 255" fill="none" stroke="url(#signalLine)" strokeDasharray="6 10" strokeWidth="1.5" />
            <path className="animate-[signal-dash_9s_linear_infinite_reverse]" d="M72 300 C164 274, 207 226, 260 185 S392 92, 454 122" fill="none" stroke="url(#signalLine)" strokeDasharray="5 12" strokeWidth="1.5" />
            <circle cx="260" cy="185" r="83" fill="none" stroke="#ff9200" strokeOpacity=".12" strokeWidth="1" />
            <circle className="animate-[signal-breathe_2.4s_ease-in-out_infinite]" cx="260" cy="185" r="60" fill="#ff9200" fillOpacity=".045" />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center px-10 text-center">
            <div className="w-full max-w-[12.5rem] rounded-2xl border border-primary/25 bg-[#2c1b0f]/95 px-4 py-5 shadow-[0_15px_30px_-18px_rgba(0,0,0,.8)]">
              <Orbit aria-hidden="true" className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-3 text-xs font-medium uppercase tracking-[.18em] text-white/45">Research map</p>
              <p data-testid="research-signal-detail" aria-live="polite" className="mt-2 text-lg font-semibold text-white">{activeSignal.title}</p>
              <p className="mt-2 text-xs leading-5 text-white/58">{activeSignal.body}</p>
            </div>
          </div>

          {signals.map((signal, index) => {
            const Icon = signalIcons[index] ?? Crosshair;
            const position = [
              "left-3 top-5 sm:left-6 sm:top-7",
              "right-3 top-12 sm:right-6 sm:top-14",
              "bottom-5 left-1/2 -translate-x-1/2",
            ][index] ?? "left-3 top-5";
            const active = index === activeIndex;

            return (
              <button
                key={signal.title}
                type="button"
                data-testid={`research-signal-${index}`}
                aria-pressed={active}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "absolute z-10 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#160e09]",
                  position,
                  active
                    ? "border-primary/50 bg-primary text-primary-foreground shadow-[0_10px_25px_-13px_rgba(255,146,0,.9)]"
                    : "border-white/10 bg-white/[.06] text-white/75 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white/[.1]",
                )}
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="font-medium">{signal.title}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/[.06] px-3 py-2.5 text-xs leading-5 text-white/60">
          <ArrowUpRight aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p>{notice}</p>
        </div>
      </div>
    </section>
  );
}

/** A selectable research path replaces another static row of three cards. */
export function ResearchJourney({ steps }: ResearchJourneyProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = steps[activeIndex] ?? steps[0];

  if (!activeStep) return null;

  return (
    <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr] lg:items-stretch">
      <ol aria-label="研究步骤" className="space-y-2">
        {steps.map((step, index) => {
          const active = index === activeIndex;
          return (
            <li key={step.title}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={active}
                className={cn(
                  "group flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active ? "border-primary/45 bg-primary text-primary-foreground" : "border-white/10 bg-white/[.035] text-white/72 hover:border-white/25 hover:bg-white/[.08]",
                )}
              >
                <span className={cn("font-mono text-xs font-semibold", active ? "text-brand-ink" : "text-primary")}>0{index + 1}</span>
                <span className="text-sm font-semibold">{step.title}</span>
                <ArrowUpRight aria-hidden="true" className={cn("ml-auto h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5", active ? "text-brand-ink" : "text-white/38")} />
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.045] p-6 sm:p-8">
        <div aria-hidden="true" className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-[20px] border-primary/15" />
        <p className="relative font-mono text-xs font-semibold tracking-[.18em] text-primary">STEP 0{activeIndex + 1} / 03</p>
        <h3 className="relative mt-8 max-w-md text-2xl font-semibold tracking-[-.025em] text-white sm:text-3xl">{activeStep.title}</h3>
        <p aria-live="polite" className="relative mt-4 max-w-lg text-base leading-7 text-white/65">{activeStep.body}</p>
        <div className="relative mt-10 flex items-center gap-2 text-xs text-white/40">
          {steps.map((step, index) => (
            <span key={step.title} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-500", index <= activeIndex ? "bg-primary" : "bg-white/10")} />
          ))}
        </div>
      </div>
    </div>
  );
}
