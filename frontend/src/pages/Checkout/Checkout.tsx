import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Layout from '../../components/Layout';
import { MdError } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import Tooltip from '../../components/Tooltip';
import confetti from 'canvas-confetti';

type PaymentMethod = "e-money" | "cash";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  paymentMethod: PaymentMethod;
  walletId: string;
  walletPin: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  zip: "",
  city: "",
  country: "",
  paymentMethod: "e-money",
  walletId: "",
  walletPin: "",
};

const SHIPPING = 9.90;
const COUNTRIES = ["Italy", "Greece", "Germany", "Denmark", "France"];

function InputField({
  label, placeholder, value, onChange, type = "text",
  className = "", maxLength, mono = false, toggleable = false,
}: {
  label: string; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string; className?: string;
  maxLength?: number; mono?: boolean; toggleable?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);

  const isEmailInvalid =
    type === "email" && touched && value.length > 0 &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const inputType = toggleable ? (visible ? "text" : "password") : type;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-bold text-gray-800">{label}</label>
      <div className="relative flex items-center">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true); }}
          maxLength={maxLength}
          className={`w-full border text-base text-gray-800 placeholder-gray-400 focus:outline-none transition-colors ${
            mono ? "font-mono tracking-widest" : "font-medium"
          } ${isEmailInvalid ? "border-red-400" : focused ? "border-[#C8874A]" : "border-gray-300"}`}
          style={{ padding: '14px 16px', borderRadius: '0' }}
        />
        {toggleable && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-4 text-gray-400 hover:text-[#C8874A] transition-colors cursor-pointer"
          >
            {visible ? <BsFillEyeSlashFill size={18} /> : <BsFillEyeFill size={18} />}
          </button>
        )}
      </div>
      {isEmailInvalid && (
        <div className="flex items-center gap-2 mt-1">
          <MdError className="text-red-500 w-4 h-4 shrink-0" />
          <span className="text-red-500 text-xs font-semibold">Invalid email address</span>
        </div>
      )}
    </div>
  );
}

function CardInput({ onChange }: { onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [digits, setDigits] = useState("");
  const hiddenRef = useRef<HTMLInputElement>(null);

  const formatted = digits.match(/.{1,4}/g)?.join(" ") ?? digits;
  const maskedValue = formatted.replace(/\d/g, "●");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    setDigits(raw);
    onChange(raw.match(/.{1,4}/g)?.join(" ") ?? raw);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-gray-800">Account Number</label>
      <div
        className={`relative flex items-center border transition-colors ${focused ? "border-[#C8874A]" : "border-gray-300"}`}
        style={{ borderRadius: '0' }}
        onClick={() => hiddenRef.current?.focus()}
      >
        <span className="flex-1 font-mono tracking-widest text-base text-gray-800" style={{ padding: '14px 16px' }}>
          {digits.length === 0
            ? <span className="text-gray-400">{"●●●● ●●●● ●●●● ●●●●"}</span>
            : visible ? formatted : maskedValue}
        </span>
        <input
          ref={hiddenRef} type="text" inputMode="numeric" value={digits}
          onChange={handleChange} onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)} maxLength={16}
          className="absolute opacity-0 w-0 h-0"
        />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setVisible(!visible); }}
          className="absolute right-4 text-gray-400 hover:text-[#C8874A] transition-colors cursor-pointer"
        >
          {visible ? <BsFillEyeSlashFill size={18} /> : <BsFillEyeFill size={18} />}
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-bold tracking-widest text-[#C8874A] uppercase" style={{ marginBottom: '24px' }}>
      {children}
    </h2>
  );
}

function CountrySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 sm:col-span-2 relative">
      <label className="text-sm font-bold text-gray-800">Country</label>
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-300 text-base font-medium text-gray-800 cursor-pointer flex justify-between items-center"
        style={{ padding: '14px 16px', borderRadius: '0' }}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || "Select a country"}
        </span>
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 z-50 shadow-lg">
          {COUNTRIES.map((c) => (
            <div
              key={c}
              onClick={() => { onChange(c); setOpen(false); }}
              className="text-base font-medium text-gray-800 cursor-pointer transition-colors"
              style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FDF0E8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const fmt = (n: number) => n % 1 === 0 ? String(n) : n.toFixed(2);

export default function CheckoutPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const cart = useCart();
  const cartItems = cart.items;
  const navigate = useNavigate();

  const set = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const TAX_RATE = 0.24;
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + SHIPPING + tax;

  const handleOrder = () => {
    setOrderPlaced(true);
    cart.removeAll();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#B89E6F', '#C8874A', '#fff', '#A67C52'],
    });
  };

  useEffect(() => {
    if (!orderPlaced) return;
    setCountdown(10);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setOrderPlaced(false);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [orderPlaced]);

  return (
    <Layout>
      <div className="min-h-screen bg-[#F2F2F2] flex justify-center" style={{ padding: '60px 16px' }}>
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-6 lg:gap-8">

          {/* Form */}
          <div className="bg-white rounded-xl w-full" style={{ padding: 'clamp(24px, 5vw, 64px)' }}>
            <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-gray-900" style={{ marginBottom: '36px' }}>
              Checkout
            </h1>

            <div style={{ marginBottom: '36px' }}>
              <SectionTitle>Billing Details</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <InputField label="Full Name" placeholder="Mario Rossi" value={form.name} onChange={set("name")} />
                <InputField label="Email Address" placeholder="example@mail.com" value={form.email} onChange={set("email")} type="email" />
                <InputField label="Phone Number" placeholder="+1 202-555-0136" value={form.phone} onChange={set("phone")} type="tel" />
              </div>
            </div>

            <div style={{ marginBottom: '36px' }}>
              <SectionTitle>Shipping Info</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <InputField label="Address" placeholder="1137 Williams Avenue" value={form.address} onChange={set("address")} className="sm:col-span-2" />
                <InputField label="Zip Code" placeholder="10001" value={form.zip} onChange={set("zip")} />
                <InputField label="City" placeholder="Atrani" value={form.city} onChange={set("city")} />
                <CountrySelect value={form.country} onChange={set("country")} />
              </div>
            </div>

            <div style={{ marginBottom: '36px' }}>
              <SectionTitle>Payment Details</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="flex flex-col justify-start">
                  <label className="text-sm font-bold text-gray-800">Payment Method</label>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <div onClick={() => set("paymentMethod")("e-money")} className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                      {form.paymentMethod === "e-money" && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                    </div>
                    <span className="text-sm font-bold text-gray-800">e-Wallet</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer">
                    <div onClick={() => set("paymentMethod")("cash")} className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                      {form.paymentMethod === "cash" && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                    </div>
                    <span className="text-sm font-bold text-gray-800">Cash on Delivery</span>
                  </label>
                </div>
                {form.paymentMethod === "e-money" && (
                  <>
                    <CardInput onChange={set("walletId")} />
                    <InputField label="PIN Code" placeholder="●●●●" value={form.walletPin} onChange={(v) => set("walletPin")(v.replace(/\D/g, "").slice(0, 4))} maxLength={4} mono toggleable />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl w-full lg:w-auto lg:shrink-0" style={{ padding: '32px', minWidth: '320px', maxWidth: '480px' }}>
            <h2 className="text-sm font-bold tracking-widest uppercase text-gray-900 mb-6">Summary</h2>
            <div className="h-4" />
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center mb-6">No Items</p>
            ) : (
              <ul className="mb-6 flex flex-col gap-5">
                {cartItems.map((item, i) => {
                  const productUrl = item.category ? `/${item.category}/${item.id}` : `/products/${item.id}`;
                  return (
                    <li key={i} className="flex items-stretch gap-3">
                      <Link to={productUrl} style={{ display: 'block' }} tabIndex={0} aria-label={item.name}>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-[70px] h-[70px] object-cover rounded bg-gray-100 border border-gray-200"
                            style={{ minWidth: 70, minHeight: 70 }}
                          />
                        )}
                      </Link>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Link to={productUrl} className="text-sm font-bold text-gray-900 hover:underline focus:underline" tabIndex={0} aria-label={item.name}>
                            {item.name}
                          </Link>
                          <span className="text-sm font-bold ml-4" style={{ color: '#A67C52' }}>
                            €{fmt(item.price * item.qty)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 w-full">
                          <div className="flex items-center" style={{ width: 70, height: 24, border: '1px solid #e5e5e5', borderRadius: 5, overflow: 'hidden', background: '#fff' }}>
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => item.qty > 1 ? cart.updateQty(item.id, item.qty - 1) : cart.removeItem(item.id)}
                              className="flex-1 text-center text-gray-400 hover:text-[#C8874A] select-none"
                              style={{ fontSize: 14, height: 28, minWidth: 16, cursor: 'pointer' }}
                            >−</button>
                            <span className="flex-1 text-center font-bold" style={{ fontSize: 13 }}>{item.qty}</span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => cart.updateQty(item.id, item.qty + 1)}
                              className="flex-1 text-center text-gray-400 hover:text-[#C8874A] select-none"
                              style={{ fontSize: 14, height: 28, minWidth: 16, cursor: 'pointer' }}
                            >+</button>
                          </div>
                          <div className="flex-1" />
                          <Tooltip text="Remove" position="top">
                            <button
                              aria-label="Remove item"
                              onClick={() => cart.removeItem(item.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center"
                              style={{ cursor: 'pointer' }}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="h-4" />
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 uppercase tracking-wide">Total</span>
                <span className="text-sm font-bold text-gray-900">€{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 uppercase tracking-wide">Shipping</span>
                <span className="text-sm font-bold text-gray-900">€{fmt(SHIPPING)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 uppercase tracking-wide">Tax (24%)</span>
                <span className="text-sm font-bold text-gray-900">€{fmt(tax)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
              <span className="text-sm text-gray-500 uppercase tracking-wide">Grand Total</span>
              <span className="text-lg font-bold text-[#C8874A]">€{fmt(grandTotal)}</span>
            </div>
            <button
              onClick={handleOrder}
              className="w-full bg-[#B89E6F] hover:bg-[#a88c5e] transition-colors text-white text-xs font-bold tracking-widest uppercase rounded"
              style={{ padding: '18px', cursor: 'pointer' }}
            >
              Continue & Pay
            </button>
          </div>

        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Order Confirmation Modal */}
      {orderPlaced && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            animation: 'fadeInBackdrop 0.3s ease',
          }}
          onClick={() => { setOrderPlaced(false); navigate('/'); }}
        >
          <div
            style={{
              backgroundColor: '#fff', borderRadius: '12px', padding: '48px 40px',
              maxWidth: '480px', width: '100%', textAlign: 'center',
              animation: 'slideUpModal 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* SVG Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', animation: 'popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}>
              <svg width="72" height="72" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22h40l-4 28H16L12 22z"
                  stroke="#B89E6F" strokeWidth="2.5" strokeLinejoin="round" fill="#FDF5EB"
                />
                <path
                  d="M22 22c0-5.523 4.477-10 10-10s10 4.477 10 10"
                  stroke="#B89E6F" strokeWidth="2.5" strokeLinecap="round" fill="none"
                />
                <circle cx="44" cy="44" r="12" fill="#B89E6F" />
                <path
                  d="M38.5 44l4 4 7-7"
                  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: '#1a1208', marginBottom: '12px' }}>
              Order Received!
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', color: '#5a4e42', lineHeight: 1.8, marginBottom: '32px' }}>
              Thank you for your purchase. Your order has been received and you'll be notified shortly with updates on your delivery.
            </p>

            <Link
              to="/"
              onClick={() => setOrderPlaced(false)}
              style={{
                display: 'inline-block', backgroundColor: '#B89E6F', color: '#fff',
                padding: '14px 32px', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#a88c5e')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B89E6F')}
            >
              Back to Home
            </Link>

            <p style={{ marginTop: '16px', fontSize: '11px', color: '#bbb', letterSpacing: '0.05em', fontFamily: 'Manrope, sans-serif' }}>
              Redirecting in {countdown}s...
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}