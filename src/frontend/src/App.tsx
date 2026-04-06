import { Toaster } from "@/components/ui/sonner";
import {
  Heart,
  Instagram,
  Linkedin,
  TrendingUp,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

// Launch target: April 9, 2026 00:00:00 UTC
const LAUNCH_DATE = new Date("2026-04-09T00:00:00Z");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = LAUNCH_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function TimerCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="timer-card timer-glow flex flex-col items-center justify-center w-[90px] sm:w-[130px] md:w-[155px] h-[90px] sm:h-[115px] md:h-[135px] rounded-xl">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-[36px] sm:text-[50px] md:text-[58px] font-black text-white leading-none tracking-tight"
      >
        {pad(value)}
      </motion.span>
      <span
        className="text-[9px] sm:text-[11px] uppercase tracking-widest mt-1 font-medium"
        style={{ color: "#7F8898" }}
      >
        {label}
      </span>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-sm font-medium transition-colors duration-200 hover:text-white"
      style={{ color: "#B7BDC9" }}
      data-ocid="nav.link"
    >
      {children}
    </a>
  );
}

export default function App() {
  const { actor } = useActor();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const emailFormRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  // Live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToEmailForm = useCallback(() => {
    emailFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  const validateEmail = (val: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    if (!actor) {
      toast.error("Connection not ready. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      await actor.addSubscriber(email);
      setSubmitted(true);
      setEmail("");
      toast.success("You're on the list! We'll notify you at launch.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Launch", href: "#launch" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ];

  const valueProps = [
    {
      icon: <Zap size={22} style={{ color: "#19D9FF" }} />,
      title: "Speed",
      desc: "Launch your startup 10x faster with AI-powered tools and streamlined workflows.",
    },
    {
      icon: <TrendingUp size={22} style={{ color: "#3B82F6" }} />,
      title: "Impact",
      desc: "Reach the right audience from day one with data-driven growth strategies.",
    },
    {
      icon: <Users size={22} style={{ color: "#8B5CF6" }} />,
      title: "Community",
      desc: "Join a network of founders and operators who share tools, insights, and wins.",
    },
  ];

  const iconBg = [
    { bg: "rgba(25, 217, 255, 0.1)", border: "rgba(25, 217, 255, 0.2)" },
    { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.2)" },
    { bg: "rgba(139, 92, 246, 0.1)", border: "rgba(139, 92, 246, 0.2)" },
  ];

  return (
    <div className="min-h-screen hero-bg dots-bg font-inter relative overflow-x-hidden">
      <Toaster richColors position="top-right" />

      {/* Floating geometric shapes */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-20 left-[8%] w-48 h-48 rounded-full opacity-[0.06] animate-float"
          style={{
            background: "radial-gradient(circle, #19D9FF 0%, transparent 70%)",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute top-40 right-[10%] w-64 h-64 rounded-full opacity-[0.05] animate-float"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute bottom-32 left-[20%] w-40 h-40 rounded-full opacity-[0.04] animate-float"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
            animationDelay: "4s",
          }}
        />
        <svg
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="720" cy="-100" r="500" stroke="#19D9FF" strokeWidth="1" />
          <circle
            cx="720"
            cy="-100"
            r="700"
            stroke="#3B82F6"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* ── NAVBAR ── */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(11, 15, 20, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(32, 40, 56, 0.6)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0"
            data-ocid="nav.link"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-lg select-none"
              style={{
                background:
                  "linear-gradient(135deg, #19D9FF 0%, #3B82F6 50%, #8B5CF6 100%)",
                boxShadow: "0 0 16px rgba(25, 217, 255, 0.4)",
              }}
            >
              T
            </div>
            <span className="text-foreground font-bold text-lg tracking-tight">
              TapStartup
            </span>
          </a>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Notify Me CTA */}
          <button
            type="button"
            onClick={scrollToEmailForm}
            className="text-sm font-semibold text-white rounded-full px-5 py-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.03] active:scale-[0.98] flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #19D9FF 0%, #3B82F6 50%, #8B5CF6 100%)",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
            }}
            data-ocid="nav.primary_button"
          >
            Notify Me
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <main id="launch">
        <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 pt-12 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(25, 217, 255, 0.08)",
                border: "1px solid rgba(25, 217, 255, 0.25)",
                color: "#19D9FF",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                style={{ background: "#19D9FF" }}
              />
              Launch in 3 Days
            </motion.div>

            {/* Hero headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[48px] sm:text-[66px] md:text-[78px] lg:text-[86px] font-black uppercase leading-[0.95] tracking-[-0.02em] mb-6"
              style={{ color: "#F4F7FF" }}
            >
              Something <span className="gradient-text">Big</span>
              <br />
              Is Coming.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base sm:text-lg leading-relaxed max-w-xl mb-12"
              style={{ color: "#B7BDC9" }}
            >
              The future of startup growth is almost here. Get ready to launch
              faster.
            </motion.p>

            {/* ── COUNTDOWN ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-14"
              data-ocid="launch.section"
            >
              <TimerCard value={timeLeft.days} label="Days" />
              <span
                className="text-2xl sm:text-3xl font-black mb-4"
                style={{ color: "rgba(127, 136, 152, 0.5)" }}
              >
                :
              </span>
              <TimerCard value={timeLeft.hours} label="Hours" />
              <span
                className="text-2xl sm:text-3xl font-black mb-4"
                style={{ color: "rgba(127, 136, 152, 0.5)" }}
              >
                :
              </span>
              <TimerCard value={timeLeft.minutes} label="Minutes" />
              <span
                className="text-2xl sm:text-3xl font-black mb-4"
                style={{ color: "rgba(127, 136, 152, 0.5)" }}
              >
                :
              </span>
              <TimerCard value={timeLeft.seconds} label="Seconds" />
            </motion.div>

            {/* ── EMAIL FORM ── */}
            <motion.div
              ref={emailFormRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="w-full max-w-lg"
              data-ocid="email.section"
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-2xl py-6 px-8 text-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(25,217,255,0.08) 0%, rgba(59,130,246,0.08) 100%)",
                      border: "1px solid rgba(25, 217, 255, 0.25)",
                    }}
                    data-ocid="email.success_state"
                  >
                    <p
                      className="text-lg font-bold mb-1"
                      style={{ color: "#19D9FF" }}
                    >
                      🎉 You&apos;re on the list!
                    </p>
                    <p className="text-sm" style={{ color: "#B7BDC9" }}>
                      We&apos;ll send you an exclusive invite when TapStartup
                      launches.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError("");
                          }}
                          placeholder="Enter your email address"
                          className="w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-all duration-200"
                          style={{
                            background: "rgba(14, 19, 26, 0.9)",
                            border: emailError
                              ? "1px solid rgba(239, 68, 68, 0.6)"
                              : "1px solid rgba(32, 40, 56, 0.8)",
                            color: "#F4F7FF",
                          }}
                          onFocus={(e) => {
                            if (!emailError) {
                              e.target.style.border =
                                "1px solid rgba(25, 217, 255, 0.4)";
                            }
                          }}
                          onBlur={(e) => {
                            if (!emailError) {
                              e.target.style.border =
                                "1px solid rgba(32, 40, 56, 0.8)";
                            }
                          }}
                          data-ocid="email.input"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                        style={{
                          background:
                            "linear-gradient(135deg, #19D9FF 0%, #3B82F6 50%, #8B5CF6 100%)",
                          boxShadow: "0 0 24px rgba(59, 130, 246, 0.35)",
                        }}
                        data-ocid="email.submit_button"
                      >
                        {isSubmitting ? "Joining..." : "GET EARLY ACCESS"}
                      </button>
                    </div>

                    {emailError && (
                      <p
                        className="mt-2 text-xs"
                        style={{ color: "#f87171" }}
                        data-ocid="email.error_state"
                      >
                        {emailError}
                      </p>
                    )}

                    <p className="mt-3 text-xs" style={{ color: "#7F8898" }}>
                      Join{" "}
                      <span style={{ color: "#B7BDC9" }}>
                        2,400+ early adopters
                      </span>{" "}
                      already waiting. No spam, ever. Unsubscribe anytime.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </section>

        {/* ── VALUE PROPS ── */}
        <section
          id="features"
          className="relative py-20 px-4 sm:px-6"
          style={{ borderTop: "1px solid rgba(32, 40, 56, 0.6)" }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase tracking-widest font-semibold mb-10"
              style={{ color: "#7F8898" }}
            >
              Why TapStartup?
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {valueProps.map((vp, i) => (
                <motion.div
                  key={vp.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-xl p-6 flex flex-col gap-4"
                  style={{
                    background: "rgba(14, 19, 26, 0.7)",
                    border: "1px solid rgba(32, 40, 56, 0.8)",
                  }}
                  data-ocid={`features.item.${i + 1}`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: iconBg[i].bg,
                      border: `1px solid ${iconBg[i].border}`,
                    }}
                  >
                    {vp.icon}
                  </div>
                  <div>
                    <h3
                      className="text-base font-bold mb-1.5"
                      style={{ color: "#F4F7FF" }}
                    >
                      {vp.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#B7BDC9" }}
                    >
                      {vp.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="px-4 sm:px-6 py-10"
        style={{
          borderTop: "1px solid rgba(32, 40, 56, 0.6)",
          background: "rgba(11, 15, 20, 0.8)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            {/* Footer logo */}
            <a
              href="/"
              className="flex items-center gap-2"
              data-ocid="nav.link"
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center font-black text-white text-sm select-none"
                style={{
                  background:
                    "linear-gradient(135deg, #19D9FF 0%, #3B82F6 50%, #8B5CF6 100%)",
                }}
              >
                T
              </div>
              <span className="font-bold text-sm" style={{ color: "#B7BDC9" }}>
                TapStartup
              </span>
            </a>

            {/* Footer nav */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs transition-colors duration-200 hover:text-muted-foreground"
                  style={{ color: "#7F8898" }}
                  data-ocid="nav.link"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, label: "Twitter/X" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Instagram, label: "Instagram" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="/"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    color: "#19D9FF",
                    background: "rgba(25, 217, 255, 0.08)",
                    border: "1px solid rgba(25, 217, 255, 0.15)",
                  }}
                  data-ocid="nav.link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-6"
            style={{ background: "rgba(32, 40, 56, 0.6)" }}
          />

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs" style={{ color: "#7F8898" }}>
              &copy; {currentYear} TapStartup. All rights reserved.
            </p>
            <p
              className="text-xs flex items-center gap-1"
              style={{ color: "#7F8898" }}
            >
              Built with{" "}
              <Heart
                size={11}
                className="fill-current"
                style={{ color: "#8B5CF6" }}
              />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:underline"
                style={{ color: "#B7BDC9" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
