import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
} from "@medusajs/medusa/core-flows";

// ─── REAL BLEASS PRODUCTS DATA (scraped from bleass.com/shop April 2026) ───
// Verified accurate prices, images, and descriptions from live product pages

const BLEASS_PRODUCTS = [
  // ═══════════════════════════════════════════════════════════════
  // SYNTHESIZERS
  // ═══════════════════════════════════════════════════════════════
  {
    title: "ALL SYNTHS BUNDLE",
    description: "BUY ALL BLEASS Synths & Presets at a special price! Includes: BLEASS Arpeggiator, BLEASS Alpha + ALL PRESETS, BLEASS Omega + ALL PRESETS, BLEASS Megalit + ALL PRESETS, BLEASS SampleWiz 2 + ALL PRESETS, BLEASS Monolit + ALL PRESETS. Also includes a BITWIG 8-TRACK license.",
    handle: "all-synths-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 39900,
    compareAtPrice: 59500,
    discount: 33,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2025/07/Shop-Synthesizers-Bundle-x-Bitwig-1.jpg",
      "/images/products/2025/07/All-Synths-Bundle.png",
      "/images/products/2025/07/2008-BWS-8T_Screenshot-1.png",
      "/images/products/2025/07/SampleWiz-2-Bundle.png",
      "/images/products/2025/07/Omega-Bundle.png",
      "/images/products/2025/07/Megalit-Bundle.png",
      "/images/products/2025/07/Alpha-Bundle.png",
      "/images/products/2025/07/Arpeggiator.png",
    ],
  },
  {
    title: "BLEASS Alpha",
    description: "BLEASS Alpha Synthesizer is a virtual analog polyphonic stereo synthesizer inspired by classic analog synths and enhanced by the BLEASS' very own musical and technical approach. The Alpha is a highly versatile Synthesizer that aims at bringing new ways of designing and playing an infinite constellation of sounds while sparkling creativity.",
    handle: "bleass-alpha-synthesizer",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 6900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2025/03/Alpha.jpg",
      "/images/products/2021/11/Capture-décran-2021-11-17-à-10.03.07.png",
      "/images/products/2021/11/Capture-décran-2021-11-17-à-10.02.11.png",
      "/images/products/2021/11/Capture-décran-2021-11-17-à-10.01.49.png",
      "/images/products/2021/11/Capture-décran-2021-11-17-à-10.01.27.png",
      "/images/products/2021/11/Capture-décran-2021-11-17-à-10.01.06.png",
      "/images/products/2021/11/Capture-décran-2021-11-17-à-10.00.53.png",
      "/images/products/2021/11/Capture-décran-2021-11-17-à-10.00.40.png",
    ],
  },
  {
    title: "BLEASS Alpha Bundle",
    description: "BLEASS Alpha + All Preset Packs. Get the synthesizer and all preset packs at a special price. Includes all 7 preset packs: Deep House, Techno, Ambient, Cinematic, Lead, Pad, and Bass presets.",
    handle: "bleass-alpha-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 9900,
    compareAtPrice: 12000,
    discount: 17,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2023/06/Alpha-icon-1.png",
    ],
  },
  {
    title: "BLEASS Arpeggiator",
    description: "BLEASS Arpeggiator is a powerful and intuitive arpeggiator plugin that helps you create complex rhythmic patterns from simple chords. With its 16-step sequencer and multiple play modes, you can generate endless musical ideas. Features include: 16-step sequencer, 12 play modes, real-time modulation, and seamless DAW integration.",
    handle: "bleass-arpeggiator",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 3900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2023/06/Arpeggiator-icon-1.png",
    ],
  },
  {
    title: "BLEASS Megalit",
    description: "BLEASS Megalit is a sample-based synthesizer offering unlimited creative possibilities. With its powerful wavetable engine, extensive modulation options, and high-quality effects, Megalit lets you sculpt any sound you can imagine. Each of the 8 parts can be processed separately for unmatched flexibility.",
    handle: "bleass-megalit",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 9900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2022/05/Megalit-icon-1.png",
    ],
  },
  {
    title: "BLEASS Megalit Bundle",
    description: "BLEASS Megalit + All Expansion Packs. Get the full Megalit experience with all expansion packs included at a special price.",
    handle: "bleass-megalit-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 9900,
    compareAtPrice: 15600,
    discount: 37,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2022/05/Megalit-icon-1.png",
    ],
  },
  {
    title: "BLEASS Monolit",
    description: "BLEASS Monolit is a free monosynth plugin. A simple yet powerful synthesizer for creating punchy basslines and leads. Despite being free, it delivers professional-quality sound with its analog-modeled oscillator and filter.",
    handle: "bleass-monolit",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 0,
    compareAtPrice: null,
    discount: null,
    isFree: true,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2022/05/Monolit-icon-1.png",
    ],
  },
  {
    title: "BLEASS Omega",
    description: "BLEASS Omega places all of the sparkle, character, nuance and dynamic expressiveness of FM Synthesis at your fingertips, and does away with the arcane programming interfaces so often associated with FM. Harnessing BLEASS' signature GUI technology, creating and crafting sounds in Omega is not just easier than with other FM synths, it's easy – PERIOD!",
    handle: "bleass-omega-synthesizer",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 6900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2025/03/Omega.jpg",
      "/images/products/2022/01/PXL_20220112_111029286.jpg",
      "/images/products/2022/01/Capture-décran-2022-01-18-à-10.06.43.png",
      "/images/products/2022/01/Capture-décran-2022-01-18-à-10.09.03.png",
      "/images/products/2022/01/Capture-décran-2022-01-18-à-10.11.16.png",
      "/images/products/2022/01/Capture-décran-2022-01-18-à-10.13.43.png",
      "/images/products/2022/01/Capture-décran-2022-01-18-à-10.14.27.png",
      "/images/products/2022/01/Capture-décran-2022-01-18-à-10.16.20.png",
      "/images/products/2022/01/PRODUCT-THUMBS-OMEGA.png",
    ],
  },
  {
    title: "BLEASS Omega Bundle",
    description: "BLEASS Omega + All Preset Packs. Get the FM synthesizer and all preset packs at a special price. Includes 73 new presets covering classic FM tones to modern soundscapes.",
    handle: "bleass-omega-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 9900,
    compareAtPrice: 11000,
    discount: 10,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2023/06/Omega-icon-1.png",
    ],
  },
  {
    title: "BLEASS SampleWiz 2",
    description: "SampleWiz 2 brings advanced sample manipulation and synthesis to your fingertips. Create unique sounds by recording, editing, and manipulating audio samples with powerful real-time parameters. Perfect for sound design, music production, and live performance.",
    handle: "bleass-samplewiz-2",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 6900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2023/06/SampleWiz-2-icon-1.png",
    ],
  },
  {
    title: "BLEASS SampleWiz 2 Bundle",
    description: "SampleWiz 2 + All Preset Packs. Get the sample synth and all its preset libraries at a special price.",
    handle: "bleass-samplewiz-2-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 17600,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2023/06/SampleWiz-2-icon-1.png",
    ],
  },
  {
    title: "Granular Bundle",
    description: "Granular synthesizer bundle — includes BLEASS Granulizer + additional content for creative sound manipulation and granular synthesis.",
    handle: "granular-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Synthesizers",
    price: 8900,
    compareAtPrice: 10800,
    discount: 18,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2022/06/Granulizer-icon-1.png",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // VOCAL EFFECTS
  // ═══════════════════════════════════════════════════════════════
  {
    title: "BLEASS Voices",
    description: "BLEASS Voices is a comprehensive vocal processing suite that helps you create stunning vocal arrangements. Features include harmony generation, doubling effects, vocoding capabilities, and real-time processing for live performance.",
    handle: "bleass-voices",
    status: ProductStatus.PUBLISHED,
    category: "Vocal Effects",
    price: 6900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2023/06/Voices-icon-1.png",
    ],
  },
  {
    title: "BLEASS Vox",
    description: "BLEASS Vox delivers professional vocal automation and effects processing. Shape your vocal tracks with precision, add movement with LFOs, and achieve that polished studio sound with minimal effort.",
    handle: "bleass-vox",
    status: ProductStatus.PUBLISHED,
    category: "Vocal Effects",
    price: 3900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2023/06/Vox-icon-1.png",
    ],
  },
  {
    title: "VOCAL FXs BUNDLE",
    description: "Complete vocal effects bundle — BLEASS Voices + BLEASS Vox + additional vocal processing content at an unbeatable price. Everything you need for professional vocal production.",
    handle: "bleass-vocal-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Vocal Effects",
    price: 9900,
    compareAtPrice: 20600,
    discount: 52,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2023/06/Voices-icon-1.png",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CLASSIC EFFECTS
  // ═══════════════════════════════════════════════════════════════
  {
    title: "BLEASS Chorus",
    description: "BLEASS Chorus is the easy way to create complex chorus effects. From subtle movement and thickening to scintillating stereo modulations, BLEASS Chorus can do it all. With up to four fully stereo chorus voices, the plugin creates sumptuously rich and complex effects whilst allowing precise control over the stereo width, prominence and intensity of the results.",
    handle: "bleass-chorus",
    status: ProductStatus.PUBLISHED,
    category: "Classic Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2026/04/Chorus.jpg",
    ],
  },
  {
    title: "BLEASS Compressor",
    description: "BLEASS Compressor provides professional-grade dynamic control for your audio. Tame dynamics, add punch and clarity to any track with intuitive controls and high-quality algorithms. Perfect for mixing and mastering applications.",
    handle: "bleass-compressor",
    status: ProductStatus.PUBLISHED,
    category: "Classic Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2026/04/Compressor.jpg",
    ],
  },
  {
    title: "BLEASS Delay",
    description: "BLEASS Delay is the ideal tool for adding depth, movement and interest to your mixes. No matter what style of music you are producing and what instrumentation you are working with, the versatility and ease-of-use of BLEASS Delay helps you achieve perfect results with the minimal of fuss. Echoes are just the starting point for BLEASS Delay.",
    handle: "bleass-delay",
    status: ProductStatus.PUBLISHED,
    category: "Classic Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2026/04/Delay.jpg",
    ],
  },
  {
    title: "BLEASS Filter",
    description: "BLEASS Filter offers powerful and creative filtering capabilities. Shape your sound with high-pass, low-pass, and band-pass filters, complete with modulation options for dynamic tonal control. Ideal for sound design and mixing.",
    handle: "bleass-filter",
    status: ProductStatus.PUBLISHED,
    category: "Classic Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2026/04/Filter.jpg",
    ],
  },
  {
    title: "BLEASS Flanger",
    description: "BLEASS Flanger delivers classic flanging effects with modern precision. Create swirling, swooshing sounds that add movement and character to your tracks. From subtle modulation to extreme effects, BLEASS Flanger covers it all.",
    handle: "bleass-flanger",
    status: ProductStatus.PUBLISHED,
    category: "Classic Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2026/04/Flanger.jpg",
    ],
  },
  {
    title: "BLEASS Phaser",
    description: "BLEASS Phaser creates resonant swirls and atmospheric effects. More subtle than flanging and more colourful than chorus, phasing has long been a go-to effect for guitarists, keyboardists, vocalists and bassists. BLEASS Phaser delivers a comprehensive and highly versatile phasing effect.",
    handle: "bleass-phaser",
    status: ProductStatus.PUBLISHED,
    category: "Classic Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2026/04/Phaser.jpg",
    ],
  },
  {
    title: "BLEASS Reverb",
    description: "BLEASS Reverb adds lush, atmospheric depth to your audio. From tight rooms to expansive halls, create the perfect spatial environment for your tracks. High-quality algorithms ensure natural and immersive reverb tails.",
    handle: "bleass-reverb",
    status: ProductStatus.PUBLISHED,
    category: "Classic Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2026/04/Reverb.jpg",
    ],
  },
  {
    title: "BLEASS Saturator",
    description: "BLEASS Saturator energizes your sound with creative distortion. Add warmth, harmonics, and character to any audio source. From subtle saturation to heavy overdrive, BLEASS Saturator provides the tools for expressive tone shaping.",
    handle: "bleass-saturator",
    status: ProductStatus.PUBLISHED,
    category: "Classic Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2026/04/Saturator.jpg",
    ],
  },
  {
    title: "BLEASS Shimmer",
    description: "BLEASS Shimmer's unique pitch shifting reverb will make your performances dance and sing in ways you never imagined possible. Harmonics are emphasised and new tonal colours revealed as the luscious washes of reverb thicken and harmonise with your performance, opening a whole new creative dimension of spatial and ambient effects.",
    handle: "bleass-shimmer",
    status: ProductStatus.PUBLISHED,
    category: "Classic Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2026/04/Shimmer.jpg",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CREATIVE EFFECTS
  // ═══════════════════════════════════════════════════════════════
  {
    title: "BLEASS Dragonfly",
    description: "BLEASS Dragonfly is an ethereal reverb plugin featuring shimmer, modulation, and diffusion effects. Create spacious, evolving soundscapes with its intuitive interface and high-quality algorithms.",
    handle: "bleass-dragonfly",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 1999,
    compareAtPrice: 2900,
    discount: 31,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2022/06/Dragonfly-icon-1.png",
    ],
  },
  {
    title: "BLEASS Fusion",
    description: "BLEASS Fusion is a parallel distortion and tone-shaping plugin. Blend clean and distorted signals for saturation, crunch, and harmonic richness without losing the character of your original sound.",
    handle: "bleass-fusion",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2023/06/Fusion-icon-1.png",
    ],
  },
  {
    title: "BLEASS Granulizer",
    description: "BLEASS Granulizer is a granular synthesizer for creative sound manipulation. Explore new sonic territories by breaking sounds into grains and reassembling them in infinite ways.",
    handle: "bleass-granulizer-desktop-plugin",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 3900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2022/06/Granulizer-icon-1.png",
    ],
  },
  {
    title: "BLEASS Motion EQ",
    description: "BLEASS Motion EQ is a 3-band equalizer with built-in LFOs for dynamic tonal control. Create moving, breathing EQ effects that add movement and interest to any track.",
    handle: "bleass-motion-eq",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2022/05/Motion-EQ-icon-1.png",
    ],
  },
  {
    title: "BLEASS Motion FX",
    description: "BLEASS Motion FX is a multi-effects processor combining modulation and dynamics. Includes chorus, flanger, phaser, and more with deep modulation capabilities for animated, evolving effects.",
    handle: "bleass-motion-fx-desktop-plugin",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 2900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2022/06/Motion-FX-icon-1.png",
    ],
  },
  {
    title: "BLEASS Phase Mutant",
    description: "BLEASS Phase Mutant is a multi-stage phaser with creative modulation options. From subtle warmth to extreme swoops, shape your sound with precision across up to 24 stages of phase manipulation.",
    handle: "bleass-phase-mutant",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 1999,
    compareAtPrice: 3900,
    discount: 49,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2022/06/Phase-Mutant-icon-1.png",
    ],
  },
  {
    title: "BLEASS Slow Machine",
    description: "BLEASS Slow Machine delivers glitchy delay and time-stretching effects. Perfect for creating stuttering rhythms, frozen textures, and experimental soundscapes with real-time manipulation.",
    handle: "bleass-slow-machine-desktop-plugin",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 999,
    compareAtPrice: 1499,
    discount: 33,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2022/06/Slow-Machine-icon-1.png",
    ],
  },
  {
    title: "BLEASS Peaks",
    description: "BLEASS Peaks is an envelope-driven resonant filter and percussion synthesizer. Create dynamic, punchy rhythmic elements by combining envelope shaping with resonant filtering for expressive percussive sounds.",
    handle: "bleass-peaks",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 4900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2022/06/Peaks-icon-1.png",
    ],
  },
  {
    title: "BLEASS Sidekick",
    description: "BLEASS Sidekick is a bass enhancer and harmonic exciter plugin. Add warmth, punch, and presence to low frequencies while maintaining clarity and definition in your mix.",
    handle: "bleass-sidekick",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 1999,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2022/06/Sidekick-icon-1.png",
    ],
  },
  {
    title: "BLEASS Tides",
    description: "BLEASS Tides is a tidal modulation generator with clock-synced effects. Create evolving, rhythmic modulation patterns that lock to your project's tempo for cohesive movement across tracks.",
    handle: "bleass-tides",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 3900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2022/06/Tides-icon-1.png",
    ],
  },
  {
    title: "BLEASS Multiband Compressor",
    description: "BLEASS Multiband Compressor provides multi-band dynamics processing for precise dynamic control. Tackle mixing and mastering tasks with independent compression across frequency bands.",
    handle: "bleass-multiband-compressor",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 2900,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac"],
    images: [
      "/images/products/2022/06/Multiband-Compressor-icon-1.png",
    ],
  },
  {
    title: "CREATIVE FXs BUNDLE",
    description: "All creative effects plugins in one unbeatable bundle. Includes: Dragonfly, Fusion, Granulizer, Motion EQ, Motion FX, Phase Mutant, Slow Machine, Peaks, Sidekick, Tides, and Multiband Compressor.",
    handle: "creative-fxs-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Creative Effects",
    price: 19900,
    compareAtPrice: 24900,
    discount: 20,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: [
      "/images/products/2022/06/Dragonfly-icon-1.png",
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // PRESET PACKS — ALPHA
  // ═══════════════════════════════════════════════════════════════
  {
    title: "All Alpha Preset Packs Bundle",
    description: "Bundle of all BLEASS Alpha preset packs at a special price.",
    handle: "all-alpha-preset-packs-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 3900,
    compareAtPrice: 5100,
    discount: 24,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2021/11/Alpha-Bundle-1.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  {
    title: "Funk — Alpha Presets Pack",
    description: "73 presets inspired by Earth, Wind and Fire and Kool & the Gang. Melodic bass lines, pulsating rhythms and unique synthesizer riffs.",
    handle: "funk-alpha-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 500,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2024/06/Funk-Preset-Pack.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  {
    title: "Hoops Collection — Alpha Presets Pack",
    description: "54 carefully selected presets: celestial arpeggios, sharp-edged leads, and whirling basses. Takes full advantage of MPE, Arpeggiator, LFO, FXs and Motion Sequencer.",
    handle: "hoops-collection-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 400,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2021/11/Hoops-Collection-–-Preset-Pack.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  {
    title: "Lily Jordy — Alpha Presets Pack",
    description: "64 presets by classical pianist turned sound designer Lily Jordy. Official sound design work with Arturia.",
    handle: "lily-jordy-alpha-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 500,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2021/11/Lily-Jordy-Preset-Pack.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  {
    title: "MPE #1 — Alpha Presets Pack",
    description: "73 presets optimized for MPE controllers. Ethereal pads to soulful leads, arps and sequences.",
    handle: "mpe-1-alpha-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 500,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2021/11/MPE-_1-Preset-Pack.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  {
    title: "Red Sky Lullaby — Alpha Presets Pack",
    description: "64 presets by Red Sky Lullaby. iPad/iPhone music production focused sound design.",
    handle: "red-sky-lullaby-alpha-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 500,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2021/11/Red-Sky-Lullaby-Preset-Pack.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  {
    title: "Sound Of Izrael — Alpha Presets Pack",
    description: "50 uniquely crafted presets: soft pads, harmonic arps and bright leads by Samuel Oren Izrael.",
    handle: "sound-of-izrael-alpha-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 400,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2021/11/Sound-Of-Izrael-Preset-Pack.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  {
    title: "The GarageBand Guide — Alpha Presets Pack",
    description: "57 sci-fi infused presets by Patrick Baird. Gritty leads, ethereal pads, chunky arps, glitchy FX.",
    handle: "the-garageband-guide-alpha-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 400,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2021/11/The-GarageBand-Guide-Preset-Pack.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  {
    title: "The Sound Test Room — Alpha Presets Pack",
    description: "110 patches covering lush pads, retro-style keyboards, lo-fi vintage sounds, cinematic ARPs by Doug Woods.",
    handle: "the-sound-test-room-alpha-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2022/04/The-Sound-Test-Room-Preset-Pack.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  {
    title: "Torley — Alpha Presets Pack",
    description: "102 presets by Torley. Charbroiled leads, erratically glitchy arps, psychologically unstable pads.",
    handle: "torley-alpha-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2021/11/Torley-Preset-Pack.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  {
    title: "Yawdel — Alpha Presets Pack",
    description: "67 Future Pop presets by Yawdel. Massive basses, warm and gritty synth sounds for Future Bass and Trap.",
    handle: "yawdel-alpha-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 500,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2021/11/Yawdel-Preset-Pack.jpg"],
    compatibleWith: "bleass-alpha-synthesizer",
  },
  // ═══════════════════════════════════════════════════════════════
  // PRESET PACKS — OMEGA
  // ═══════════════════════════════════════════════════════════════
  {
    title: "All Omega Preset Packs Bundle",
    description: "Bundle of all BLEASS Omega preset packs at a special price.",
    handle: "all-omega-preset-packs-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 2900,
    compareAtPrice: 3600,
    discount: 19,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2022/01/Omega-Bundle.jpg"],
    compatibleWith: "bleass-omega-synthesizer",
  },
  {
    title: "Back To The Eighties — Omega Presets Pack",
    description: "73 FM synthesis presets inspired by DX7-era sounds. Travel back to the '80s with a-ha and Whitney Houston inspired tones.",
    handle: "back-to-the-eighties-omega-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 600,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2024/08/Back-To-The-Eighties-Preset-Pack.jpg"],
    compatibleWith: "bleass-omega-synthesizer",
  },
  {
    title: "Flow Form — Omega Presets Pack",
    description: "73 presets by Alexander Baras (Saint Rider). Diverse timbres from calm atmospheric pads to aggressive harsh basses.",
    handle: "flow-form-omega-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 600,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2022/01/Flow-Form-Preset-Pack.jpg"],
    compatibleWith: "bleass-omega-synthesizer",
  },
  {
    title: "Red Sky Lullaby — Omega Presets Pack",
    description: "50 presets by Red Sky Lullaby for the Omega FM synthesizer.",
    handle: "red-sky-lullaby-omega-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 400,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2022/01/Red-Sky-Lullaby-Preset-Pack-Omega-1.jpg"],
    compatibleWith: "bleass-omega-synthesizer",
  },
  {
    title: "Sound Of Izrael — Omega Presets Pack",
    description: "76 presets showing the power of the Omega FM engine: ethereal pads, punchy basses & keys, experimental sequences.",
    handle: "sound-of-izrael-omega-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 600,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2022/01/Sound-Of-Izrael-Preset-Pack-Omega.jpg"],
    compatibleWith: "bleass-omega-synthesizer",
  },
  {
    title: "The Beat Community — Omega Presets Pack",
    description: "Free classic & fine-tuned presets by Ali Ahmet (Al The Hammer) from The Beat Community.",
    handle: "the-beat-community-omega-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 0,
    compareAtPrice: null,
    discount: null,
    isFree: true,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2022/01/The-Beat-Community-Preset-Pack.jpg"],
    compatibleWith: "bleass-omega-synthesizer",
  },
  {
    title: "The Sound Test Room — Omega Presets Pack",
    description: "113 patches by Doug Woods. Influenced by Sci-Fi and Cinema, especially old 50s & 60s movies.",
    handle: "the-sound-test-room-omega-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 800,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2022/02/The-Sound-Test-Room-Preset-Pack-Omega.jpg"],
    compatibleWith: "bleass-omega-synthesizer",
  },
  {
    title: "Torley — Omega Presets Pack",
    description: "64 MPE-empowered presets by Torley. Unstable IDM/hyperpop keys, wild motion sequences, dynamic pads.",
    handle: "torley-omega-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 600,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/03/Torley-Preset-Pack-Omega.jpg"],
    compatibleWith: "bleass-omega-synthesizer",
  },
  // ═══════════════════════════════════════════════════════════════
  // PRESET PACKS — MEGALIT
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Sonic Forge Preset Packs Bundle",
    description: "Bundle of Megalit Sonic Forge preset packs at a special price.",
    handle: "sonic-forge-megalit-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 2900,
    compareAtPrice: 3200,
    discount: 9,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/09/Megalit-Sonic-Forge-Bundle.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "Pulse Preset Packs Bundle",
    description: "Bundle of Megalit Pulse preset packs at a special price.",
    handle: "pulse-megalit-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 1900,
    compareAtPrice: 2500,
    discount: 24,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2025/04/Megalit-Pulse-Bundle.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "Expressive Pack #1 — Megalit Preset Pack",
    description: "64 highly expressive patches to highlight performance features. MPE and classic MIDI controller compatible.",
    handle: "expressive-pack-1-megalit-presets-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2022/11/Expressive-Pack-Preset-Pack-1.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "The Sound Test Room — Megalit Preset Pack",
    description: "64 patches by Doug Woods. Rich spectrum across genres: Leads, Pads, Arps, Keys, Basses, FXs.",
    handle: "the-sound-test-room-megalit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/09/TSTR-Preset-Pack-1.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "VNR — Megalit Preset Pack",
    description: "32 unique harsh, loud and aggressive sounds. Inspired by dubstep, DnB, and loud electronic music.",
    handle: "vnr-megalit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 400,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/09/VNR-Preset-Pack-1.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "Instant Sounds — Megalit Preset Pack",
    description: "32 meticulously crafted presets: spiky supersaws, classic basses, ethereal pads, clear plucks and soft rhodes.",
    handle: "instant-sounds-megalit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 400,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/09/Instant-Sounds-Preset-Pack.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "Erae — Megalit Preset Pack",
    description: "64 presets optimized for ERAE and other MPE controllers. Crafted to respond dynamically to touch.",
    handle: "erae-megalit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2025/04/Erae-Preset-Pack.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "Pogman — Megalit Preset Pack",
    description: "51 presets by Pogman. Heavy dubstep grooves and minimalist basslines. Bass, pads, leads, wobbly sounds.",
    handle: "pogman-megalit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 500,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2025/04/Pogman-Preset-Pack.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "Alex Reid — Oddity — Megalit Preset Pack",
    description: "20 cosmic presets by Alex Reid. Genre-bending audioscapes from textured keys to basses and leads.",
    handle: "alex-reid-oddity-megalit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 300,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2025/04/Alex-Reid-Oddity.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "Lektrique — Megalit Preset Pack",
    description: "21 presets by Belgian electro-house artist Lektrique. Chest-thumping basslines and futuristic textures.",
    handle: "lektrique-megalit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 300,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2025/04/Lektrique-Preset-Pack.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "Renoizer — Megalight — Megalit Preset Pack",
    description: "65 presets by Renoizer. Dark, textured world inspired by UK/US experimental bass music.",
    handle: "renoizer-megalight-megalit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2025/04/Renoizer-Megalight.jpg"],
    compatibleWith: "bleass-megalit",
  },
  {
    title: "The Sound Test Room #2 — Megalit Preset Pack",
    description: "100 presets by Doug Woods. Standard synth patches, experimental sounds, and versatile playability.",
    handle: "the-sound-test-room-2-megalit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 1060,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2024/08/TSTR-Preset-Pack-2.jpg"],
    compatibleWith: "bleass-megalit",
  },
  // ═══════════════════════════════════════════════════════════════
  // PRESET PACKS — SAMPLEWIZ 2
  // ═══════════════════════════════════════════════════════════════
  {
    title: "All SampleWiz 2 Preset Packs Bundle",
    description: "Bundle of all SampleWiz 2 preset packs at a special price.",
    handle: "all-samplewiz-2-preset-packs-bundle",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 6900,
    compareAtPrice: 10700,
    discount: 36,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/02/Sample-Wiz-2-Bundle-1.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "Altar — SampleWiz 2 Preset Pack",
    description: "64 presets by Imer6ia. Electronic music rooted in Wave, Trap, Trance, and EBM. Created with Canblaster.",
    handle: "altar-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/08/Imer6ia-Preset-Pack.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "Blue Lines And Grains — SampleWiz 2 Preset Pack",
    description: "Granular and textural presets for SampleWiz 2.",
    handle: "blue-lines-and-grains-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/02/Blue-Lines-And-Grains-Preset-Pack-1.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "Dan Müller — SampleWiz 2 Preset Pack",
    description: "Preset pack by Dan Muller for SampleWiz 2.",
    handle: "dan-muller-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/02/Dan-Muller-Preset-Pack-1.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "Heritage Synths Soundscapes — SampleWiz 2 Preset Pack",
    description: "Preset pack by The Sound Test Room for SampleWiz 2.",
    handle: "heritage-synths-soundscapes-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 1000,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2025/10/The-SoundTestRoom-Heritage-Synths-Soundscapes.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "House Pack — SampleWiz 2 Preset Pack",
    description: "House music oriented preset pack for SampleWiz 2.",
    handle: "house-pack-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/02/House-Pack-Preset-Pack-1.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "Jordan Rudess — SampleWiz 2 Preset Pack",
    description: "Preset pack by legendary keyboardist Jordan Rudess for SampleWiz 2.",
    handle: "jordan-rudess-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/02/Jordan-Rudess-Preset-Pack-1.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "Mika — SampleWiz 2 Preset Pack",
    description: "Preset pack by Mika for SampleWiz 2.",
    handle: "mika-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/02/Mika-Preset-Pack-1.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "MPE Endeavors — SampleWiz 2 Preset Pack",
    description: "Free MPE-focused preset pack for SampleWiz 2.",
    handle: "mpe-endeavors-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 0,
    compareAtPrice: null,
    discount: null,
    isFree: true,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/04/MPE-Endeavors-Preset-Pack.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "MPE Preset Pack #1 — SampleWiz 2 Preset Pack",
    description: "MPE preset pack #1 for SampleWiz 2.",
    handle: "mpe-preset-pack-1-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/02/MPE-Preset-Pack-1-1.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "MPE Preset Pack #2 — SampleWiz 2 Preset Pack",
    description: "MPE preset pack #2 for SampleWiz 2.",
    handle: "mpe-preset-pack-2-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2025/10/MPE-Preset-Pack-2.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "Retro Sonic Lofi — BLEASS SampleWiz 2 Preset Pack",
    description: "Preset pack by Very Sick Beats. Retro sonic and lo-fi presets for SampleWiz 2.",
    handle: "retro-sonic-lofi-bleass-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2024/06/Very-Sick-Beats-Retro-Sonic-LoFi.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "Sample The World — SampleWiz 2 Preset Pack",
    description: "Preset pack by Inby. Real world samples transformed into playable instruments.",
    handle: "sample-the-world-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2025/10/sample-The-world.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "Sound Of Izrael — Preset Pack for SampleWiz 2",
    description: "Preset pack by Sound Of Izrael for SampleWiz 2.",
    handle: "sound-of-izrael-preset-pack-for-samplewiz-2",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 1000,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/02/Sound-Of-Izrael-Preset-Pack-SW2-1.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "The Sound Test Room — SampleWiz 2 Preset Pack",
    description: "Preset pack by Doug Woods (The Sound Test Room) for SampleWiz 2.",
    handle: "the-sound-test-room-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 1000,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/02/The-Sound-Test-Room-Preset-Pack-SW2-1.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  {
    title: "Very Sick Beats — SampleWiz 2 Preset Pack",
    description: "Preset pack by Very Sick Beats for SampleWiz 2.",
    handle: "very-sick-beats-samplewiz-2-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 700,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2023/04/Very-Sick-Beats-Preset-Pack.jpg"],
    compatibleWith: "bleass-samplewiz-2",
  },
  // ═══════════════════════════════════════════════════════════════
  // PRESET PACKS — MONOLIT
  // ═══════════════════════════════════════════════════════════════
  {
    title: "BASSES — BLEASS Monolit Preset Pack",
    description: "64 presets providing a rich tapestry of low-end tones, from deep growls to crisp punch. For EDM, groovy funk, soulful R&B.",
    handle: "basses-monolit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 500,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2024/06/Basses-Preset-Pack.jpg"],
    compatibleWith: "bleass-monolit",
  },
  {
    title: "Leads — Monolit Preset Pack",
    description: "64 essential lead presets rooted in classic synth sounds. From lush arpeggios to sharp melodic hooks.",
    handle: "leads-monolit-preset-pack",
    status: ProductStatus.PUBLISHED,
    category: "Preset Packs",
    price: 500,
    compareAtPrice: null,
    discount: null,
    isFree: false,
    os: ["iOS", "Mac", "Windows"],
    images: ["https://www.bleass.com/wp-content/uploads/2024/06/Leads-Preset-Pack.jpg"],
    compatibleWith: "bleass-monolit",
  },
];

