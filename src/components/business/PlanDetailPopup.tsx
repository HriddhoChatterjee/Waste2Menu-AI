import React, { useState, useMemo } from 'react';
import { 
  X, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Coins, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Clock, 
  Sliders, 
  Layers, 
  Cpu, 
  ChefHat, 
  Receipt, 
  HeartHandshake, 
  FileText, 
  Check, 
  PhoneCall, 
  Send, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export type PlanTierId = 'starter' | 'enterprise' | 'global';

export interface PlanDetailData {
  id: PlanTierId;
  name: string;
  tagline: string;
  badge?: string;
  price: string;
  usdPrice: string;
  billingFrequency: string;
  targetAudience: string;
  typicalCovers: string;
  typicalScrap: string;
  hardwareSpecs: string;
  setupTime: string;
  slaUptime: string;
  supportChannel: string;
  overviewSummary: string;
  modules: {
    category: string;
    icon: any;
    features: {
      title: string;
      desc: string;
    }[];
  }[];
  implementationTimeline: {
    phase: string;
    title: string;
    desc: string;
  }[];
  roiDefaults: {
    defaultScrapKg: number;
    costSavingPerKg: number;
    portionsPerDay: number;
    ticketPriceINR: number;
    baseSubscriptionINR: number;
  };
}

const PLAN_DETAILS_DATABASE: Record<PlanTierId, PlanDetailData> = {
  starter: {
    id: 'starter',
    name: 'KitchenOS Starter',
    tagline: 'Lightweight AI scrap detection and reverse recipe engineering for standalone kitchens and cloud brands.',
    price: '₹4,999 / mo',
    usdPrice: '($59 / mo)',
    billingFrequency: 'Billed monthly or ₹49,990/year (Get 2 months free)',
    targetAudience: 'Single-location Bistros, Boutique Cafés, Dark Kitchens & Standalone QSRs',
    typicalCovers: '15 – 80 covers / day',
    typicalScrap: '10 – 35 kg scrap / day',
    hardwareSpecs: 'Zero proprietary hardware required. Runs on any iPad, Android tablet, or existing kitchen smartphone via modern browser / PWA.',
    setupTime: '15 minutes DIY self-onboarding',
    slaUptime: '99.5% Cloud Uptime',
    supportChannel: 'Email & WhatsApp Business Support (9:00 AM – 9:00 PM IST)',
    overviewSummary: 'Engineered specifically for independent restaurateurs and chef-owners looking to eliminate raw prep shrinkage and boost daily gross margins without complex IT hardware or heavy capital expenditure.',
    modules: [
      {
        category: 'Cutting-Board Computer Vision',
        icon: Cpu,
        features: [
          {
            title: 'Optical Ingredient Recognition (up to 50 kg/day)',
            desc: 'Real-time classification for 20+ everyday vegetable trimmings, peelings, herb stems, stale bread, and rice surplus.'
          },
          {
            title: 'Web Bluetooth Scale Tare Integration',
            desc: 'Wirelessly auto-syncs weight directly from digital kitchen scales with zero manual keypad entry.'
          },
          {
            title: 'Tactile Audio Ingestion Feedback',
            desc: 'Instant audio chirps acknowledge scrap loggings in noisy commercial kitchens without needing screen glances.'
          }
        ]
      },
      {
        category: 'Reverse Culinary Synthesis',
        icon: ChefHat,
        features: [
          {
            title: 'Algorithmic Dish Matching (45+ Recipes)',
            desc: 'Instantly computes feasible stocks, pestos, chutneys, spiced fritters, and crisps based on exact grams logged.'
          },
          {
            title: 'Dynamic Portion & Cost Scaling',
            desc: 'Calculates exact portion yields and supplementary pantry staple costs (oil, salt, mustard seeds) down to the paisa.'
          },
          {
            title: 'Allergen & Dietary Flagging',
            desc: 'Automatic tagging of vegan, gluten-free, nut-free, and Jain-friendly culinary pathways.'
          }
        ]
      },
      {
        category: 'POS & Counter Automation',
        icon: Receipt,
        features: [
          {
            title: 'Single Terminal POS Push',
            desc: '1-click export to Petpooja, Posist, Square, or instant formatted CSV/JSON menu item import.'
          },
          {
            title: 'Daily Specials Blackboard & QR Creator',
            desc: 'Generates ready-to-print chalkboard layouts and guest QR table-talkers highlighting your zero-waste special.'
          },
          {
            title: 'Recovered Sales Tracker',
            desc: 'Live dashboard recording daily orders and revenue generated strictly from upcycled inventory.'
          }
        ]
      },
      {
        category: 'Community Surplus & Waste Diversion',
        icon: HeartHandshake,
        features: [
          {
            title: 'Local Shelter WhatsApp/SMS Dispatch',
            desc: 'Generates formatted 1-tap donation alerts for nearby verified shelters when unsold portions remain.'
          },
          {
            title: 'Monthly Food Landfill Diversion Ledger',
            desc: 'Automated kilograms diverted counter with printable guest-facing sustainability certificates.'
          }
        ]
      }
    ],
    implementationTimeline: [
      { phase: 'Day 1', title: 'Mount Tablet & Camera Tare', desc: 'Secure existing tablet or phone on cutting board mount and run 2-minute camera calibration.' },
      { phase: 'Day 2', title: 'Configure POS & First Batch', desc: 'Connect single POS terminal and run first morning prep shift scan of vegetable trimmings.' },
      { phase: 'Day 3', title: 'Net Positive Margin Recaptured', desc: 'Serve recovered soup/fritter special to diners; subscription cost typically recouped in under 4 days.' }
    ],
    roiDefaults: {
      defaultScrapKg: 15,
      costSavingPerKg: 55,
      portionsPerDay: 14,
      ticketPriceINR: 140,
      baseSubscriptionINR: 4999
    }
  },

  enterprise: {
    id: 'enterprise',
    name: 'Commercial Enterprise',
    badge: 'Most Popular • Highest ROI',
    tagline: 'Multi-station kitchen intelligence, dynamic flash discounts, executive chef studios, and audit-grade ESG tax packets.',
    price: '₹14,999 / mo',
    usdPrice: '($179 / mo)',
    billingFrequency: 'Billed monthly or ₹1,49,990/year (Includes complimentary on-site chef audit & staff training)',
    targetAudience: '4 & 5-Star Hotels, Luxury Banquets, Fine Dining Venues, Multi-Unit Restaurant Chains (3–15 outlets)',
    typicalCovers: '100 – 600 covers / day per location',
    typicalScrap: '40 – 120 kg scrap / day',
    hardwareSpecs: 'Up to 5 prep station cameras (Butchery, Garde Manger, Bakery), multi-terminal POS integration, Kitchen Display System (KDS) screens.',
    setupTime: '48-hour assisted onboarding with chef consultation',
    slaUptime: '99.9% High-Availability SLA',
    supportChannel: 'Dedicated Culinary Account Manager & 24/7 Priority Phone/WhatsApp Hotline',
    overviewSummary: 'The comprehensive operating system for high-volume commercial kitchens. Coordinates line cooks, executive chefs, and F&B controllers across multiple stations to maximize food yield, generate statutory tax deductions, and fulfill corporate ESG mandates.',
    modules: [
      {
        category: 'Multi-Station Vision Ingestion',
        icon: Cpu,
        features: [
          {
            title: 'Multi-Camera Station Tracking (Unlimited Volume)',
            desc: 'Simultaneous optical tracking across Butcher Station (frames, bones, marrow), Veg Prep (peels, stalks), and Pastry (crusts, egg whites).'
          },
          {
            title: 'Staff Prep Heatmaps & Knife-Skill Benchmarks',
            desc: 'Tracks shrinkage percentages and trim yields by shift and prep cook to isolate training and yield improvement opportunities.'
          },
          {
            title: 'High-Volume Tare & Continuous Stream Processing',
            desc: 'Continuous motion detection supports rapid-fire prep line operations without stopping to press buttons.'
          }
        ]
      },
      {
        category: 'Executive Chef Recipe Authoring Studio',
        icon: ChefHat,
        features: [
          {
            title: 'Proprietary Culinary Formulation Studio',
            desc: 'Executive chefs can author, test, and lock custom upcycling formulas with precise temperature, seasoning, and ratio tolerances.'
          },
          {
            title: 'Banquet & Catering Scaling (Up to 1,000 Portions)',
            desc: 'Algorithmic batch scaling adjusts pan capacity, cooking times, and holding temperatures for large-scale events.'
          },
          {
            title: 'Theoretical vs. Actual Variance Analysis',
            desc: 'Pinpoints exact variances between ingredient purchasing logs and actual kitchen recovery output.'
          }
        ]
      },
      {
        category: 'Dynamic POS Flash Sales & Revenue Capture',
        icon: Receipt,
        features: [
          {
            title: 'Automated 30%–50% Dynamic Flash Discounts',
            desc: 'Automatically discounts recovered specials on POS during late afternoon or evening off-peak windows to clear inventory.'
          },
          {
            title: 'Multi-Terminal & KDS Bidirectional Synchronization',
            desc: 'Live menu item status synced across main dining room, room service, banquet bar, and kitchen display systems.'
          },
          {
            title: 'Aggregator Menu Integration (Swiggy / Zomato / Direct)',
            desc: 'Pushes limited-edition zero-waste daily specials directly to delivery channels via UrbanPiper / POS integrations.'
          }
        ]
      },
      {
        category: 'Statutory Tax Packets & NGO Handover OTP',
        icon: ShieldCheck,
        features: [
          {
            title: 'Tamper-Proof Handover OTP Verification',
            desc: 'Cryptographic 6-digit OTP verified via SMS/WhatsApp ensures surplus food is only delivered to authorized NGO shelter drivers.'
          },
          {
            title: 'Section 80G & CSR Tax Deduction Certificates',
            desc: 'Automatically issues audit-compliant tax deduction documentation for corporate accounting and tax write-offs.'
          },
          {
            title: 'ISO 14001 & UN SDG 12.3 Audit Reports',
            desc: 'Download one-click compliance packets formatted for official third-party environmental sustainability audits.'
          }
        ]
      }
    ],
    implementationTimeline: [
      { phase: 'Week 1', title: 'Hardware Provisioning & Camera Mounts', desc: 'Install prep cameras across butcher, vegetable, and bakery stations; configure role-based accounts.' },
      { phase: 'Week 2', title: 'POS Bidirectional Sync & Chef Studio', desc: 'Sync multi-terminal POS and input house-recipe formulas into the Executive Chef Studio.' },
      { phase: 'Week 3', title: 'NGO Network & Dynamic Flash Sales Go-Live', desc: 'Activate tamper-proof shelter dispatch protocols and schedule off-peak dynamic flash specials.' }
    ],
    roiDefaults: {
      defaultScrapKg: 50,
      costSavingPerKg: 65,
      portionsPerDay: 40,
      ticketPriceINR: 160,
      baseSubscriptionINR: 14999
    }
  },

  global: {
    id: 'global',
    name: 'Institutional & Global',
    badge: 'Enterprise Scale • Multi-Facility',
    tagline: 'Centralized commissary supply chain optimization, industrial edge computing, and corporate Scope 3 GHG accounting.',
    price: 'Custom Enterprise Licensing',
    usdPrice: '(Annual Volume Licensing)',
    billingFrequency: 'Master Services Agreement (MSA) with dedicated engineering team & custom SLA',
    targetAudience: 'Global Hotel Chains (Marriott, Taj, Hilton, Accor), Corporate Tech Campuses, University Dining Halls, Airline Catering & Cruise Fleets',
    typicalCovers: '500 – 5,000+ covers / day across regional clusters',
    typicalScrap: '150 – 500+ kg scrap / day',
    hardwareSpecs: 'Industrial rack-mounted Edge AI micro-servers, zero-latency local area network processing, full enterprise ERP connectors.',
    setupTime: 'Custom enterprise integration sprint with dedicated deployment team',
    slaUptime: '99.99% Enterprise Uptime SLA with Financial Penalties',
    supportChannel: '24/7/365 Dedicated Enterprise Engineering Hotline & Dedicated Slack Connect Channel',
    overviewSummary: 'Designed for enterprise hospitality corporations and centralized commissary supply chains operating dozens of food and beverage facilities. Coordinates cross-facility ingredient redistribution, integrates deeply with SAP and Oracle ERPs, and guarantees zero-latency offline edge inference.',
    modules: [
      {
        category: 'Enterprise ERP & Commissary Connectors',
        icon: Building2,
        features: [
          {
            title: 'Direct Oracle Micros Simphony, Toast & SAP S/4HANA',
            desc: 'Enterprise-grade bidirectional connectors with deep general ledger cost center reconciliation and automated purchase order adjustments.'
          },
          {
            title: 'Centralized Commissary Byproduct Routing',
            desc: 'Cross-facility logistical load balancing routes bulk scraps (e.g. citrus rinds from 10 banquet bars to central bakery for candied zest).'
          },
          {
            title: 'Multi-Unit Master Recipe Synchronization',
            desc: 'Pushes certified sustainable formulas across 50+ kitchens globally with regional ingredient substitution fallbacks.'
          }
        ]
      },
      {
        category: 'Industrial Edge Computing & Offline Continuity',
        icon: Cpu,
        features: [
          {
            title: 'On-Premise Industrial Edge AI Micro-Servers',
            desc: 'Server hardware installed in kitchen racks provides sub-10ms optical vision inference with 100% offline continuity during fiber outages.'
          },
          {
            title: 'Zero Cloud Latency & Local Model Inference',
            desc: 'Vision models execute locally inside kitchen intranet with periodic background synchronization to corporate headquarters.'
          },
          {
            title: 'Air-Gapped & High-Security Network Options',
            desc: 'Compatible with strict corporate IT firewalls, defense facilities, and cruise maritime satellite connections.'
          }
        ]
      },
      {
        category: 'Corporate Scope 3 Carbon & Water Accounting',
        icon: TrendingUp,
        features: [
          {
            title: 'GHG Protocol & SBTi Aligned Carbon Accounting',
            desc: 'Rigorous calculation of avoided methane emissions and embodied food transport carbon credits audited for annual corporate filings.'
          },
          {
            title: 'GRI & BRSR Statutory Sustainability Export',
            desc: 'Instant generation of environmental audit sheets ready for SEBI BRSR, EU CSRD, and SEC climate disclosure compliance.'
          },
          {
            title: 'Facility Water Footprint Conservation Ledger',
            desc: 'Measures virtual water savings preserved by recapturing agricultural and animal protein byproducts.'
          }
        ]
      },
      {
        category: 'Executive Governance & Culinary Director R&D',
        icon: ShieldCheck,
        features: [
          {
            title: 'Dedicated Sustainability Account Director',
            desc: 'Assigned executive culinary consultant conducting quarterly audits, menu engineering reviews, and KPI tracking.'
          },
          {
            title: 'Quarterly Michelin Zero-Waste Masterclasses',
            desc: 'On-site culinary workshops conducted by Michelin-experienced zero-waste master chefs for your culinary brigade.'
          },
          {
            title: 'Enterprise Security: SOC 2 Type II & SAML 2.0 SSO',
            desc: 'Full enterprise identity provider integration with Okta, Azure Active Directory, Ping Identity, and granular RBAC permissions.'
          }
        ]
      }
    ],
    implementationTimeline: [
      { phase: 'Month 1', title: 'Architecture Review & SSO Integration', desc: 'Enterprise security audit, identity provider setup, and SAP/Oracle ERP connector provisioning.' },
      { phase: 'Month 2', title: 'Pilot Commissary Deployment & Edge Hardware', desc: 'Commission industrial edge micro-servers in initial flagship facility and train senior chefs.' },
      { phase: 'Month 3', title: 'Global Multi-Unit Rollout & Board ESG Review', desc: 'Scale deployment across all regional commissary nodes and deliver executive board ESG dashboard.' }
    ],
    roiDefaults: {
      defaultScrapKg: 180,
      costSavingPerKg: 70,
      portionsPerDay: 130,
      ticketPriceINR: 150,
      baseSubscriptionINR: 45000
    }
  }
};

interface PlanDetailPopupProps {
  isOpen: boolean;
  tierId: PlanTierId;
  onClose: () => void;
  onSelectTier: (id: PlanTierId) => void;
}

export const PlanDetailPopup: React.FC<PlanDetailPopupProps> = ({
  isOpen,
  tierId,
  onClose,
  onSelectTier
}) => {
  if (!isOpen) return null;

  const plan = PLAN_DETAILS_DATABASE[tierId] || PLAN_DETAILS_DATABASE.starter;

  // Interactive ROI Simulator State
  const [customScrapKg, setCustomScrapKg] = useState<number>(plan.roiDefaults.defaultScrapKg);

  // Pilot Modal State
  const [isPilotModalOpen, setIsPilotModalOpen] = useState<boolean>(false);
  const [kitchenName, setKitchenName] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [posSystem, setPosSystem] = useState<string>('Petpooja');
  const [pilotSubmitted, setPilotSubmitted] = useState<boolean>(false);
  const [pilotReferenceCode, setPilotReferenceCode] = useState<string>('');
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  // Synchronize simulator default when plan tier changes
  React.useEffect(() => {
    setCustomScrapKg(plan.roiDefaults.defaultScrapKg);
  }, [tierId]);

  // Live ROI Calculations
  const calculatedROI = useMemo(() => {
    const kg = customScrapKg;
    const monthlyAvoidedPurchasing = Math.round(kg * plan.roiDefaults.costSavingPerKg * 30);
    const dailyPortions = Math.max(1, Math.round(kg * (plan.roiDefaults.portionsPerDay / plan.roiDefaults.defaultScrapKg)));
    const monthlySpecialSales = Math.round(dailyPortions * plan.roiDefaults.ticketPriceINR * 30);
    const totalGrossRecaptured = monthlyAvoidedPurchasing + monthlySpecialSales;
    const netProfit = totalGrossRecaptured - plan.roiDefaults.baseSubscriptionINR;
    const multiplier = (netProfit / plan.roiDefaults.baseSubscriptionINR).toFixed(1);
    const dailyRecaptured = totalGrossRecaptured / 30;
    const paybackDays = dailyRecaptured > 0 ? (plan.roiDefaults.baseSubscriptionINR / dailyRecaptured).toFixed(1) : '3.5';

    return {
      monthlyAvoidedPurchasing,
      dailyPortions,
      monthlySpecialSales,
      totalGrossRecaptured,
      netProfit,
      multiplier,
      paybackDays
    };
  }, [customScrapKg, plan]);

  // Handle Download Plan Specification Sheet
  const handleDownloadSpecSheet = () => {
    sounds.playTap();
    const content = `=====================================================
WASTE2MENU COMMERCIAL SPECIFICATION SHEET
Plan Tier: ${plan.name}
${plan.badge ? `Classification: ${plan.badge}\n` : ''}Pricing: ${plan.price} ${plan.usdPrice}
Billing: ${plan.billingFrequency}
Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
=====================================================

1. TARGET AUDIENCE & SCALE
- Target Profile: ${plan.targetAudience}
- Typical Kitchen Volume: ${plan.typicalCovers}
- Daily Scrap Intake: ${plan.typicalScrap}
- Hardware Requirements: ${plan.hardwareSpecs}
- Onboarding Timeframe: ${plan.setupTime}
- Service Level Agreement: ${plan.slaUptime}
- Support Channel: ${plan.supportChannel}

2. OVERVIEW
${plan.overviewSummary}

3. CORE CAPABILITY MODULES
${plan.modules.map(mod => `
--- ${mod.category.toUpperCase()} ---
${mod.features.map(f => `* ${f.title}:\n  ${f.desc}`).join('\n')}
`).join('\n')}

4. IMPLEMENTATION BLUEPRINT
${plan.implementationTimeline.map(step => `* ${step.phase} - ${step.title}:\n  ${step.desc}`).join('\n')}

5. ESTIMATED FINANCIAL ROI & UNIT ECONOMICS
- Baseline Model Volume: ${customScrapKg} kg / day prep scrap
- Monthly Avoided Wholesale Procurement: ₹${calculatedROI.monthlyAvoidedPurchasing.toLocaleString()}
- Monthly Recovered Daily Specials Revenue: ₹${calculatedROI.monthlySpecialSales.toLocaleString()} (${calculatedROI.dailyPortions} portions/day @ ₹${plan.roiDefaults.ticketPriceINR})
- Gross Recaptured Value: ₹${calculatedROI.totalGrossRecaptured.toLocaleString()} / month
- Net Recaptured Profit (After Subscription): ₹${calculatedROI.netProfit.toLocaleString()} / month
- Estimated Net ROI Multiplier: ${calculatedROI.multiplier}x
- Capital Payback Period: < ${calculatedROI.paybackDays} Days

=====================================================
Waste2Menu Technologies Inc. • Enterprise Culinary Sustainability
Website: https://hriddhochatterjee.github.io/Waste2Menu-AI/
=====================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Waste2Menu_${plan.name.replace(/\s+/g, '_')}_SpecSheet.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadFeedback('Specification sheet downloaded!');
    setTimeout(() => setDownloadFeedback(null), 4000);
  };

  // Handle Pilot Booking Submission
  const handlePilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccessChime();
    const code = `W2M-PLT-${Math.floor(1000 + Math.random() * 9000)}`;
    setPilotReferenceCode(code);
    setPilotSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-stone-950/70 backdrop-blur-md flex justify-center items-start p-3 sm:p-6 pt-12 sm:pt-16 pb-16 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#FFFDF9] border-2 border-stone-800 rounded-3xl max-w-4xl w-full p-5 sm:p-9 shadow-2xl relative space-y-7 text-stone-900">
        
        {/* Top Action Bar: Back Button, Plan Switcher Pills, and Close Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="inline-flex items-center space-x-2 text-xs font-heading font-bold text-stone-600 hover:text-stone-900 transition-colors w-fit px-3 py-1.5 rounded-xl hover:bg-stone-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Plans</span>
          </button>

          {/* Quick Plan Switcher Tabs */}
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-stone-100 border border-stone-300 self-center sm:self-auto overflow-x-auto max-w-full">
            {(['starter', 'enterprise', 'global'] as PlanTierId[]).map((tId) => {
              const meta = PLAN_DETAILS_DATABASE[tId];
              const isActive = tId === tierId;
              return (
                <button
                  key={tId}
                  onClick={() => {
                    sounds.playTap();
                    onSelectTier(tId);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/80'
                  }`}
                >
                  <span>{meta.name}</span>
                  {meta.badge && <span className="ml-1 text-[10px] text-emerald-400 font-mono">★</span>}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            title="Close popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Header & Hero Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-stone-900 tracking-tight">
              {plan.name}
            </h2>
            {plan.badge && (
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold shadow-xs">
                {plan.badge}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-mono font-bold border border-stone-300">
              Technical Specification & ROI
            </span>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed font-sans max-w-3xl">
            {plan.tagline}
          </p>

          {/* Pricing Row */}
          <div className="flex flex-wrap items-baseline gap-3 pt-2">
            <span className="text-3xl sm:text-4xl font-heading font-black text-stone-900">
              {plan.price}
            </span>
            <span className="text-sm font-mono font-bold text-stone-500">
              {plan.usdPrice}
            </span>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {plan.billingFrequency}
            </span>
          </div>
        </div>

        {/* Operational Scope & Hardware Grid (4 Badges) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Target Kitchen</span>
            <strong className="text-stone-900 font-bold block text-[11px] leading-tight line-clamp-2">
              {plan.targetAudience}
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Daily Covers</span>
            <strong className="text-stone-900 font-bold block text-[11px]">
              {plan.typicalCovers}
            </strong>
            <span className="text-[10px] text-emerald-700 block">{plan.typicalScrap}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Onboarding & SLA</span>
            <strong className="text-stone-900 font-bold block text-[11px]">
              {plan.setupTime}
            </strong>
            <span className="text-[10px] text-stone-600 block">{plan.slaUptime}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Support & Services</span>
            <strong className="text-stone-900 font-bold block text-[11px] leading-tight line-clamp-2">
              {plan.supportChannel}
            </strong>
          </div>
        </div>

        {/* Interactive Live ROI & Savings Simulator */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 p-5 sm:p-6 rounded-3xl border-2 border-emerald-700/30 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950/10 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-heading font-black text-stone-900">
                  Interactive Kitchen ROI Simulator
                </h3>
                <p className="text-[11px] text-stone-600 font-mono">
                  Slide to calibrate your kitchen's daily prep scrap volume:
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 font-mono">
              <span className="text-xs text-stone-500 font-bold">Estimated Scrap:</span>
              <span className="px-3 py-1 rounded-xl bg-emerald-700 text-white font-mono font-black text-sm shadow-xs">
                {customScrapKg} kg / day
              </span>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="5"
              max="250"
              step="5"
              value={customScrapKg}
              onChange={(e) => {
                setCustomScrapKg(Number(e.target.value));
              }}
              className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-500 font-bold">
              <span>5 kg/day (Micro Café)</span>
              <span>50 kg/day (Busy Bistro / Hotel)</span>
              <span>150 kg/day (Banquet / Commissary)</span>
              <span>250 kg/day (Global Campus)</span>
            </div>
          </div>

          {/* Real-time Computed Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">
                Wholesale Purchasing Saved
              </span>
              <div className="text-xl font-heading font-black text-emerald-700">
                ₹{calculatedROI.monthlyAvoidedPurchasing.toLocaleString()} / mo
              </div>
              <p className="text-[10px] text-stone-500">
                Replaces wholesale raw soup stocks, gravies, and thickening pastes.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">
                Upcycled Specials POS Sales
              </span>
              <div className="text-xl font-heading font-black text-violet-700">
                ₹{calculatedROI.monthlySpecialSales.toLocaleString()} / mo
              </div>
              <p className="text-[10px] text-stone-500">
                ~{calculatedROI.dailyPortions} portions/day @ ₹{plan.roiDefaults.ticketPriceINR} avg guest price.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-900 text-white shadow-xs space-y-1">
              <span className="text-emerald-300 text-[10px] uppercase font-bold block">
                Net Recaptured Profit
              </span>
              <div className="text-xl font-heading font-black text-emerald-200">
                +₹{calculatedROI.netProfit.toLocaleString()} / mo
              </div>
              <p className="text-[10px] text-emerald-300 font-bold">
                {calculatedROI.multiplier}x Net ROI • Payback in &lt; {calculatedROI.paybackDays} days
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Feature Capability Modules (4 Grid Sections) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-black text-stone-900 uppercase tracking-wide">
              Detailed Feature & Architecture Capabilities
            </h3>
            <span className="text-xs font-mono text-stone-500">
              {plan.modules.length} Functional Modules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.modules.map((mod, idx) => {
              const IconComp = mod.icon;
              return (
                <div 
                  key={idx}
                  className="p-4.5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                      <IconComp className="w-4 h-4 text-emerald-700" />
                    </div>
                    <h4 className="font-heading font-bold text-stone-900 text-sm">
                      {mod.category}
                    </h4>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {mod.features.map((feat, fIdx) => (
                      <div key={fIdx} className="space-y-0.5">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat.title}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 pl-5 leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3-Phase Implementation Blueprint */}
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
          <h3 className="text-xs font-heading font-black text-stone-900 uppercase tracking-wide flex items-center space-x-2">
            <Clock className="w-4 h-4 text-stone-700" />
            <span>Implementation & Go-Live Blueprint</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {plan.implementationTimeline.map((step, sIdx) => (
              <div 
                key={sIdx}
                className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5"
              >
                <span className="px-2 py-0.5 rounded bg-stone-900 text-white text-[10px] font-mono font-bold inline-block">
                  {step.phase}
                </span>
                <strong className="block text-stone-900 font-heading font-bold text-xs">
                  {step.title}
                </strong>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Bar: Schedule Pilot & Download Spec Sheet */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sounds.playTap();
                setIsPilotModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Start 14-Day Free Pilot / Request Demo</span>
            </button>

            <button
              onClick={handleDownloadSpecSheet}
              className="px-4 py-3 rounded-2xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-heading font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
              title="Download full technical specification sheet"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Spec Sheet</span>
            </button>
          </div>

          {downloadFeedback && (
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 animate-in fade-in">
              {downloadFeedback}
            </span>
          )}

          <span className="text-[11px] font-mono text-stone-500">
            No credit card required for 14-day commercial trial.
          </span>
        </div>

      </div>

      {/* Pilot Booking / Demo Request Sub-Modal */}
      {isPilotModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in zoom-in-95">
          <div className="bg-[#FFFDF9] border-2 border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-4">
            
            <button
              onClick={() => {
                sounds.playTap();
                setIsPilotModalOpen(false);
                setPilotSubmitted(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {!pilotSubmitted ? (
              <form onSubmit={handlePilotSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Pilot Application • {plan.name}</span>
                  </div>
                  <h3 className="text-xl font-heading font-black text-stone-900">
                    Schedule Your 14-Day Free Pilot
                  </h3>
                  <p className="text-xs text-stone-600">
                    Our Culinary Solutions Director will reach out within 4 business hours to ship your welcome scanner kit and schedule onboarding.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Kitchen / Restaurant Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Olive Bistro & Terrace"
                      value={kitchenName}
                      onChange={(e) => setKitchenName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden font-sans text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="Chef or Manager Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden font-sans text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Business Email / Phone *</label>
                      <input
                        type="text"
                        required
                        placeholder="chef@restaurant.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden font-sans text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Primary POS System</label>
                    <select
                      value={posSystem}
                      onChange={(e) => setPosSystem(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden font-sans text-xs bg-white"
                    >
                      <option value="Petpooja">Petpooja POS</option>
                      <option value="Posist">Posist (Restroworks)</option>
                      <option value="Oracle Micros">Oracle Micros Simphony</option>
                      <option value="Toast">Toast POS</option>
                      <option value="Square">Square Restaurant POS</option>
                      <option value="Other">Other / Standalone Billing</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsPilotModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-transform active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Pilot Request</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-xs">
                  <Check className="w-8 h-8 text-emerald-700" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-heading font-black text-stone-900">
                    Pilot Request Confirmed!
                  </h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-stone-900">{contactName || 'Partner'}</strong>! We have received your pilot enrollment for <strong className="text-stone-900">{kitchenName || 'your kitchen'}</strong> under the <strong className="text-emerald-700">{plan.name}</strong> tier.
                  </p>
                </div>

                <div className="p-3 bg-stone-100 rounded-xl border border-stone-300 max-w-xs mx-auto text-xs font-mono">
                  <span className="text-stone-500 uppercase text-[10px] block">Reference Ticket</span>
                  <span className="font-black text-stone-900 text-sm">#{pilotReferenceCode}</span>
                </div>

                <p className="text-[11px] text-stone-500">
                  Our Culinary Solutions Specialist will connect via email/WhatsApp within 4 hours.
                </p>

                <button
                  onClick={() => {
                    sounds.playTap();
                    setIsPilotModalOpen(false);
                    setPilotSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
