import type { Products } from '../types/productTypes';

export const products: Products = {
  watches: [
    {
      id: 'watches-classic',
      name: 'Atrani Classic',
      code: 'AW1001',
      description: 'Swiss Automatic movement. Water resistant up to 200m (20 ATM) — perfect for diving. Case material: Brushed Titanium. Sapphire crystal glass.',
      image: '/images/watches/Atrani/atrani-classic.webp',
      material: 'Brushed Titanium',
      waterResistance: '200m (20 ATM)',
      price: 1250
    },
    {
      id: 'watches-limited',
      name: 'Atrani Limited',
      code: 'AW1002',
      description: 'Limited Edition. Water resistant up to 50m (5 ATM). Case material: Gold Accents on Stainless Steel. Sapphire crystal glass.',
      image: '/images/watches/Atrani/atrani-limited.webp',
      material: 'Gold Accents on Stainless Steel',
      waterResistance: '50m (5 ATM)',
      price: 2100
    },
    {
      id: 'watches-modern',
      name: 'Atrani Modern',
      code: 'AW1003',
      description: 'Quartz movement. Water resistant up to 100m (10 ATM) — swim and snorkel ready. Case material: Stainless Steel with Sapphire Crystal.',
      image: '/images/watches/Atrani/atrani-modern.webp',
      material: 'Stainless Steel',
      waterResistance: '100m (10 ATM)',
      price: 890
    },
  ],
  'watches/luxury': [
    {
      id: 'luxury-brown',
      name: 'Luxury Brown',
      code: 'LW2001',
      description: 'Minimal vintage luxury watch in brown tones, elegant and timeless. Case: Polished Bronze. Water resistance: 50m (5 ATM).',
      image: '/images/watches/Luxury/luxury1.webp',
      material: 'Polished Bronze',
      waterResistance: '50m (5 ATM)',
      price: 3200
    },
    {
      id: 'luxury-cream',
      name: 'Luxury Cream',
      code: 'LW2002',
      description: 'Minimal vintage luxury watch in cream tones, refined and classic. Case: Stainless Steel. Water resistance: 30m (3 ATM).',
      image: '/images/watches/Luxury/luxury2.webp',
      material: 'Stainless Steel',
      waterResistance: '30m (3 ATM)',
      price: 2950
    },
    {
      id: 'luxury-black',
      name: 'Luxury Black',
      code: 'LW2003',
      description: 'Minimal vintage luxury watch in black tones, bold and sophisticated. Case: Black Ceramic. Water resistance: 100m (10 ATM).',
      image: '/images/watches/Luxury/luxury3.webp',
      material: 'Black Ceramic',
      waterResistance: '100m (10 ATM)',
      price: 4100
    },
  ],
  'watches/smartwatches': [
    {
      id: 'smartwatch-sportx',
      name: 'Smartwatch SportX',
      code: 'SW3001',
      description: 'Fitness-focused smartwatch. Tracks heart rate, steps, sleep, and workouts. Waterproof up to 50m. Battery life: 7 days.',
      image: '/images/watches/Smartwatches/smartwatch1.webp',
      waterproof: '50m',
      battery: '7 days',
      price: 320
    },
    {
      id: 'smartwatch-urbanpulse',
      name: 'Smartwatch Urban Pulse',
      code: 'SW3002',
      description: 'Urban style smartwatch. Notifications, calendar, music control, and GPS. Waterproof up to 30m. Battery life: 5 days.',
      image: '/images/watches/Smartwatches/smartwatch2.webp',
      waterproof: '30m',
      battery: '5 days',
      price: 270
    },
    {
      id: 'smartwatch-nova',
      name: 'Smartwatch Nova',
      code: 'SW3003',
      description: 'Futuristic design. Smart connectivity, alerts, digital innovation, and health tracking. Waterproof up to 20m. Battery life: 10 days.',
      image: '/images/watches/Smartwatches/smartwatch3.webp',
      waterproof: '20m',
      battery: '10 days',
      price: 390
    },
  ],
  'watches/pocket': [
    {
      id: 'pocket-silver',
      name: 'Pocket Silver',
      code: 'PS1020',
      description: 'Silver vintage pocket watch. Ornate case, Roman numerals, visible mechanism. Material: Sterling Silver. Manual winding.',
      image: '/images/watches/Pocket/pocket-watch1.webp',
      material: 'Sterling Silver',
      movement: 'Manual winding',
      price: 780
    },
    {
      id: 'pocket-brown',
      name: 'Pocket Brown',
      code: 'PB1002',
      description: 'Brown retro pocket watch. Antique finish, bold numerals, authentic patina. Material: Bronze. Quartz movement.',
      image: '/images/watches/Pocket/pocket-watch2.webp',
      material: 'Bronze',
      movement: 'Quartz',
      price: 650
    },
    {
      id: 'pocket-black',
      name: 'Pocket Black',
      code: 'PB1003',
      description: 'Black pocket watch. Ornate metal case, retro dial, bold numerals. Material: Blackened Steel. Manual winding.',
      image: '/images/watches/Pocket/pocket-watch3.webp',
      material: 'Blackened Steel',
      movement: 'Manual winding',
      price: 720
    },
  ],
  quillPens: [
    { id: 'quill-classic', name: 'Quill Classic', code: 'QP1001', description: 'Classic gold feather quill pen. White handle, gold nib. Material: Brass & feather.', image: '/images/pens/quill/quill1.webp', material: 'Brass & feather', price: 235 },
    { id: 'quill-silver', name: 'Quill Silver', code: 'QP1002', description: 'Silver feather quill pen. Black handle, silver nib. Material: Silver-plated brass & feather.', image: '/images/pens/quill/quill2.webp', material: 'Silver-plated brass & feather', price: 352 },
    { id: 'quill-white', name: 'Quill White Feather', code: 'QP1003', description: 'White feather quill pen. Ornate gold nib, elegant design. Material: Gold-plated brass & feather.', image: '/images/pens/quill/quill3.webp', material: 'Gold-plated brass & feather', price: 280 },
  ],
  fountainPens: [
    { id: 'fountain-gold', name: 'Fountain Gold', code: 'FP2001', description: 'Luxurious gold fountain pen. White handle, ornate gold nib. Material: Gold-plated brass.', image: '/images/pens/fountain/fountain1.webp', material: 'Gold-plated brass', price: 110 },
    { id: 'fountain-silver', name: 'Fountain Silver', code: 'FP2002', description: 'Sleek silver fountain pen. Black handle, shiny silver nib. Material: Silver-plated brass.', image: '/images/pens/fountain/fountain2.webp', material: 'Silver-plated brass', price: 95 },
    { id: 'fountain-white', name: 'Fountain White Feather', code: 'FP2003', description: 'Unique fountain pen with white feather accent and ornate gold nib. Material: Gold-plated brass & feather.', image: '/images/pens/fountain/fountain3.webp', material: 'Gold-plated brass & feather', price: 130 },
  ],
  compasses: [
    { id: 'compass-classic', name: 'Compass Classic', code: 'PC1001', description: 'Classic silver compass. Roman numerals, mechanical movement. Material: Sterling Silver.', image: '/images/compasses/compass1.webp', material: 'Sterling Silver', movement: 'Mechanical', price: 120 },
    { id: 'compass-emerald', name: 'Compass Emerald', code: 'PH1002', description: 'Gold-plated compass with emerald cover. Quartz movement. Material: Gold-plated brass.', image: '/images/compasses/compass2.webp', material: 'Gold-plated brass', movement: 'Quartz', price: 145 },
    { id: 'compass-skeleton', name: 'Compass Skeleton', code: 'PS1003', description: 'Open face compass. Skeleton dial, manual winding. Material: Stainless Steel.', image: '/images/compasses/compass3.webp', material: 'Stainless Steel', movement: 'Manual winding', price: 135 },
  ],
  inkwells: [
    { id: 'inkwell-amber', name: 'Amber Inkwell', code: 'IW4001', description: 'Vintage amber glass inkwell. Ornate gold lid, filled with black ink, brown feather quill. Material: Amber glass & gold-plated brass.', image: '/images/inkwells/inkwells1.webp', material: 'Amber glass & gold-plated brass', price: 85 },
    { id: 'inkwell-green', name: 'Green Inkwell', code: 'IW4002', description: 'Vintage green glass inkwell. Antique bronze lid, filled with ink, black feather quill. Material: Green glass & bronze.', image: '/images/inkwells/inkwells2.webp', material: 'Green glass & bronze', price: 78 },
    { id: 'inkwell-classic', name: 'Classic Inkwell', code: 'IW4003', description: 'Transparent glass inkwell. Ornate brass lid, filled with black ink, white feather quill. Material: Glass & brass.', image: '/images/inkwells/inkwells3.webp', material: 'Glass & brass', price: 92 },
  ],
};