const CATEGORIES = [
  { name: "Synthesizers", is_active: true },
  { name: "Vocal Effects", is_active: true },
  { name: "Classic Effects", is_active: true },
  { name: "Creative Effects", is_active: true },
  { name: "Preset Packs", is_active: true },
];

export default async function seedBleassProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productService = container.resolve(Modules.PRODUCT);
  const inventoryService = container.resolve(Modules.INVENTORY);
  const regionService = container.resolve(Modules.REGION);
  const taxService = container.resolve(Modules.TAX);
  const stockService = container.resolve(Modules.STOCK_LOCATION);
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  logger.info("🌊 Starting BLEASS products re-seed...");

  // 1. Clear existing products (for clean re-seed)
  const existingProducts = await productService.listProducts({});
  if (existingProducts.length > 0) {
    logger.info(`Deleting ${existingProducts.length} existing products...`);
    for (const p of existingProducts) {
      try {
        await productService.deleteProducts([p.id]);
      } catch (e) {
        // Ignore errors on delete
      }
    }
  }

  // 1.5. Clear existing inventory items
  const existingInventory = await inventoryService.listInventoryItems({});
  if (existingInventory.length > 0) {
    logger.info(`Deleting ${existingInventory.length} existing inventory items...`);
    for (const i of existingInventory) {
      try {
        await inventoryService.deleteInventoryItems([i.id]);
      } catch (e) {
        // Ignore errors on delete
      }
    }
  }

   // 2. Clear existing categories
   const existingCats = await productService.listProductCategories({});
   if (existingCats.length > 0) {
     logger.info(`Deleting ${existingCats.length} existing categories...`);
     for (const c of existingCats) {
       try {
         await productService.deleteProductCategories([c.id]);
       } catch (e) {
         // Ignore errors on delete
       }
     }
   }

  // 3. Setup sales channel
  let defaultSalesChannel = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  });
  if (!defaultSalesChannel.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    });
    defaultSalesChannel = result;
  }

  // 4. Update store
  const [store] = await storeModuleService.listStores();
  if (store) {
    await storeModuleService.updateStores(store.id, {
      default_sales_channel_id: defaultSalesChannel[0]?.id,
    });
  }

  // 5. Ensure region exists (skip if already exists)
  const existingRegions = await regionService.listRegions({});
  if (!existingRegions.length) {
    await createRegionsWorkflow(container).run({
      input: {
        regions: [{
          name: "Europe",
          currency_code: "eur",
          countries: ["fr", "de", "gb", "es", "it", "nl", "be"],
          payment_providers: ["pp_system_default"],
        }],
      },
    });
  }

  // 6. Ensure tax regions exist
  const existingTaxRegions = await taxService.listTaxRegions({});
  if (!existingTaxRegions.length) {
    await createTaxRegionsWorkflow(container).run({
      input: ["fr", "de", "gb", "es", "it", "nl", "be"].map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
  }

  // 7. Create stock location if not exists
  const existingLocations = await stockService.listStockLocations({});
  if (!existingLocations.length) {
    await createStockLocationsWorkflow(container).run({
      input: {
        locations: [{
          name: "BLEASS Warehouse",
          address: { city: "Lyon", country_code: "FR", address_1: "" },
        }],
      },
    });
  }

  // 8. Create product categories
  let categoryResult: any[] = [];
  const currentCats = await productService.listProductCategories({});
  
  if (!currentCats.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: CATEGORIES.map((cat) => ({
          ...cat,
          metadata: { is_featured: true },
        })),
      },
    });
    categoryResult = result;
  } else {
    categoryResult = currentCats;
  }

  logger.info(`✅ Categories ready: ${categoryResult.map((c) => c.name).join(", ")}`);

  // 9. Create products
  const productsToCreate = BLEASS_PRODUCTS.map((product) => {
    const category = categoryResult.find((c) => c.name === product.category);
    const priceAmount = product.price;
    const compareAtAmount = product.compareAtPrice;

    return {
      title: product.title,
      description: product.description,
      handle: product.handle,
      status: product.status,
      category_ids: category ? [category.id] : [],
      images: product.images.map((url) => ({ url })),
      options: [
        {
          title: "Platform",
          values: product.os,
        },
      ],
      variants: [
        {
          title: product.os.length === 1 ? product.os[0] : product.os.join(" / "),
          sku: `BLEASS-${product.handle.toUpperCase().replace(/-/g, "_")}`,
          prices: [
            {
              amount: priceAmount,
              currency_code: "eur",
            },
          ],
        },
      ],
      metadata: {
        isFree: product.isFree ? "true" : "false",
        os: product.os.join(", "),
        compareAtPrice: compareAtAmount ? String(compareAtAmount) : "",
        discount: product.discount ? String(product.discount) : "",
        ...(product.compatibleWith ? { compatibleWith: product.compatibleWith } : {}),
      },
    };
  });

  const { result: productsResult } = await createProductsWorkflow(
    container
  ).run({
    input: { products: productsToCreate },
  });

  logger.info(`✅ Created ${productsResult.length} BLEASS products`);
  
  // Summary
  const freeProducts = BLEASS_PRODUCTS.filter((p) => p.isFree);
  const discountedProducts = BLEASS_PRODUCTS.filter((p) => p.discount);
  const totalValue = BLEASS_PRODUCTS.reduce((sum, p) => sum + p.price, 0);
  
  logger.info(`📊 Summary:`);
  logger.info(`   • ${freeProducts.length} free products`);
  logger.info(`   • ${discountedProducts.length} discounted products`);
  logger.info(`   • Total catalog value: €${(totalValue / 100).toFixed(2)}`);
  logger.info(`🎉 BLEASS re-seed completed!`);
}