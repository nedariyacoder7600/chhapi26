"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  getUsers, 
  setCurrentUser, 
  getCurrentUser, 
  addAuditLog, 
  getFunds, 
  getDonationsHistory 
} from "./utils/db";
import { 
  ArrowRight, 
  Lock, 
  User, 
  Globe, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  TrendingUp, 
  Heart, 
  Shield, 
  Info, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Menu, 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Award, 
  DollarSign, 
  Check, 
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Volume2,
  VolumeX,
  Eye
} from "lucide-react";

// Translation dictionary for Multi-language support (EN, HI, ES)
const translations = {
  en: {
    heroTitle: "Transparent Giving Evolved",
    heroSubtitle: "A luxury ecosystem connecting community generosity with verified, audited allocations. Track every rupee, see the direct impact, and shape the future of transparent philanthropy.",
    ctaGetStarted: "Explore Campaigns",
    ctaLogin: "Client Portal",
    ctaAnalytics: "Live Activity",
    aboutTitle: "Our Narrative",
    aboutHeading: "Redefining trust through radical transparency.",
    aboutText: "Chhapi Foundation bridges the gap between community intent and verified execution. We believe that donation is not just about charity; it's about visible, audited change. Our platform enables donors to see exactly where their funds go, when they were spent, and what was achieved.",
    statsRaised: "Funds Raised",
    statsTransparency: "Transparency Index",
    statsVolunteers: "Active Donors",
    statsCampaigns: "Active Drives",
    campaignsTitle: "Active Campaigns",
    campaignsHeading: "Where your contributions create waves of change.",
    beforeAfterTitle: "Visible Impact Comparison",
    beforeAfterHeading: "Interactive slider of completed projects.",
    testimonialsTitle: "Testimonials",
    testimonialsHeading: "Voices from our community.",
    teamTitle: "Creative Minds",
    teamHeading: "The visionaries behind Chhapi Foundation.",
    pricingTitle: "Sponsorship Tiers",
    pricingHeading: "Choose how you want to shape tomorrow.",
    processTitle: "Our Operational Loop",
    processHeading: "How your contributions flow transparently.",
    faqTitle: "Common Questions",
    faqHeading: "Everything you need to know.",
    contactTitle: "Get in Touch",
    contactHeading: "Let's co-create a transparent future.",
    footerText: "Chhapi Foundation. Redefining modern giving with ultimate transparency and cinematic design.",
    languageLabel: "Language",
    analyticsLabel: "Site Analytics",
    appointmentLabel: "Book Consultation",
    stripeLabel: "Direct Payment",
    successMsg: "Action completed successfully!",
    errorMsg: "Please check your inputs."
  },
  hi: {
    heroTitle: "पारदर्शी दान प्रणाली का नया रूप",
    heroSubtitle: "एक प्रीमियम पारिस्थितिकी तंत्र जो सामुदायिक दान को सत्यापित और अंकेक्षित आवंटन से जोड़ता है। हर एक रुपये को ट्रैक करें, सीधा प्रभाव देखें और पारदर्शी परोपकार के भविष्य को आकार दें।",
    ctaGetStarted: "अभियान देखें",
    ctaLogin: "क्लाइंट पोर्टल",
    ctaAnalytics: "लाइव आँकड़े",
    aboutTitle: "हमारी कहानी",
    aboutHeading: "कठिन पारदर्शिता के माध्यम से विश्वास की पुनर्परिभाषा।",
    aboutText: "छापी फाउंडेशन सामुदायिक इच्छाशक्ति और सत्यापित निष्पादन के बीच की दूरी को पाटता है। हम मानते हैं कि दान सिर्फ दान नहीं है; यह एक दृश्यमान, ऑडिट किए गए बदलाव के बारे में है। हमारा मंच दाताओं को यह देखने में सक्षम बनाता है कि उनके धन का उपयोग कहां और कब किया गया।",
    statsRaised: "कुल प्राप्त राशि",
    statsTransparency: "पारदर्शिता सूचकांक",
    statsVolunteers: "सक्रिय दाता",
    statsCampaigns: "सक्रिय अभियान",
    campaignsTitle: "सक्रिय अभियान",
    campaignsHeading: "जहां आपका योगदान बदलाव की लहरें पैदा करता है।",
    beforeAfterTitle: "सक्रिय प्रभाव की तुलना",
    beforeAfterHeading: "पूर्ण हो चुकी परियोजनाओं का स्लाइडर प्रभाव।",
    testimonialsTitle: "प्रशंसापत्र",
    testimonialsHeading: "हमारे समुदाय की आवाज।",
    teamTitle: "रचनात्मक टीम",
    teamHeading: "छापी फाउंडेशन के पीछे के स्वप्नद्रष्टा।",
    pricingTitle: "प्रायोजन योजनाएं",
    pricingHeading: "चुनें कि आप कल को कैसे आकार देना चाहते हैं।",
    processTitle: "हमारी परिचालन प्रक्रिया",
    processHeading: "आपका योगदान पारदर्शी रूप से कैसे प्रवाहित होता है।",
    faqTitle: "सामान्य प्रश्न",
    faqHeading: "वह सब कुछ जो आपके लिए जानना आवश्यक है।",
    contactTitle: "संपर्क करें",
    contactHeading: "आइए एक पारदर्शी भविष्य का सह-निर्माण करें।",
    footerText: "छापी फाउंडेशन। चरम पारदर्शिता और सिनेमाई डिजाइन के साथ आधुनिक दान को पुनर्परिभाषित करना।",
    languageLabel: "भाषा",
    analyticsLabel: "साइट आँकड़े",
    appointmentLabel: "परामर्श बुक करें",
    stripeLabel: "सीधा भुगतान",
    successMsg: "कार्रवाई सफलतापूर्वक पूरी हुई!",
    errorMsg: "कृपया अपने इनपुट की जाँच करें।"
  },
  es: {
    heroTitle: "Filantropía Transparente Evolucionada",
    heroSubtitle: "Un ecosistema de lujo que conecta la generosidad comunitaria con asignaciones verificadas y auditadas. Rastree cada rupia, vea el impacto directo y defina el futuro del dar.",
    ctaGetStarted: "Explorar Campañas",
    ctaLogin: "Portal de Clientes",
    ctaAnalytics: "Actividad en Vivo",
    aboutTitle: "Nuestra Narrativa",
    aboutHeading: "Redefiniendo la confianza mediante transparencia radical.",
    aboutText: "La Fundación Chhapi cierra la brecha entre el propósito comunitario y la ejecución verificada. Creemos que donar no es solo caridad; se trata de un cambio visible y auditado. Nuestra plataforma permite a los donantes ver exactamente a dónde va su dinero.",
    statsRaised: "Fondos Recaudados",
    statsTransparency: "Índice de Transparencia",
    statsVolunteers: "Donantes Activos",
    statsCampaigns: "Campañas Activas",
    campaignsTitle: "Campañas Activas",
    campaignsHeading: "Donde tus contribuciones crean olas de cambio.",
    beforeAfterTitle: "Comparación de Impacto Visible",
    beforeAfterHeading: "Deslizador interactivo de proyectos completados.",
    testimonialsTitle: "Testimonios",
    testimonialsHeading: "Voces de nuestra comunidad.",
    teamTitle: "Mentes Creativas",
    teamHeading: "Los visionarios detrás de la Fundación Chhapi.",
    pricingTitle: "Niveles de Patrocinio",
    pricingHeading: "Elige cómo quieres moldear el mañana.",
    processTitle: "Nuestro Ciclo Operativo",
    processHeading: "Cómo fluyen sus contribuciones de forma transparente.",
    faqTitle: "Preguntas Frecuentes",
    faqHeading: "Todo lo que necesitas saber.",
    contactTitle: "Contacto",
    contactHeading: "Co-creemos un futuro transparente.",
    footerText: "Fundación Chhapi. Redefiniendo el dar moderno con la máxima transparencia y un diseño cinematográfico.",
    languageLabel: "Idioma",
    analyticsLabel: "Analítica del Sitio",
    appointmentLabel: "Reservar Cita",
    stripeLabel: "Pago Directo",
    successMsg: "Acción completada con éxito!",
    errorMsg: "Por favor revise sus datos de entrada."
  }
};

