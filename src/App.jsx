import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, Wallet, Shield, Trophy, Users, Zap, Map, Sword, 
  Crosshair, X, Youtube, Instagram, Facebook, MessageCircle, 
  Lock, RefreshCw, Trash2, Check, Crown, Play, AlertTriangle, 
  MapPin, Newspaper, Bolt, Headset, ArrowRight, QrCode, LogOut, UserCheck, Copy, Phone 
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, addDoc, deleteDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import * as THREE from 'three'; 

// ============================================================================
// 🔥 SETTINGS AREA
// ============================================================================
const ADMIN_PIN = "8127205425mahi"; 
const SALT = "SunilEsportsSecurev2";
const FIXED_APP_ID = "sunil-esports-live";

// Dummy Config for Safe Mode
const hardcodedConfig = {
  apiKey: "AIzaSyDJie-ZFkaSjxAck7ohpegafgTyy6e-2AY", 
  authDomain: "sunilesports-ff-4f4ad.firebaseapp.com",
  projectId: "sunilesports-ff-4f4ad",
  storageBucket: "sunilesports-ff-4f4ad.firebasestorage.app",
  messagingSenderId: "929173626716",
  appId: "1:929173626716:web:15b971ba5ab9197da26b99",
  measurementId: "G-0R3ZZ1VNSF"
};

const hashBalance = (bal) => btoa(bal + SALT);

// --- COMPONENTS ---

const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const bg = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600';
  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-[200] ${bg} text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce`}>
      <span>{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4"/></button>
    </div>
  );
};

// 1. 3D BACKGROUND (Safe Version)
const ThreeBackground = () => {
    const mountRef = useRef(null);
    useEffect(() => {
        if (!mountRef.current) return;
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            mountRef.current.appendChild(renderer.domElement);

            const geometry = new THREE.BufferGeometry();
            const count = 1000;
            const posArray = new Float32Array(count * 3);
            for(let i=0; i<count*3; i++) { posArray[i] = (Math.random()-0.5) * 50; }
            geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const material = new THREE.PointsMaterial({ size: 0.05, color: 0x06b6d4 });
            const particles = new THREE.Points(geometry, material);
            scene.add(particles);
            camera.position.z = 5;

            let animationId;
            const animate = () => {
                particles.rotation.y += 0.002;
                renderer.render(scene, camera);
                animationId = requestAnimationFrame(animate);
            };
            animate();
            return () => { cancelAnimationFrame(animationId); if(mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement); };
        } catch(e) { console.log("3D Error ignored"); }
    }, []);
    return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
};

// 2. LOGIN SCREEN
const LoginScreen = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('menu'); 
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);

    const handleGoogleLogin = () => { setLoading(true); setTimeout(() => { onLogin('google', { email: 'user@gmail.com' }); setLoading(false); }, 1500); };
    const handlePhoneSubmit = (e) => { e.preventDefault(); if(phone.length < 10) return alert("Enter valid number"); setLoading(true); setTimeout(() => { setLoading(false); setShowOtp(true); }, 1000); };
    const verifyOtp = (e) => { e.preventDefault(); if(otp.length < 4) return; setLoading(true); setTimeout(() => { onLogin('phone', { phoneNumber: phone }); setLoading(false); }, 1000); };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-6 text-center relative overflow-hidden text-white" style={{backgroundColor: '#0f172a'}}>
            <ThreeBackground />
            <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-cyan-500/30 w-full max-w-sm shadow-2xl relative z-10 animate-in zoom-in">
                <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_20px_#06b6d4]">
                    <Smartphone className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2 uppercase italic">Sunil Live Esports</h1>
                <p className="text-gray-400 mb-8 text-sm">Login to save your wallet & progress.</p>
                {mode === 'menu' && (
                    <div className="space-y-3">
                        <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white hover:bg-gray-100 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-3">
                            {loading ? <RefreshCw className="animate-spin w-5 h-5"/> : <div className="w-5 h-5 rounded-full bg-red-500"></div>} Login with Google
                        </button>
                        <button onClick={() => setMode('phone')} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3"><Phone className="w-5 h-5"/> Login with Number</button>
                    </div>
                )}
                {mode === 'phone' && !showOtp && (
                    <form onSubmit={handlePhoneSubmit} className="space-y-4">
                        <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-black border border-gray-600 p-3 rounded-xl text-white text-center text-lg" placeholder="Enter Mobile Number" autoFocus/>
                        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl">{loading ? 'Sending...' : 'Get OTP'}</button>
                        <button type="button" onClick={()=>setMode('menu')} className="text-xs text-gray-400">Back</button>
                    </form>
                )}
                {mode === 'phone' && showOtp && (
                    <form onSubmit={verifyOtp} className="space-y-4">
                        <p className="text-white text-sm">OTP sent to +91 {phone}</p>
                        <input type="number" value={otp} onChange={e=>setOtp(e.target.value)} className="w-full bg-black border border-gray-600 p-3 rounded-xl text-white text-center text-2xl tracking-[5px]" placeholder="••••" autoFocus/>
                        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl">{loading ? 'Verifying...' : 'Verify & Login'}</button>
                    </form>
                )}
            </div>
        </div>
    );
};

// --- MAIN APP ---
export default function App() {
  const [user, setUser] = useState(null);
  const [db, setDb] = useState(null);
  const [balance, setBalance] = useState(0);
  const [view, setView] = useState('auth'); 
  const [matches, setMatches] = useState([]);
  
  // Default Settings (Fallback)
  const [settings, setSettings] = useState({
      ticker_text: "WELCOME TO SUNIL LIVE ESPORTS • JOIN DAILY MATCHES",
      video_id: "9iW-sL7Upt0",
      leaderboard: { p1: { name: "Player 1", kills: 0 }, p2: { name: "Player 2", kills: 0 }, p3: { name: "Player 3", kills: 0 } },
      tournament_stats: { semis: "", finals: "" }
  });

  const [withdrawals, setWithdrawals] = useState([]);
  const [userList, setUserList] = useState([]); 
  const [deposits, setDeposits] = useState([]);
  const [toast, setToast] = useState(null); 
  const [lockdown, setLockdown] = useState(false);
  const [appId, setAppId] = useState(FIXED_APP_ID);
  const [isOfflineMode, setIsOfflineMode] = useState(false); 
  
  // Admin & Wallet States
  const [tapCount, setTapCount] = useState(0);
  const tapTimer = useRef(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState('matches'); 
  const [walletTab, setWalletTab] = useState('deposit');
  const [depositAmount, setDepositAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [baseName, setBaseName] = useState('');
  const [genNames, setGenNames] = useState([]);

  // --- INIT ---
  useEffect(() => {
    let configToUse = hardcodedConfig;
    try { if (typeof __firebase_config !== 'undefined') configToUse = JSON.parse(__firebase_config); } catch(e) {}

    const initFirebase = async () => {
        try {
            const app = initializeApp(configToUse);
            const authInstance = getAuth(app);
            const dbInstance = getFirestore(app);
            setDb(dbInstance);

            try { await signInAnonymously(authInstance); } 
            catch (authErr) { setIsOfflineMode(true); }

            onAuthStateChanged(authInstance, (u) => {
                if (u) { setUser(u); setView('home'); } 
                else if (!isOfflineMode) { setView('auth'); }
            });
        } catch(e) { setIsOfflineMode(true); }
    };
    initFirebase();
    
    const savedBal = parseFloat(localStorage.getItem('myBalance') || '0');
    if(localStorage.getItem('balHash') === hashBalance(savedBal)) setBalance(savedBal);
  }, []);

  // --- LISTENERS ---
  useEffect(() => {
      if (!user || !db || isOfflineMode) return;
      const safeSub = (ref, cb) => onSnapshot(ref, cb, (e) => { if (e.code === 'permission-denied') setIsOfflineMode(true); });

      const unsubSettings = safeSub(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'public'), (s) => { if(s.exists()) setSettings(p => ({...p, ...s.data()})); });
      const unsubMatches = safeSub(collection(db, 'artifacts', appId, 'public', 'data', 'tournaments'), (s) => { const m=[]; s.forEach(d=>m.push({id:d.id, ...d.data()})); setMatches(m); });
      const unsubUser = safeSub(doc(db, 'artifacts', appId, 'public', 'data', 'user_stats', user.uid), (s) => { 
          if(s.exists()) { const b = s.data().balance||0; setBalance(b); localStorage.setItem('myBalance', b); localStorage.setItem('balHash', hashBalance(b)); } 
      });

      let un1=()=>{}, un2=()=>{}, un3=()=>{};
      if(isAdmin){
          un1=safeSub(collection(db, 'artifacts', appId, 'public', 'data', 'withdrawals'), (s)=>{ const d=[]; s.forEach(doc=>d.push({id:doc.id,...doc.data()})); setWithdrawals(d); });
          un2=safeSub(collection(db, 'artifacts', appId, 'public', 'data', 'user_stats'), (s)=>{ const d=[]; s.forEach(doc=>d.push({id:doc.id,...doc.data()})); setUserList(d); });
          un3=safeSub(collection(db, 'artifacts', appId, 'public', 'data', 'deposits'), (s)=>{ const d=[]; s.forEach(doc=>d.push({id:doc.id,...doc.data()})); setDeposits(d); });
      }
      return () => { unsubSettings(); unsubMatches(); unsubUser(); un1(); un2(); un3(); };
  }, [user, db, appId, isAdmin, isOfflineMode]);

  const showToast = (msg, type='info') => { setToast({msg, type}); setTimeout(() => setToast(null), 3000); };

  // --- ACTIONS ---
  const handleLogoTap = () => { setTapCount(p => p + 1); clearTimeout(tapTimer.current); tapTimer.current = setTimeout(() => setTapCount(0), 1000); if(tapCount + 1 === 6) setShowAdminLogin(true); };

  const updateBalance = async (newBal, uid = user?.uid) => {
      setBalance(newBal); localStorage.setItem('myBalance', newBal); localStorage.setItem('balHash', hashBalance(newBal));
      if(db && !isOfflineMode && uid) await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_stats', uid), { balance: newBal, last_seen: new Date(), uid: uid }, { merge: true });
  };

  const generateQR = (amount) => {
      if(!amount) return;
      const upi = settings.upi_id || "9170744521@upi";
      setQrUrl(settings.custom_qr || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${upi}&pn=SunilEsports&am=${amount}&cu=INR`)}`);
  };

  const joinMatch = async (m) => {
      if (balance < parseFloat(m.fee)) { showToast('Insufficient Balance!', 'error'); setView('wallet'); return; }
      if (m.currentPlayers >= 48) return showToast('Room Full!', 'error');
      
      const confirmJoin = confirm(`Join ${m.title} for ₹${m.fee}?`);
      if (confirmJoin) {
          await updateBalance(balance - parseFloat(m.fee));
          if(db && !isOfflineMode) await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', m.id), { currentPlayers: increment(1) });
          showToast('Joined Successfully!', 'success');
          window.open(`https://wa.me/919170744521?text=JOINED MATCH: ${m.title} (ID: ${m.id})`);
      }
  };

  // --- RENDER ---
  if (view === 'auth') return <LoginScreen onLogin={(type, data) => { 
      const mockUid = type === 'google' ? 'user-'+Date.now() : 'phone-'+data?.phoneNumber;
      if(db && !isOfflineMode) setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_stats', mockUid), { loginMethod: type, phone: data?.phoneNumber || 'N/A', last_seen: new Date(), uid: mockUid }, {merge: true});
      setUser({ uid: mockUid, displayName: 'Player' }); setView('home'); 
  }} />;

  if (lockdown && !isAdmin) return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white"><AlertTriangle className="w-16 h-16 text-red-500 mb-4"/><h1 className="text-4xl font-bold">MAINTENANCE</h1><button onClick={()=>setShowAdminLogin(true)} className="mt-8 text-gray-500 text-xs">Auth</button>{showAdminLogin && <form onSubmit={e=>{e.preventDefault(); if(adminPinInput===ADMIN_PIN){setIsAdmin(true); setLockdown(false); setView('admin');}}} className="mt-4 flex gap-2"><input type="password" onChange={e=>setAdminPinInput(e.target.value)} className="bg-gray-800 p-2 rounded text-white"/><button className="bg-red-600 p-2 rounded">GO</button></form>}</div>;

  return (
    <div className="font-sans min-h-screen text-gray-100 overflow-x-hidden bg-slate-900 pb-20" style={{backgroundColor: '#0f172a', color: 'white', minHeight: '100vh'}}>
      <ThreeBackground />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      <nav className="fixed w-full z-50 border-b border-cyan-500/20 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogoTap}>
                <div className="w-10 h-10 rounded-full border-2 border-cyan-400 bg-slate-900 flex items-center justify-center shadow-[0_0_15px_#06b6d4]"><span className="font-bold text-lg text-cyan-400">S</span></div>
                <div className="flex flex-col"><span className="text-xl font-bold tracking-widest text-white leading-none">SUNIL LIVE <span className="text-yellow-400">ESPORTS</span></span><button onClick={(e) => { e.stopPropagation(); if(user?.uid) { navigator.clipboard.writeText(user.uid); showToast('UID Copied!', 'success'); } }} className="text-[10px] text-gray-400 font-mono flex items-center gap-1 hover:text-white transition mt-0.5">UID: {user?.uid ? user.uid.slice(0, 8) + '..' : 'Guest'} <Copy className="w-3 h-3 text-cyan-500" /></button></div>
            </div>
            <button onClick={() => setView('wallet')} className="flex items-center gap-2 bg-black/60 hover:bg-gray-800 px-3 py-1.5 rounded border border-yellow-500/50"><Wallet className="w-4 h-4 text-yellow-400" /><span className="font-mono font-bold text-white text-sm">₹{balance}</span></button>
        </div>
        <div className="bg-cyan-900/50 border-t border-b border-cyan-500/30 overflow-hidden whitespace-nowrap"><div className="animate-marquee text-[10px] text-cyan-300 font-bold py-1 tracking-widest inline-block w-full text-center">{settings.ticker_text}</div></div>
      </nav>

      <button onClick={() => setView('help')} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full shadow-lg flex items-center justify-center animate-bounce"><Headset className="w-6 h-6 text-black" /></button>

      {showAdminLogin && <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"><div className="bg-slate-800 p-6 rounded-xl w-full max-w-sm"><div className="flex justify-between mb-4"><h2 className="text-red-500 font-bold flex items-center gap-2"><Lock/> GOD MODE</h2><button onClick={() => setShowAdminLogin(false)}><X/></button></div><form onSubmit={(e) => {e.preventDefault(); if(adminPinInput===ADMIN_PIN){setIsAdmin(true); setShowAdminLogin(false); setView('admin'); showToast('Success','success');} else showToast('Invalid','error');}} className="space-y-4"><input type="password" onChange={e=>setAdminPinInput(e.target.value)} className="w-full bg-black p-3 rounded text-white" autoFocus placeholder="PIN"/><button className="w-full bg-red-600 py-3 rounded font-bold">ACCESS</button></form></div></div>}

      {view === 'admin' && (
          <div className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto p-4"><div className="max-w-2xl mx-auto"><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-red-500 flex items-center gap-2"><Shield /> PANEL</h2><button onClick={() => setView('home')} className="bg-slate-800 p-2 rounded text-white"><X/></button></div>
          <div className="flex gap-2 mb-6">{['matches', 'users', 'withdrawals', 'settings'].map(tab => <button key={tab} onClick={() => setAdminTab(tab)} className={`px-4 py-2 rounded font-bold text-xs uppercase ${adminTab===tab?'bg-red-600':'bg-slate-800'}`}>{tab}</button>)}</div>
          {adminTab==='matches' && <div className="bg-slate-800 p-4 rounded-xl"><input id="mTitle" className="w-full bg-black rounded p-2 mb-2 text-xs text-white" placeholder="Match Title"/><div className="flex gap-2 mb-2"><input id="mFee" className="bg-black rounded p-2 text-xs flex-1" placeholder="Fee"/><input id="mPrize" className="bg-black rounded p-2 text-xs flex-1" placeholder="Prize"/></div><button onClick={async()=>{ if(db) await addDoc(collection(db,'artifacts',appId,'public','data','tournaments'),{title:document.getElementById('mTitle').value, fee:document.getElementById('mFee').value, prize:document.getElementById('mPrize').value, stage:'Qualifier', type:'Solo', map:'Bermuda', currentPlayers:0, locked:false}); showToast('Match Added','success'); }} className="w-full bg-blue-600 py-2 rounded font-bold text-xs">ADD MATCH</button></div>}
          {adminTab==='users' && <div className="space-y-2">{userList.map(u=><div key={u.id} className="bg-slate-800 p-3 rounded flex justify-between items-center"><div><p className="text-white text-xs">{u.name}</p><p className="text-green-400 font-bold">₹{u.balance}</p></div><button onClick={()=>updateBalance(0,u.id)} className="bg-red-900 text-red-200 px-2 py-1 rounded text-[10px]">RESET</button></div>)}</div>}
          </div></div>
      )}

      {view === 'wallet' && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"><div className="bg-slate-900 border border-yellow-500/50 w-full max-w-sm rounded-2xl p-4"><div className="flex justify-between mb-4"><h3 className="font-bold text-white flex gap-2"><Wallet className="text-yellow-400"/> VAULT</h3><button onClick={()=>setView('home')}><X/></button></div><h2 className="text-4xl font-black text-center mb-6">₹{balance}</h2>
              <div className="flex gap-2 mb-4"><button onClick={()=>setWalletTab('deposit')} className={`flex-1 py-2 text-xs font-bold rounded ${walletTab==='deposit'?'bg-cyan-900 text-cyan-400':'bg-gray-800'}`}>ADD</button><button onClick={()=>setWalletTab('withdraw')} className={`flex-1 py-2 text-xs font-bold rounded ${walletTab==='withdraw'?'bg-red-900 text-red-400':'bg-gray-800'}`}>WITHDRAW</button></div>
              {walletTab==='deposit' ? <div><input type="number" onChange={e=>{setDepositAmount(e.target.value); generateQR(e.target.value)}} className="w-full bg-black rounded p-2 mb-2 text-sm" placeholder="Amount"/>{qrUrl && <img src={qrUrl} className="w-32 mx-auto mb-2 border rounded"/>}<input onChange={e=>setUtrNumber(e.target.value)} className="w-full bg-black rounded p-2 mb-2 text-sm" placeholder="UTR Number"/><button onClick={async()=>{await updateBalance(balance+parseFloat(depositAmount)); showToast('Added!','success'); if(db) await addDoc(collection(db,'artifacts',appId,'public','data','deposits'),{userId:user.uid,amount:parseFloat(depositAmount),utr:utrNumber,timestamp:new Date()});}} className="w-full bg-green-600 py-2 rounded font-bold text-xs">VERIFY</button></div> : <div><input onChange={e=>setWithdrawUpi(e.target.value)} className="w-full bg-black rounded p-2 mb-2 text-sm" placeholder="UPI ID"/><input onChange={e=>setWithdrawAmount(e.target.value)} className="w-full bg-black rounded p-2 mb-2 text-sm" placeholder="Amount"/><button onClick={async()=>{if(balance<parseFloat(withdrawAmount)) return showToast('Low Balance','error'); updateBalance(balance-parseFloat(withdrawAmount)); showToast('Request Sent','success'); if(db) await addDoc(collection(db,'artifacts',appId,'public','data','withdrawals'),{userId:user.uid,amount:parseFloat(withdrawAmount),upi:withdrawUpi,timestamp:new Date()});}} className="w-full bg-red-600 py-2 rounded font-bold text-xs">WITHDRAW</button></div>}</div></div>
      )}

      <main className="relative z-10 pt-32 pb-12 container mx-auto px-4">
          <section className="text-center mb-12"><div className="relative rounded-2xl border border-cyan-500/20 bg-black overflow-hidden h-64"><iframe className="w-full h-full opacity-60 scale-150" src={`https://www.youtube.com/embed/${settings.video_id}?autoplay=1&mute=1&loop=1&playlist=${settings.video_id}&controls=0&showinfo=0&rel=0`}></iframe><div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><h1 className="text-4xl font-black italic">SUNIL LIVE ESPORTS</h1><p className="text-gray-300 text-sm mt-2">The Ultimate Battleground</p></div></div><div className="flex gap-4 justify-center mt-6"><button onClick={()=>document.getElementById('tournaments').scrollIntoView({behavior:'smooth'})} className="bg-cyan-600 px-6 py-2 rounded font-bold text-sm">PLAY NOW</button><button onClick={()=>setView('namegen')} className="border border-cyan-500 px-6 py-2 rounded font-bold text-sm text-cyan-400">NAME GEN</button></div></section>
          
          <section id="tournaments" className="mb-16"><h2 className="text-2xl font-bold text-center mb-6"><Trophy className="inline text-cyan-500"/> MATCH ZONES</h2>
          <div className="grid md:grid-cols-3 gap-6">{matches.map(m=>(<div key={m.id} className="bg-slate-800 rounded-xl overflow-hidden border border-cyan-500/30"><div className="h-32 bg-black relative"><img src="https://images.hdqwalls.com/wallpapers/garena-free-fire-4k-2020-5s.jpg" className="w-full h-full object-cover opacity-60"/><div className="absolute top-2 left-2 bg-cyan-600 text-[10px] font-bold px-2 py-1 rounded">{m.stage}</div><div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-cyan-400 text-[10px] font-bold flex gap-1"><Users className="w-3 h-3"/> {m.currentPlayers}/48</div></div><div className="p-3"><h3 className="font-bold text-sm">{m.title}</h3><div className="flex justify-between mt-2 text-xs text-gray-400"><span>Entry: <b className="text-green-400">₹{m.fee}</b></span><span>Prize: <b className="text-yellow-400">{m.prize}</b></span></div><button onClick={()=>joinMatch(m)} className="w-full bg-cyan-700 py-2 rounded font-bold text-xs mt-3 uppercase">JOIN</button></div></div>))}</div>
          {matches.length === 0 && <p className="text-center text-gray-500">Loading Matches...</p>}
          </section>

          {view === 'namegen' && <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"><div className="bg-slate-900 border border-purple-500 w-full max-w-sm rounded-xl p-6"><div className="flex justify-between mb-4"><h2 className="text-purple-400 font-bold text-xl">NAME GEN</h2><button onClick={() => setView('home')}><X/></button></div><input onChange={e=>setBaseName(e.target.value)} className="w-full bg-black p-3 rounded mb-4" placeholder="Name"/><button onClick={()=>setGenNames([`⚡${baseName}⚡`,`꧁${baseName}꧂`])} className="w-full bg-purple-600 py-2 rounded font-bold">GENERATE</button><div className="mt-4 space-y-2">{genNames.map(n=><div className="bg-black p-2 rounded text-center font-mono">{n}</div>)}</div></div></div>}
      </main>
    </div>
  );
}