// Animated Stats Counter component
function Counter({ value, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = parseInt(value.replace(/[^0-9]/g, ""), 10);
          if (isNaN(end)) {
            setCount(value);
            return;
          }
          const totalFrames = 60;
          const frameDuration = duration / totalFrames;
          let frame = 0;

          const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const current = Math.round(end * progress);
            setCount(current);

            if (frame === totalFrames) {
              clearInterval(counter);
              setCount(end);
            }
          }, frameDuration);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  const formatNumber = (num) => {
    if (typeof num === "string") return num;
    if (num >= 100000) return "₹" + (num / 1000).toLocaleString("en-IN") + "K";
    return num.toLocaleString("en-IN");
  };

  return (
    <span ref={elementRef} className="font-extrabold tracking-tight">
      {typeof count === "number" ? formatNumber(count) : count}
      {suffix}
    </span>
  );
}

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef(null);
  
  // Theme & Language State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  // Core website loader status
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadText, setLoadText] = useState("Initializing Core Engine...");

  // Modal display toggles
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAnalyticsDrawer, setShowAnalyticsDrawer] = useState(false);
  const [selectedCampaignModal, setSelectedCampaignModal] = useState(null);
  const [selectedPostModal, setSelectedPostModal] = useState(null);

  // Login form state
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  // Stripe simulated checkout form state
  const [stripeAmount, setStripeAmount] = useState("2500");
  const [stripeCampaign, setStripeCampaign] = useState("Food Distribution");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardFlip, setCardFlip] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Volunteering scheduling state
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // CMS/Blog search & filters
  const [blogSearch, setBlogSearch] = useState("");
  const [selectedBlogCategory, setSelectedBlogCategory] = useState("All");

  // Before/After comparison slider percentage
  const [sliderPos, setSliderPos] = useState(50);
  const sliderContainerRef = useRef(null);

  // Ambient sound system (mock simulation)
  const [isSoundOn, setIsSoundOn] = useState(false);

  // Toast notices
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Loading Screen simulation
  useEffect(() => {
    const texts = [
      "Initializing Safe Registry Matrix...",
      "Resolving Awwwards Luxury Grid...",
      "Connecting community databases...",
      "Compiling 3D depth modules...",
      "System Ready."
    ];

    const timer = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(prev + step, 100);

        // Update subtexts based on loader value
        if (next < 25) setLoadText(texts[0]);
        else if (next < 50) setLoadText(texts[1]);
        else if (next < 75) setLoadText(texts[2]);
        else if (next < 95) setLoadText(texts[3]);
        else setLoadText(texts[4]);

        return next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  // Canvas Particle animation logic
  useEffect(() => {
    if (loading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    let particles = [];
    const particleCount = 65;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.color = `rgba(139, 92, 246, ${Math.random() * 0.35 + 0.15})`;
      }
      update(mouseX, mouseY) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          this.x += dx * 0.008;
          this.y += dy * 0.008;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(mouse.x, mouse.y);
        p.draw();
      });

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - distance / 90) * 0.07})`;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loading]);

  // Check login session redirect
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  // 3D Card mouse tilt hook handlers
  const handleCardTilt = (e, index) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Calculate rotation values (cap at 12 degrees)
    const rx = -(y / (box.height / 2)) * 12;
    const ry = (x / (box.width / 2)) * 12;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const resetCardTilt = (e) => {
    const card = e.currentTarget;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  // Login event submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");

    if (!mobile || mobile.length !== 10) {
      setLoginError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!password) {
      setLoginError("Password is required.");
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      const usersList = getUsers();
      const matchedUser = usersList.find((u) => u.mobile === mobile);

      if (!matchedUser) {
        setLoginError("Account not found. Check your mobile number.");
        setIsLoggingIn(false);
        return;
      }
      if (matchedUser.password !== password) {
        setLoginError("Incorrect password. Please try again.");
        setIsLoggingIn(false);
        return;
      }
      if (matchedUser.status === "Inactive") {
        setLoginError("Your account is currently inactive. Contact Super Admin.");
        setIsLoggingIn(false);
        return;
      }

      setCurrentUser(matchedUser);
      addAuditLog("User Login", `Successfully signed into the dashboard (${matchedUser.role})`);
      addToast(`Welcome back, ${matchedUser.name}!`, "success");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }, 850);
  };

  // Quick Developer Account bypass
  const handleQuickLogin = (demo) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      const usersList = getUsers();
      const dbUser = usersList.find((u) => u.mobile === demo.mobile) || {
        id: Date.now(),
        name: demo.name,
        mobile: demo.mobile,
        password: demo.pass,
        role: demo.role,
        status: "Active",
        joined: "2026-06-13",
        donations: demo.role === "USER" ? 8500 : 0,
        color: demo.color
      };

      setCurrentUser(dbUser);
      addAuditLog("User Login", `Developer bypass login forced as ${dbUser.name} (${dbUser.role})`);
      addToast(`Developer bypass: Logged in as ${dbUser.name}`, "success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }, 400);
  };

  // Demo accounts options
  const demoAccounts = [
    { name: "Mohammad Yunus", role: "SUPER_ADMIN", mobile: "7600526010", pass: "Qaswa@786", color: "from-violet-600 to-indigo-600" },
    { name: "Amir bhai", role: "SUPER_ADMIN", mobile: "9876543210", pass: "Amir@786", color: "from-red-500 to-pink-600" },
    { name: "Amir Admin", role: "ADMIN", mobile: "9104092123", pass: "Amir@123", color: "from-amber-500 to-rose-600" },
    { name: "Rahul Sharma", role: "USER", mobile: "9900887766", pass: "Rahul@123", color: "from-cyan-500 to-blue-600" },
  ];

  // Before/After comparison slider handle drag logic
  const handleSliderMove = (clientX) => {
    const container = sliderContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMoveSlider = (e) => {
    if (e.buttons === 1) {
      handleSliderMove(e.clientX);
    }
  };

  // Card formatting helpers
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const formatExpiry = (value) => {
    const clean = value.replace(/[^0-9]/g, "");
    if (clean.length >= 2) {
      return clean.slice(0, 2) + "/" + clean.slice(2, 4);
    }
    return clean;
  };

  // Simulated Payment submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      addToast("Please fill all bank card inputs.", "error");
      return;
    }
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      addToast(`Successfully donated ₹${parseInt(stripeAmount).toLocaleString("en-IN")} to ${stripeCampaign}!`, "success");
      // Add fake audit log / record in local simulation
      addAuditLog("Payment Checkout", `Simulated donation of ₹${stripeAmount} to ${stripeCampaign}`);
    }, 2500);
  };

  // Calendar Booking submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !bookingName || !bookingEmail) {
      addToast("Please fill out all booking credentials.", "error");
      return;
    }
    setBookingSuccess(true);
    addToast(`Volunteering call booked for ${bookingDate} at ${bookingTime}! Confirmation email queued.`, "success");
  };

  // CMS/Blog database list
  const blogPosts = [
    {
      id: 1,
      title: "Radical Transparency: Mapping Every Single Rupee",
      category: "Audit & Finance",
      date: "June 25, 2026",
      readTime: "5 min read",
      summary: "How Chhapi Foundation implements cryptographic records to trace donation claims from submission to actual community spending.",
      content: "Trust is built when actions are visible. In this deep dive, we outline our dual-ledger transparency index. When a user logs a donation in the dashboard, the transaction enters a pending audit queue. Once approved, the funds are automatically mapped into category bins (Food, Water Wells, Medical, Education). A secondary ledger tracks direct withdrawals, backed by photo audits and geolocation receipts, ensuring zero leakage of community support.",
      image: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)",
      author: "Mohammad Yunus, Founder"
    },
    {
      id: 2,
      title: "The Water Well Installation Campaign: A Clean Water Story",
      category: "Success Story",
      date: "June 18, 2026",
      readTime: "8 min read",
      summary: "Inside our campaign that completed 4 fresh water wells, transforming water security for over 150 local families.",
      content: "Before our intervention in early 2026, village children walked 4 kilometers daily for drinking water. Leveraging community donations totaling ₹1,80,000, our technical team installed four deep-bore water wells. Through interactive dashboards, donors were sent video verification of the water flowing. Today, the wells provide clean, safe water, drastically lowering gastrointestinal illness and returning school hours to young boys and girls.",
      image: "linear-gradient(135deg, #0f172a 0%, #0369a1 100%)",
      author: "Vikram Rathore, Field Director"
    },
    {
      id: 3,
      title: "Volunteering Re-imagined: Technology in Modern Charity",
      category: "Community",
      date: "June 10, 2026",
      readTime: "4 min read",
      summary: "Exploring how digital tools and dashboards streamline allocations, audit reports, and local volunteering drives.",
      content: "Modern philanthropy requires modern systems. Rather than relying on static annual PDF reports, Chhapi Foundation uses Next.js app layouts, real-time local storage db models, and interactive scheduling to synchronize volunteers. By utilizing local coordinators who approve and log tasks, we maintain a highly optimized workspace that channels local willingness directly into active projects.",
      image: "linear-gradient(135deg, #090d16 0%, #4c1d95 100%)",
      author: "Amir Admin, Operations Manager"
    }
  ];

  const filteredBlogPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                          post.summary.toLowerCase().includes(blogSearch.toLowerCase());
    const matchesCategory = selectedBlogCategory === "All" || post.category === selectedBlogCategory;
    return matchesSearch && matchesCategory;
  });

  // Active campaigns from db
  const campaignsList = [
    {
      name: "Food Distribution Drive",
      desc: "Providing healthy, essential meals to local families experiencing economic hardships.",
      goal: "₹1,50,000",
      spent: "₹1,20,000",
      progress: 80,
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      color: "from-pink-500/10 to-red-500/10 border-pink-500/20",
      badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20"
    },
    {
      name: "Emergency Medical Aid Pool",
      desc: "Funding essential surgeries, medicines, and ambulance services during critical crises.",
      goal: "₹2,50,000",
      spent: "₹2,10,000",
      progress: 84,
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    },
    {
      name: "Primary Education Sponsorships",
      desc: "Covering books, tuition fees, and classroom kits for children in rural communities.",
      goal: "₹1,00,000",
      spent: "₹85,000",
      progress: 85,
      icon: <Award className="w-6 h-6 text-violet-500" />,
      color: "from-violet-500/10 to-indigo-500/10 border-violet-500/20",
      badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/20"
    },
    {
      name: "Clean Water Well Installation",
      desc: "Boring deep water tube-wells in areas experiencing severe dry water scarcity.",
      goal: "₹1,80,000",
      spent: "₹1,50,000",
      progress: 83,
      icon: <Globe className="w-6 h-6 text-sky-400" />,
      color: "from-sky-500/10 to-blue-500/10 border-sky-500/20",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20"
    }
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden ${
      isDarkMode 
        ? "animated-mesh-bg text-zinc-100 selection:bg-purple-500/30 selection:text-white" 
        : "dashboard-light-theme bg-[#ebf6f7] text-[#0f172a] selection:bg-purple-200 selection:text-purple-900"
    }`}>
      
      {/* Toast notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
              toast.type === "error"
                ? "bg-red-500/15 border-red-500/30 text-red-200"
                : "bg-emerald-500/15 border-emerald-500/30 text-emerald-200"
            }`}
          >
            <div className="mr-3">
              <span className={`w-2.5 h-2.5 rounded-full block ${toast.type === "error" ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`}></span>
            </div>
            <div className="text-xs font-semibold">{toast.message}</div>
          </div>
        ))}
      </div>

      {/* 1. Cinematic Loading Screen */}
      {loading && (
        <div className="fixed inset-0 bg-[#070b12] z-[100] flex flex-col justify-between p-12 transition-opacity duration-700 pointer-events-auto select-none">
          {/* Top header */}
          <div className="flex justify-between items-center text-zinc-500 text-[10px] tracking-[0.25em] uppercase font-mono">
            <span>Chhapi Foundation Registry v2.6</span>
            <span>secure ssl link verified</span>
          </div>

          {/* Centered Logo & Progress */}
          <div className="max-w-md mx-auto w-full text-center space-y-8">
            <div className="relative w-24 h-24 mx-auto">
              {/* Spinning luxury circular track */}
              <div className="absolute inset-0 rounded-full border-2 border-white/5 border-t-purple-500 animate-spin"></div>
              {/* Centered logo container */}
              <div className="absolute inset-1.5 rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center border border-white/10 shadow-lg">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-widest text-white uppercase">Chhapi</h2>
              <div className="h-[2px] bg-zinc-800 rounded-full overflow-hidden w-48 mx-auto relative">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-150"
                  style={{ width: `${loadProgress}%` }}
                ></div>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 tracking-wider h-4">
                {loadText} ({loadProgress}%)
              </div>
            </div>
          </div>

          {/* Footer of loader */}
          <div className="flex justify-between items-end text-zinc-600 text-[9px] font-mono leading-relaxed">
            <div>
              <span>CREATIVE DIRECTIVE: AWARD WINNING UI</span>
              <br />
              <span>AWARDS & LUXURY FASHION INSPIRED</span>
            </div>
            <span>© 2026 ALL RIGHTS RESERVED</span>
          </div>
        </div>
      )}

      {/* Interactive Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
      />

      {/* Global Glow Decorations */}
      <div className="fixed top-[-25%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[180px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-15%] w-[55%] h-[55%] rounded-full bg-[#4a154b]/10 blur-[180px] pointer-events-none z-0"></div>

      {/* Header / Premium Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors border-white/5 bg-[#070b12]/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="Chhapi Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-widest text-white leading-none block dark:text-white light:text-zinc-900">
                CHHAPI
              </span>
              <span className="text-[8px] font-mono tracking-widest text-purple-400 dark:text-purple-400 light:text-purple-700 uppercase">
                Foundation
              </span>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#campaigns" className="hover:text-white transition-colors">Campaigns</a>
            <a href="#impact" className="hover:text-white transition-colors">Impact</a>
            <a href="#booking" className="hover:text-white transition-colors">Volunteer</a>
            <a href="#blog" className="hover:text-white transition-colors">Insights</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Quick Actions (Theme, Language, Login Button) */}
          <div className="flex items-center gap-3">
            
            {/* Multi-language Selector */}
            <div className="relative group">
              <button className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center gap-1.5 text-xs text-zinc-300 font-semibold cursor-pointer">
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="uppercase">{lang}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-28 bg-[#111928] border border-white/10 rounded-2xl p-1.5 hidden group-hover:block shadow-2xl animate-[fadeIn_0.15s_ease-out] z-50">
                <button 
                  onClick={() => setLang("en")}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl hover:bg-white/5 font-semibold transition-colors ${lang === "en" ? "text-purple-400 bg-white/5" : "text-zinc-400"}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setLang("hi")}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl hover:bg-white/5 font-semibold transition-colors ${lang === "hi" ? "text-purple-400 bg-white/5" : "text-zinc-400"}`}
                >
                  हिन्दी
                </button>
                <button 
                  onClick={() => setLang("es")}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl hover:bg-white/5 font-semibold transition-colors ${lang === "es" ? "text-purple-400 bg-white/5" : "text-zinc-400"}`}
                >
                  Español
                </button>
              </div>
            </div>

            {/* Live Analytics Toggle */}
            <button
              onClick={() => setShowAnalyticsDrawer(true)}
              className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-zinc-300 cursor-pointer"
              title={t.analyticsLabel}
            >
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            </button>

            {/* Sound toggle */}
            <button
              onClick={() => {
                setIsSoundOn(!isSoundOn);
                addToast(isSoundOn ? "Sound FX muted" : "Immersive audio experience loaded", "success");
              }}
              className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-zinc-300 hidden sm:block cursor-pointer"
              title="Ambient Audio"
            >
              {isSoundOn ? <Volume2 className="w-4 h-4 text-violet-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>

            {/* Dynamic Light/Dark Mode Switcher */}
            <button 
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                addToast(`Switched to ${!isDarkMode ? "Light" : "Dark"} mode theme.`, "success");
              }}
              className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-zinc-300 cursor-pointer"
            >
              <span className="text-xs font-bold font-mono">
                {isDarkMode ? "☀" : "🌙"}
              </span>
            </button>

            {/* Client Portal Button */}
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-violet-600/10 active:scale-[0.97] flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.ctaLogin}</span>
            </button>

          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center py-16 px-6 z-10">
        
        {/* Infinite marquee banner */}
        <div className="absolute top-6 left-0 right-0 w-full overflow-hidden py-3 bg-[#111928]/45 border-y border-white/5 backdrop-blur-md pointer-events-none select-none z-10">
          <div className="flex w-[200%] animate-marquee whitespace-nowrap text-[10px] tracking-[0.3em] font-bold text-zinc-500 uppercase">
            <span className="mx-6">★ 100% Verified Community Audits</span>
            <span className="mx-6">★ Zero leak financial allocation</span>
            <span className="mx-6">★ Awwwards High-End Cinematic Design</span>
            <span className="mx-6">★ Empowering rural livelihoods</span>
            <span className="mx-6">★ 100% Verified Community Audits</span>
            <span className="mx-6">★ Zero leak financial allocation</span>
            <span className="mx-6">★ Awwwards High-End Cinematic Design</span>
            <span className="mx-6">★ Empowering rural livelihoods</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 mt-12">
          
          {/* Decorative Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-zinc-300 font-bold uppercase tracking-[0.2em] shadow-lg backdrop-blur-md animate-bounce">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span>Chhapi Donation Ecosystem</span>
          </div>

          {/* Giant Title */}
          <div className="space-y-2 select-none">
            <div className="reveal-text-container">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight leading-none uppercase reveal-text-child text-white dark:text-white light:text-zinc-900">
                {t.heroTitle.split(" ")[0]}
              </h1>
            </div>
            <div className="reveal-text-container">
              <h1 className="text-3xl sm:text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 font-black uppercase reveal-text-child" style={{ animationDelay: "0.15s" }}>
                {t.heroTitle.split(" ").slice(1).join(" ")}
              </h1>
            </div>
          </div>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed font-medium">
            {t.heroSubtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            
            <div className="magnetic-btn-wrap">
              <a
                href="#campaigns"
                className="px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-200 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-white/5 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <span>{t.ctaGetStarted}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="magnetic-btn-wrap">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border border-white/10 hover:border-white/20 active:scale-[0.98] flex items-center gap-2 cursor-pointer luxury-btn-gradient"
              >
                <CreditCard className="w-4 h-4 text-purple-200" />
                <span>{t.stripeLabel}</span>
              </button>
            </div>

            <div className="magnetic-btn-wrap">
              <button
                onClick={() => setShowAnalyticsDrawer(true)}
                className="px-8 py-4 bg-[#111928]/40 hover:bg-[#1e293b]/40 text-emerald-400 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border border-emerald-500/10 hover:border-emerald-500/20 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                <span>{t.ctaAnalytics}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Floating background details */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50 select-none">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Scroll to Discover</span>
          <div className="w-5 h-8 border border-zinc-600 rounded-full relative">
            <div className="w-1.5 h-1.5 bg-violet-400 rounded-full absolute left-1/2 -translate-x-1/2 animate-scroll-arrow"></div>
          </div>
        </div>

      </section>

      {/* 3. About Section */}
      <section id="about" className="relative py-28 px-6 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] text-purple-400 font-bold uppercase tracking-widest">
              <span>{t.aboutTitle}</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase leading-tight text-white dark:text-white light:text-zinc-900">
              {t.aboutHeading}
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              {t.aboutText}
            </p>

            <div className="pt-4">
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-6 py-3.5 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{t.appointmentLabel}</span>
              </button>
            </div>
          </div>

          {/* Stats counters grid */}
          <div className="grid grid-cols-2 gap-6">
            
            <div className="awwwards-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                <DollarSign className="w-6 h-6 text-violet-400" />
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl block text-white dark:text-white light:text-zinc-900">
                  <Counter value="574000" suffix="+" />
                </span>
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{t.statsRaised}</span>
              </div>
            </div>

            <div className="awwwards-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl block text-white dark:text-white light:text-zinc-900">
                  <Counter value="98" suffix="%" />
                </span>
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{t.statsTransparency}</span>
              </div>
            </div>

            <div className="awwwards-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                <Users className="w-6 h-6 text-sky-400" />
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl block text-white dark:text-white light:text-zinc-900">
                  <Counter value="400" suffix="+" />
                </span>
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{t.statsVolunteers}</span>
              </div>
            </div>

            <div className="awwwards-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl block text-white dark:text-white light:text-zinc-900">
                  <Counter value="15" suffix="+" />
                </span>
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{t.statsCampaigns}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Timeline Timeline animation details */}
        <div className="max-w-7xl mx-auto mt-24 border-t border-white/5 pt-16">
          <div className="text-center space-y-2 mb-16">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Chronicle Roadmap</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white dark:text-white light:text-zinc-900">Community Mileposts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-zinc-800 z-0"></div>
            
            {[
              { year: "2024 Phase I", title: "Foundation Laying", desc: "Setting up local NGO registration and manual ledger systems." },
              { year: "2025 Phase II", title: "Digital Integration", desc: "Building local database simulation dashboards, launching campaigns." },
              { year: "2026 Phase III", title: "Radical Transparency", desc: "Releasing full audit history logs, live dashboard analytics." },
              { year: "2027 Phase IV", title: "Decentralized Giving", desc: "Introducing cryptographically signed allocations & video reports." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left space-y-4 group">
                <div className="w-14 h-14 rounded-full bg-[#111928]/90 border-2 border-zinc-700 group-hover:border-purple-500 flex items-center justify-center text-xs font-bold text-white transition-all duration-300 shadow-xl shadow-black/40">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">{step.year}</span>
                  <h4 className="text-base font-bold text-white dark:text-white light:text-zinc-900">{step.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 4. Campaigns (Services) Section */}
      <section id="campaigns" className="relative py-28 px-6 bg-[#070b12]/30 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-[9px] text-sky-400 font-bold uppercase tracking-widest">
              <span>{t.campaignsTitle}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-zinc-900">
              {t.campaignsHeading}
            </h2>
          </div>

          {/* Cards Grid with 3D Mouse Tilt */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {campaignsList.map((campaign, idx) => (
              <div
                key={idx}
                onMouseMove={(e) => handleCardTilt(e, idx)}
                onMouseLeave={resetCardTilt}
                onClick={() => setSelectedCampaignModal(campaign)}
                className={`tilt-card awwwards-card p-8 flex flex-col justify-between h-[360px] cursor-pointer hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg ${campaign.color}`}
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-violet-500/10 to-transparent blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

                <div className="space-y-6 tilt-card-inner">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                      {campaign.icon}
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${campaign.badgeColor}`}>
                      {campaign.progress}% Funded
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white leading-snug dark:text-white light:text-zinc-900 group-hover:text-purple-400 transition-colors">
                      {campaign.name}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed truncate-3-lines">
                      {campaign.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 tilt-card-inner">
                  {/* Progress Indicator */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-semibold font-mono">
                      <span>Spent: {campaign.spent}</span>
                      <span>Goal: {campaign.goal}</span>
                    </div>
                    <div className="h-[3px] bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${campaign.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors uppercase tracking-wider">
                    <span>Inspect Allocations</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Portfolio Section (Impact & Case Studies) */}
      <section id="impact" className="relative py-28 px-6 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] text-amber-500 font-bold uppercase tracking-widest">
              <span>{t.beforeAfterTitle}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-zinc-900">
              {t.beforeAfterHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Before/After Interactive Image Slider */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-left space-y-1">
                <h4 className="text-base font-bold text-white dark:text-white light:text-zinc-900">Project: Clean Water Well (Village Bore-well No. 3)</h4>
                <p className="text-xs text-zinc-400">Drag the central handle to compare dry water scarcity (Before) vs. fresh borewell output (After).</p>
              </div>

              {/* Slider Container */}
              <div 
                ref={sliderContainerRef}
                onMouseMove={handleMouseMoveSlider}
                onTouchMove={handleTouchMove}
                className="relative w-full h-[400px] rounded-3xl overflow-hidden cursor-ew-resize border border-white/10 select-none bg-[#111928]/20"
              >
                {/* Before Image (Background) */}
                <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-6 bg-gradient-to-br from-orange-950/40 via-red-950/20 to-black text-center space-y-2">
                  <span className="text-xs font-bold text-orange-400 border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Before Funding
                  </span>
                  <h3 className="text-xl font-bold text-white max-w-sm uppercase">Dry, Unusable Silt bed</h3>
                  <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">Local households lacked access to sanitary piping, relying on drying hand pumps or contaminated seasonal streams.</p>
                </div>

                {/* After Image (Overlay with clipping) */}
                <div 
                  className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-6 bg-gradient-to-br from-sky-950/40 via-blue-950/20 to-indigo-950/80 text-center space-y-2 pointer-events-none"
                  style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                >
                  <span className="text-xs font-bold text-sky-400 border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    After Campaign Completion
                  </span>
                  <h3 className="text-xl font-bold text-white max-w-sm uppercase">High-Yield Aquifer Tube-well</h3>
                  <p className="text-xs text-zinc-300 max-w-xs leading-relaxed">Installed deep boring aquifer, supplying 1500+ liters of potable water daily, monitored on dashboard ledgers.</p>
                </div>

                {/* Vertical slider line handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white z-20 pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-zinc-950 font-bold flex items-center justify-center shadow-2xl border border-zinc-300 text-xs">
                    ↔
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Case Studies list */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Featured Achievements</span>
              
              <div className="space-y-6">
                {[
                  { title: "Rural Meal Packs", metric: "₹1,20,000 Dispensed", status: "Completed", details: "Distributed dry food ration packs, supporting 240+ families through droughts." },
                  { title: "School Education Kits", metric: "₹85,000 Completed", status: "Active allocations", details: "Supplied kits containing notebooks, study tables, school bags, and primary geometry books." },
                  { title: "Surgical Medical Aid", metric: "₹2,10,000 Allocated", status: "Urgent drive", details: "Sponsored major surgeries for rural children suffering from cardiac abnormalities." }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-[#111928]/25 border border-white/5 flex gap-4 hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0 border border-purple-500/20">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white dark:text-white light:text-zinc-900">{item.title}</h4>
                        <span className="text-[9px] font-mono text-purple-400 font-semibold uppercase">{item.status}</span>
                      </div>
                      <p className="text-xs font-mono text-zinc-400">{item.metric}</p>
                      <p className="text-xs text-zinc-500 leading-relaxed">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="relative py-28 px-6 bg-[#070b12]/30 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-[9px] text-pink-500 font-bold uppercase tracking-widest">
              <span>{t.testimonialsTitle}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-zinc-900">
              {t.testimonialsHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "“Seeing my donation update in the logs with an actual spent reference was game-changing. I have never seen a charity so tech-forward and transparent.”", author: "Rajesh Patel, Bangalore", role: "Gold Donor", icon: "⭐" },
              { text: "“As an auditor, the verification workflow in Chhapi Donation makes financial tracking flawless. They are setting standard templates for community work.”", author: "Simran Sheikh, Mumbai", role: "Chartered Accountant", icon: "⭐⭐" },
              { text: "“We received clean water inside our school village premises within two months of fundraising. Our children are healthy, happy and active.”", author: "Village Head, Chhapi Rural", role: "Community Beneficiary", icon: "⭐" }
            ].map((tst, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-[#111928]/45 border border-white/5 hover:border-white/10 transition-all duration-300 relative flex flex-col justify-between space-y-6">
                <span className="text-2xl text-purple-400 block">{tst.icon}</span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  {tst.text}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-white/10">
                    {tst.author[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white dark:text-white light:text-zinc-900">{tst.author}</h4>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">{tst.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Team Section */}
      <section className="relative py-28 px-6 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[9px] text-violet-500 font-bold uppercase tracking-widest">
              <span>{t.teamTitle}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-zinc-900">
              {t.teamHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Mohammad Yunus", role: "Founder & Creative Lead", quote: "Creating high-fidelity digital systems to solve real-world allocations.", color: "from-violet-600 to-indigo-700" },
              { name: "Amir Bhai", role: "Lead Systems Architect", quote: "Ensuring ledger audits and multi-language capabilities are flawless.", color: "from-red-500 to-rose-700" },
              { name: "Vikram Rathore", role: "Field Operations Director", quote: "Bringing visual verification and water boring operations home.", color: "from-amber-500 to-orange-700" }
            ].map((member, idx) => (
              <div 
                key={idx}
                className="group relative rounded-3xl bg-[#111928]/45 border border-white/5 p-8 overflow-hidden flex flex-col justify-between h-[360px] transition-all hover:border-purple-500/20"
              >
                {/* 3D Cutout decoration */}
                <div className={`absolute top-0 right-0 w-44 h-44 rounded-bl-[100px] bg-gradient-to-br ${member.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}></div>
                
                {/* Profile placeholder icon */}
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <User className="w-8 h-8 text-purple-400" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white dark:text-white light:text-zinc-900 group-hover:text-purple-400 transition-colors">
                      {member.name}
                    </h3>
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    “{member.quote}”
                  </p>
                </div>

                <div className="flex gap-3 text-zinc-500 text-xs">
                  <a href="#" className="hover:text-white transition-colors" title="Twitter / X">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors" title="LinkedIn">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors" title="GitHub">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Pricing/Sponsorship Section */}
      <section className="relative py-28 px-6 bg-[#070b12]/30 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] text-amber-400 font-bold uppercase tracking-widest">
              <span>{t.pricingTitle}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-zinc-900">
              {t.pricingHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { level: "Bronze Tier", price: "₹2,500", desc: "Supports local meal distributions.", features: ["Single food distribution drive", "Transaction audit entry", "Email PDF certificate"] },
              { level: "Silver Tier", price: "₹10,000", desc: "Funds rural student kits.", features: ["Full primary education kits", "Sponsor listing", "Photo audit updates"] },
              { level: "Gold Tier", price: "₹35,000", desc: "Funds clean water boring.", features: ["Water well partial sponsorship", "Name engraved on well tablet", "Video impact review", "Dashboard audit account"] },
              { level: "Platinum Tier", price: "₹75,000+", desc: "Ultimate community backing.", features: ["Emergency Medical Aid pool sponsor", "Direct project steering rights", "Quarterly audit review calls", "Super Admin audit log entry"] }
            ].map((tier, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-3xl bg-[#111928]/45 border border-white/5 flex flex-col justify-between h-[420px] hover:border-purple-500/25 transition-all duration-300 backdrop-blur-md relative overflow-hidden group"
              >
                {/* Visual badge */}
                {idx === 2 && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-[8px] font-bold text-purple-400 uppercase tracking-widest">
                    Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">{tier.level}</span>
                  <div className="space-y-1">
                    <span className="text-3xl font-extrabold text-white dark:text-white light:text-zinc-900">{tier.price}</span>
                    <p className="text-xs text-zinc-400">{tier.desc}</p>
                  </div>
                  <div className="h-[1px] bg-zinc-800 my-4"></div>
                  
                  {/* Features */}
                  <ul className="space-y-2">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-zinc-400">
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setStripeAmount(tier.price.replace(/[^0-9]/g, ""));
                    setShowPaymentModal(true);
                  }}
                  className={`w-full py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] cursor-pointer ${
                    idx === 2
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/10"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                  }`}
                >
                  Sponsor Now
                </button>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. Process Section */}
      <section className="relative py-28 px-6 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[9px] text-violet-500 font-bold uppercase tracking-widest">
              <span>{t.processTitle}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-zinc-900">
              {t.processHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Pledge & Submit", desc: "Select a sponsorship category or input custom amounts. Submit references for UPI or bank transactions." },
              { num: "02", title: "Audit Verification", desc: "Admins review receipts, check transaction reference numbers, and approve into verified community histories." },
              { num: "03", title: "Fund Allocation", desc: "Funds accumulate in categorical buckets (Medical, Food, Water, Education). Withdrawals are tracked strictly with visual proof." },
              { num: "04", title: "Real-time Audits", desc: "View every single transaction in public dashboard logs. Verify matching photo audits and local geolocation data." }
            ].map((proc, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-[#111928]/45 border border-white/5 space-y-6 hover:border-white/10 transition-colors">
                <span className="text-4xl font-extrabold text-purple-500/20 block font-mono">{proc.num}</span>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white dark:text-white light:text-zinc-900">{proc.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{proc.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. FAQ Section Accordions */}
      <section className="relative py-28 px-6 bg-[#070b12]/30 border-t border-white/5 z-10">
        <div className="max-w-3xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-[9px] text-pink-500 font-bold uppercase tracking-widest">
              <span>{t.faqTitle}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-zinc-900">
              {t.faqHeading}
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is my payment secure on this platform?", a: "Yes. For real-world transactions, we integrate standard payment gateway redirects (Stripe/Razorpay) backed by SSL encryption. Our local database utilizes encrypted sessions." },
              { q: "How do I check that my money is actually spent?", a: "Every approved transaction is posted publicly in our audit log logs. If you click on any dashboard ledger or campaign details, you can see direct spend logs, photo audits and matching receipts." },
              { q: "Can I volunteer directly for field activities?", a: "Absolutely. You can schedule a video conference or phone consultation slot with our Directors using the appointment calendar tool on this page to enroll as a field volunteer." },
              { q: "Are donations eligible for tax exemption?", a: "Yes, Chhapi Foundation is a verified organization and donations qualify for 50% tax deductions under section 80G of the Income Tax Act." }
            ].map((faq, idx) => {
              const [isOpen, setIsOpen] = useState(idx === 0);
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-white/5 bg-[#111928]/45 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-6 text-left flex justify-between items-center text-white font-bold text-sm sm:text-base cursor-pointer hover:bg-white/5 transition-colors dark:text-white light:text-zinc-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="p-6 pt-0 text-xs sm:text-sm text-zinc-400 border-t border-white/5 leading-relaxed bg-white/[0.01]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10.5 CMS / Blog Insights System */}
      <section id="blog" className="relative py-28 px-6 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[9px] text-violet-500 font-bold uppercase tracking-widest">
                <span>Insights Hub</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white dark:text-white light:text-zinc-900">
                Latest Publications
              </h2>
            </div>

            {/* CMS Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full bg-[#111928]/40 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {["All", "Audit & Finance", "Success Story", "Community"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedBlogCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                      selectedBlogCategory === cat
                        ? "bg-purple-500/20 border-purple-500/35 text-purple-400"
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-zinc-350"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CMS Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredBlogPosts.map((post) => (
              <article 
                key={post.id}
                onClick={() => setSelectedPostModal(post)}
                className="p-8 rounded-3xl bg-[#111928]/45 border border-white/5 hover:border-purple-500/20 hover:bg-[#111928]/60 transition-all duration-300 flex flex-col justify-between h-[420px] cursor-pointer group shadow-lg"
              >
                <div className="space-y-4">
                  {/* Abstract post cover */}
                  <div className="h-44 rounded-2xl overflow-hidden relative" style={{ background: post.image }}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                    <span className="absolute top-4 left-4 px-2 py-0.5 bg-black/60 border border-white/10 rounded text-[8px] font-bold uppercase text-purple-400 tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 block">{post.date} • {post.readTime}</span>
                    <h3 className="text-base font-bold text-white leading-snug group-hover:text-purple-400 transition-colors line-clamp-2 dark:text-white light:text-zinc-900">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-450 leading-relaxed line-clamp-2">{post.summary}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            ))}

            {filteredBlogPosts.length === 0 && (
              <div className="col-span-3 text-center py-16 text-xs font-mono text-zinc-500 uppercase">
                No matching articles found.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 11. Contact Section */}
      <section id="contact" className="relative py-28 px-6 bg-[#070b12]/30 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[9px] text-violet-500 font-bold uppercase tracking-widest">
              <span>{t.contactTitle}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase leading-tight text-white dark:text-white light:text-zinc-900">
              {t.contactHeading}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
              We welcome partnerships, direct audits, volunteering drives, and custom sponsorship configurations. Drop a line to speak with our coordinators.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono block">Active Line</span>
                  <a href="tel:+917600526010" className="text-white font-bold hover:underline font-mono">+91 76005 26010</a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono block">Electronic Mail</span>
                  <a href="mailto:info@chhapidonation.org" className="text-white font-bold hover:underline font-mono font-semibold">info@chhapidonation.org</a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono block">Registered Office</span>
                  <span className="text-white font-bold">Chhapi Village, Banaskantha District, Gujarat, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Capture Form & Map */}
          <div className="lg:col-span-7 space-y-8">
            <div className="p-8 rounded-3xl bg-[#111928]/45 border border-white/5 backdrop-blur-md space-y-6">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Submit Inquiry Form</span>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  addToast("Lead successfully synced with local CRM logs!", "success");
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Patel"
                      className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-3 px-4 text-white text-xs placeholder-zinc-650 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-3 px-4 text-white text-xs placeholder-zinc-650 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Inquiry Type</label>
                  <select className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-3 px-4 text-white text-xs focus:outline-none">
                    <option className="bg-[#111928] text-white">General Sponsorship Inquiry</option>
                    <option className="bg-[#111928] text-white">Corporate Collaboration</option>
                    <option className="bg-[#111928] text-white">Audit/Transparency Verification</option>
                    <option className="bg-[#111928] text-white">Volunteering Opportunities</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter details..."
                    className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-3 px-4 text-white text-xs placeholder-zinc-650 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-white hover:bg-zinc-200 text-zinc-950 font-bold uppercase tracking-wider text-xs rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            </div>

            {/* Simulated Geographic Location Map Overlay */}
            <div className="h-48 rounded-3xl overflow-hidden border border-white/5 relative bg-[#111928]/35 flex flex-col justify-center items-center text-center p-6">
              {/* Abstract layout */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

              <div className="relative z-10 space-y-2">
                <MapPin className="w-8 h-8 text-purple-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Gujarat HQ Location Overlay</h4>
                <p className="text-[10px] text-zinc-500 font-mono uppercase">BANASKANTHA DISTRICT • 24.1687° N, 72.3951° E</p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 text-[10px] text-purple-400 hover:text-purple-300 font-bold uppercase underline"
                >
                  <span>Open Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 12. Footer */}
      <footer className="relative py-16 px-6 border-t border-white/5 z-10 bg-[#060814]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-xs">
          
          <div className="space-y-4">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                <img src="/logo.png" alt="Chhapi Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-widest text-white leading-none block">CHHAPI</span>
                <span className="text-[8px] font-mono tracking-widest text-purple-400 uppercase">Foundation</span>
              </div>
            </a>
            <p className="text-zinc-500 leading-relaxed font-semibold">
              {t.footerText}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Direct Nav</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#about" className="hover:text-white transition-colors">Our Narrative</a></li>
              <li><a href="#campaigns" className="hover:text-white transition-colors">Active Campaigns</a></li>
              <li><a href="#impact" className="hover:text-white transition-colors">Visual Impact</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Insights Publications</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Resources</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" onClick={() => setShowLoginModal(true)} className="hover:text-white transition-colors">Admin Gateway</a></li>
              <li><a href="#" onClick={() => setShowAnalyticsDrawer(true)} className="hover:text-white transition-colors">Live Site Traffic</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ Accordions</a></li>
              <li><a href="https://chhapidonation.netlify.app/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">Live Server <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Audited Dispatch</h4>
            <p className="text-zinc-500">Subscribe for quarterly receipts, audit digests, and completed campaign reports.</p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                addToast("Thank you for subscribing! Your email has been registered.", "success");
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                placeholder="Enter email"
                className="bg-[#1e293b]/20 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none w-full"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 rounded-xl font-bold uppercase tracking-wider text-[10px] cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 font-mono">
          <span>© 2026 CHHAPI FOUNDATION. REGISTRY VERIFIED.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">PRIVACY TERMS</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">AUDIT RULES</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">TAX POLICY</a>
          </div>
        </div>
      </footer>

      {/* ==========================================================================
         ADVANCED PORTAL MODALS SYSTEM
         ========================================================================== */}

      {/* A. Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-md bg-[#111928]/95 border border-white/10 rounded-3xl p-8 relative space-y-6 shadow-2xl animate-[fadeIn_0.22s_ease-out] max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => {
                setShowLoginModal(false);
                setLoginError("");
              }}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 mx-auto shadow-md shadow-white/5">
                <img src="/logo.png" alt="Chhapi Logo" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider dark:text-white light:text-zinc-900">Client Login</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-semibold">Community Contributions & Allocations Registry</p>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3.5 text-xs text-red-400 font-semibold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-zinc-650 font-mono text-sm">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-2xl py-3.5 pl-14 pr-4 text-white text-xs placeholder-zinc-650 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Password</label>
                  <span className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer font-semibold">Forgot?</span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-2xl py-3.5 px-4 text-white text-xs placeholder-zinc-650 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex justify-center items-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isLoggingIn ? (
                  <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <span>Access Account</span>
                )}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowDemoSelector(!showDemoSelector)}
                className="text-[10px] font-bold text-zinc-400 hover:text-white underline cursor-pointer decoration-dotted underline-offset-4 uppercase"
              >
                {showDemoSelector ? "Hide Developer Sandbox Bypass" : "Show Developer Sandbox Bypass"}
              </button>
            </div>

            {showDemoSelector && (
              <div className="bg-[#1e293b]/25 border border-zinc-800/80 rounded-2xl p-4 space-y-3 animate-[fadeIn_0.2s_ease-out]">
                <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest block text-center">Quick Login (Bypass Controls)</span>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((demo) => (
                    <button
                      key={demo.mobile}
                      type="button"
                      onClick={() => handleQuickLogin(demo)}
                      className="p-2.5 bg-black/40 border border-zinc-800 rounded-xl hover:border-purple-500/30 transition-colors text-left flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="text-[10px] font-bold text-white truncate">{demo.name}</div>
                        <span className="text-[8px] text-zinc-500 font-mono block mt-0.5">+91 {demo.mobile}</span>
                      </div>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded mt-2 border self-start ${
                        demo.role === "SUPER_ADMIN" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                        demo.role === "ADMIN" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                        "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      }`}>
                        {demo.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[8px] text-zinc-700 font-mono tracking-wider pt-2 uppercase text-center border-t border-zinc-800/40">
              authorized personnel only • encrypted session
            </div>
          </div>
        </div>
      )}

      {/* B. Volunteering Appointment Calendar Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-[#111928]/95 border border-white/10 rounded-3xl p-8 relative space-y-6 shadow-2xl animate-[fadeIn_0.22s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                setShowBookingModal(false);
                setBookingSuccess(false);
                setBookingDate("");
                setBookingTime("");
                setBookingName("");
                setBookingEmail("");
              }}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <Calendar className="w-10 h-10 text-purple-400 mx-auto" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wider dark:text-white light:text-zinc-900">Volunteer Scheduler</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-mono">Book a Google Meet or Direct Consultation</p>
            </div>

            {bookingSuccess ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto animate-pulse" />
                <h4 className="text-base font-bold text-white">Appointment Scheduled!</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We have mapped your volunteering call on our system. A confirmation email holding calendars invite and google meet link has been dispatched to <span className="text-purple-400 font-semibold">{bookingEmail}</span>.
                </p>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingSuccess(false);
                  }}
                  className="px-6 py-2.5 bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Dismiss Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Choose Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-3 px-4 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Time Slot</label>
                    <select
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-3 px-4 text-white text-xs focus:outline-none"
                    >
                      <option className="bg-[#111928] text-white" value="">Select slot</option>
                      <option className="bg-[#111928] text-white" value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                      <option className="bg-[#111928] text-white" value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                      <option className="bg-[#111928] text-white" value="03:00 PM - 03:30 PM">03:00 PM - 03:30 PM</option>
                      <option className="bg-[#111928] text-white" value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-3 px-4 text-white text-xs placeholder-zinc-650 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-3 px-4 text-white text-xs placeholder-zinc-650 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-[0.98] cursor-pointer"
                >
                  Schedule Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* C. Direct Payment Simulation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-xl bg-[#111928]/95 border border-white/10 rounded-3xl p-8 relative space-y-6 shadow-2xl animate-[fadeIn_0.22s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                setShowPaymentModal(false);
                setPaymentSuccess(false);
                setCardNumber("");
                setCardExpiry("");
                setCardCvv("");
                setCardName("");
                setCardFlip(false);
              }}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <CreditCard className="w-10 h-10 text-purple-400 mx-auto" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wider dark:text-white light:text-zinc-900">Direct Sponsorship</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-mono">Secure Sandboxed Checkout Portal</p>
            </div>

            {paymentSuccess ? (
              <div className="p-8 text-center space-y-6">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-pulse" />
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">Sponsorship Completed!</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Thank you! We received your sandbox donation of <span className="text-purple-400 font-bold">₹{parseInt(stripeAmount).toLocaleString("en-IN")}</span> allocated to <span className="font-semibold">{stripeCampaign}</span>. The transaction reference UPI has been written to system audit log history.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl text-[10px] font-mono text-zinc-400 text-left space-y-1 max-w-xs mx-auto border border-white/5">
                  <div>REFERENCE: CHHAPI-TXN-{Date.now().toString().slice(-6)}</div>
                  <div>ALLOCATED CATEGORY: {stripeCampaign}</div>
                  <div>BANK ROUTE: State Bank of India</div>
                  <div>STATUS: Completed (Audited)</div>
                </div>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentSuccess(false);
                  }}
                  className="px-8 py-3 bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Dismiss Window
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* 3D Bank Card Representation */}
                <div className="perspective-card w-full h-44 hidden md:block">
                  <div 
                    className={`relative w-full h-full rounded-2xl p-6 transition-all duration-700 transform-style-preserve-3d shadow-xl ${
                      cardFlip ? "rotate-y-180" : ""
                    }`}
                    style={{ background: "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 50%, #000000 100%)", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                  >
                    
                    {/* Front Face */}
                    <div className="absolute inset-0 w-full h-full p-6 backface-hidden flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold tracking-widest font-mono uppercase">CHHAPI PRESTIGE</span>
                        <div className="w-8 h-6 bg-amber-500/20 rounded border border-amber-500/30"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="text-sm font-mono tracking-widest">{cardNumber || "•••• •••• •••• ••••"}</div>
                        <div className="flex justify-between text-[8px] font-mono tracking-wider uppercase text-zinc-400">
                          <div>
                            <div>CARDHOLDER</div>
                            <div className="text-white font-bold text-[10px] mt-0.5 truncate max-w-[120px]">{cardName || "NAME ON CARD"}</div>
                          </div>
                          <div>
                            <div>EXPIRES</div>
                            <div className="text-white font-bold text-[10px] mt-0.5">{cardExpiry || "MM/YY"}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col justify-between py-6 text-white">
                      <div className="w-full h-8 bg-zinc-950 mt-2"></div>
                      <div className="px-6 flex justify-end">
                        <div className="bg-white text-zinc-900 text-xs font-mono px-3 py-1 font-bold rounded italic tracking-widest text-right">
                          {cardCvv || "CVV"}
                        </div>
                      </div>
                      <div className="px-6 text-[7px] font-mono text-zinc-500 leading-relaxed">
                        Prestige donor sandbox card index. Valid for simulated checkouts across award-winning layouts.
                      </div>
                    </div>

                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handlePaymentSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Choose Campaign</label>
                    <select
                      value={stripeCampaign}
                      onChange={(e) => setStripeCampaign(e.target.value)}
                      className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none"
                    >
                      <option className="bg-[#111928]" value="Food Distribution">Food Distribution Drive</option>
                      <option className="bg-[#111928]" value="Emergency Medical Aid">Emergency Medical Aid Pool</option>
                      <option className="bg-[#111928]" value="Education Support">Primary Education Sponsorship</option>
                      <option className="bg-[#111928]" value="Water Wells Project">Clean Water Well Boring</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Sponsorship Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={stripeAmount}
                      onChange={(e) => setStripeAmount(e.target.value)}
                      placeholder="e.g. 2500"
                      className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      onFocus={() => setCardFlip(false)}
                      className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      onFocus={() => setCardFlip(false)}
                      className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Expiration</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        onFocus={() => setCardFlip(false)}
                        className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ""))}
                        onFocus={() => setCardFlip(true)}
                        className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-xl py-2 px-3 text-white text-xs focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessingPayment ? "Validating securely..." : `Authorize ₹${parseInt(stripeAmount || "0").toLocaleString("en-IN")}`}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* D. CMS Blog Full Article Modals */}
      {selectedPostModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-2xl bg-[#111928]/95 border border-white/10 rounded-3xl p-8 relative space-y-6 shadow-2xl animate-[fadeIn_0.22s_ease-out] max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPostModal(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded text-[9px] font-mono uppercase tracking-widest">
              {selectedPostModal.category}
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight dark:text-white light:text-zinc-900">
              {selectedPostModal.title}
            </h3>

            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 border-b border-white/5 pb-4">
              <span>Author: {selectedPostModal.author}</span>
              <span>Published: {selectedPostModal.date}</span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
              {selectedPostModal.content}
            </p>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">CHHAPI FOUNDATION INSIGHTS</span>
              <button
                onClick={() => setSelectedPostModal(null)}
                className="px-5 py-2.5 bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E. Campaigns Inspect Modal */}
      {selectedCampaignModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-[#111928]/95 border border-white/10 rounded-3xl p-8 relative space-y-6 shadow-2xl animate-[fadeIn_0.22s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCampaignModal(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                {selectedCampaignModal.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white dark:text-white light:text-zinc-900">{selectedCampaignModal.name}</h3>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Active Drive Audit</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {selectedCampaignModal.desc}
            </p>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Audit Ledger Snapshot</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Accumulated Target</span>
                  <span className="text-base font-extrabold text-white font-mono">{selectedCampaignModal.goal}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Verified Disbursed</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">{selectedCampaignModal.spent}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase font-mono">
                  <span>Allocation Progress</span>
                  <span>{selectedCampaignModal.progress}%</span>
                </div>
                <div className="h-[4px] bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedCampaignModal.progress}%` }}></div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedCampaignModal(null);
                  setStripeCampaign(selectedCampaignModal.name);
                  setStripeAmount(selectedCampaignModal.name.includes("Water") ? "35000" : "2500");
                  setShowPaymentModal(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Sponsor Campaign
              </button>
              <button
                onClick={() => setSelectedCampaignModal(null)}
                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* F. Live Analytics Sidebar Drawer */}
      {showAnalyticsDrawer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div 
            className="w-full max-w-md bg-[#0d111c] border-l border-white/10 h-full p-8 relative flex flex-col justify-between shadow-2xl animate-[slideInRight_0.28s_cubic-bezier(0.16,1,0.3,1)] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <h3 className="text-base font-extrabold text-white uppercase tracking-wider">Live Site Analytics</h3>
                </div>
                <button 
                  onClick={() => setShowAnalyticsDrawer(false)}
                  className="p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 border border-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stats tickers */}
              <div className="space-y-6">
                
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Real-time Visitors</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono animate-pulse">148</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">● LIVE STREAM</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Donations Volume (24h)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono">₹24,500</span>
                    <span className="text-[9px] font-mono text-purple-400 font-bold uppercase">↑ 12% FROM YESTERDAY</span>
                  </div>
                </div>

                {/* SVG Micro chart */}
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Weekly Traffic Curve</span>
                  <div className="h-28 rounded-2xl border border-white/5 bg-black/40 overflow-hidden flex items-end p-2 relative">
                    <svg className="w-full h-full text-purple-500/20" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M 0,30 L 0,25 Q 15,10 30,18 T 60,8 T 90,22 L 100,10 L 100,30 Z" fill="currentColor"></path>
                      <path d="M 0,25 Q 15,10 30,18 T 60,8 T 90,22 L 100,10" fill="none" stroke="#a78bfa" strokeWidth="1.5"></path>
                    </svg>
                    <span className="absolute bottom-2 left-2 text-[8px] font-mono text-zinc-500">MON</span>
                    <span className="absolute bottom-2 right-2 text-[8px] font-mono text-zinc-500">SUN</span>
                  </div>
                </div>

                {/* Simulated activity feeds */}
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Recent Activity Streams</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar text-[10px] font-mono">
                    {[
                      { user: "Guest3902", action: "viewed Water Wells", time: "Just now" },
                      { user: "SuperAdmin", action: "updated audit history", time: "2 min ago" },
                      { user: "Rahul Sharma", action: "logged new UPI pledge", time: "5 min ago" },
                      { user: "PrestigeDonor", action: "sponsored Silver Tier", time: "18 min ago" },
                      { user: "Guest4820", action: "booked meet slot", time: "1 hr ago" }
                    ].map((act, actIdx) => (
                      <div key={actIdx} className="flex justify-between items-center p-2 rounded bg-white/[0.01] border-b border-white/5">
                        <span className="text-zinc-300 font-bold">{act.user}</span>
                        <span className="text-zinc-500">{act.action}</span>
                        <span className="text-purple-400">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-6 border-t border-white/5 text-[9px] font-mono text-zinc-600 leading-relaxed">
              <span>ACTIVE SYSTEM NODE: BANASKANTHA CORE</span>
              <br />
              <span>REFRESH TICKER RATE: 2400MS</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
