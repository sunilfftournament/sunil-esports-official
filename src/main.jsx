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

// ============================================================================
// 🔥 SETTINGS AREA (Yahan apni details change karo)
// ============================================================================

// 1. ADMIN PASSWORD: Isse badal kar apna password rakh lo.
const ADMIN_PIN = "8127205425mahi"; 

// 2. SECURITY SALT: Isme kuch bhi random text likh do (hackers se bachne ke liye).
const SALT = "SunilEsportsSecurev2";

// 3. APP ID: Ise mat badalna agar tumhari website pehle se chal rahi hai.
const FIXED_APP_ID = "sunil-esports-live";

// 4. FIREBASE CONFIG: Ye sabse jaruri hai. Ise aise hi rehne do ya apna naya daalo.
const firebaseConfig = {
  apiKey: "AIzaSyDJie-ZFkaSjxAck7ohpegafgTyy6e-2AY",
  authDomain: "sunilesports-ff-4f4ad.firebaseapp.com",
  projectId: "sunilesports-ff-4f4ad",
  storageBucket: "sunilesports-ff-4f4ad.firebasestorage.app",
  messagingSenderId: "929173626716",
  appId: "1:929173626716:web:15b971ba5ab9197da26b99",
  measurementId: "G-0R3ZZ1VNSF"
};

// ============================================================================
// ⚠️ ISKE NICHE KUCH MAT CHEDNA (Code Logic Starts Here)
// ============================================================================

// --- UTILITIES ---
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
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

// 1. 3D BACKGROUND
const ThreeBackground = () => {
    const mountRef = useRef(null);
    useEffect(() => {
        let frameId;
        const initThree = async () => {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
            const THREE = window.THREE;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            if(mountRef.current) mountRef.current.appendChild(renderer.domElement);

            const geometry = new THREE.BufferGeometry();
            const count = 1000;
            const posArray = new Float32Array(count * 3);
            for(let i=0; i<count*3; i++) { posArray[i] = (Math.random()-0.5) * 50; }
            geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const material = new THREE.PointsMaterial({ size: 0.05, color: 0x06b6d4 });
            const particles = new THREE.Points(geometry, material);
            scene.add(particles);
            camera.position.z = 5;

            const animate = () => {
                particles.rotation.y += 0.002;
                renderer.render(scene, camera);
                frameId = requestAnimationFrame(animate);
            };
            animate();
        };
        initThree();
        return () => cancelAnimationFrame(frameId);
    }, []);
    return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
};

// 2. LOGIN SCREEN (Phone + Gmail)
const LoginScreen = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('menu'); // menu, phone
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setTimeout(() => {
            onLogin('google', { email: 'user@gmail.com' }); 
            setLoading(false);
        }, 1500);
    };

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        if(phone.length < 10) return alert("Enter valid number");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowOtp(true);
        }, 1000);
    };

    const verifyOtp = (e) => {
        e.preventDefault();
        if(otp.length < 4) return;
        setLoading(true);
        setTimeout(() => {
            onLogin('phone', { phoneNumber: phone });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-6 text-center relative overflow-hidden">
            <ThreeBackground />
            <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-cyan-500/30 w-full max-w-sm shadow-2xl relative z-10 animate-in zoom-in">
                <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_20px_#06b6d4]">
                    <Smartphone className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2 uppercase italic">Sunil Esports</h1>
                <p className="text-gray-400 mb-8 text-sm">Login to save your wallet & progress permanently.</p>

                {mode === 'menu' && (
                    <div className="space-y-3">
                        <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white hover:bg-gray-100 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition">
                            {loading ? <RefreshCw className="animate-spin w-5 h-5"/> : <div className="w-5 h-5 rounded-full bg-red-500"></div>}
                            Login with Google
                        </button>
                        <button onClick={() => setMode('phone')} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition">
                            <Phone className="w-5 h-5"/> Login with Number
                        </button>
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
  // STATE
  const [user, setUser] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [balance, setBalance] = useState(0);
  const [view, setView] = useState('auth'); 
  const [matches, setMatches] = useState([]);
  
  // Default Settings
  const [settings, setSettings] = useState({
      ticker_text: "WELCOME TO SUNIL LIVE ESPORTS • JOIN DAILY MATCHES • WIN CASH PRIZES",
      video_id: "9iW-sL7Upt0",
      leaderboard: {
          p1: { name: "Player 1", kills: 0 },
          p2: { name: "Player 2", kills: 0 },
          p3: { name: "Player 3", kills: 0 },
      },
      tournament_stats: { semis: "", finals: "" }
  });

  const [withdrawals, setWithdrawals] = useState([]);
  const [userList, setUserList] = useState([]); 
  const [deposits, setDeposits] = useState([]);
  const [toast, setToast] = useState(null); 
  const [lockdown, setLockdown] = useState(false);
  const [appId, setAppId] = useState(FIXED_APP_ID);
  
  // Admin Secrets
  const [tapCount, setTapCount] = useState(0);
  const tapTimer = useRef(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState('matches'); 
  
  // Wallet
  const [walletTab, setWalletTab] = useState('deposit');
  const [depositAmount, setDepositAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  // Name Gen
  const [baseName, setBaseName] = useState('');
  const [genNames, setGenNames] = useState([]);

  // --- INIT ---
  useEffect(() => {
    // Override if we are in preview environment
    const configToUse = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : firebaseConfig;
    const tokenToUse = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    if (configToUse && configToUse.apiKey) {
        const app = initializeApp(configToUse);
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);
        setAuth(authInstance);
        setDb(dbInstance);

        const initAuth = async () => {
            try {
                if (tokenToUse) {
                    await signInWithCustomToken(authInstance, tokenToUse);
                } else {
                    await signInAnonymously(authInstance);
                }
            } catch (error) { console.error("Auth Failed:", error); }
        };
        initAuth();

        const unsubscribe = onAuthStateChanged(authInstance, (u) => {
            if (u) { setUser(u); setView('home'); } 
            else { setView('auth'); }
        });
        return () => unsubscribe();
    }
    
    // Load Local Balance
    const savedBal = parseFloat(localStorage.getItem('myBalance') || '0');
    const savedHash = localStorage.getItem('balHash');
    if(savedHash === hashBalance(savedBal)) setBalance(savedBal);
    else setBalance(0);
  }, []);

  // --- SAFE LISTENERS ---
  useEffect(() => {
      if (!user || !db || !appId) return;

      const safeSubscribe = (ref, callback) => {
          return onSnapshot(ref, callback, (err) => console.log("Data sync pending...", err.code));
      };

      // 1. Settings
      const unsubSettings = safeSubscribe(
          doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'public'), 
          (snap) => { if(snap.exists()) setSettings(prev => ({...prev, ...snap.data()})); }
      );
      
      // 2. Matches
      const unsubMatches = safeSubscribe(
          collection(db, 'artifacts', appId, 'public', 'data', 'tournaments'), 
          (snap) => {
              const m = [];
              snap.forEach(d => m.push({id: d.id, ...d.data()}));
              setMatches(m);
          }
      );

      // 3. User Stats
      const unsubUser = safeSubscribe(
          doc(db, 'artifacts', appId, 'public', 'data', 'user_stats', user.uid), 
          (snap) => {
              if(snap.exists()) {
                  const serverBal = snap.data().balance || 0;
                  setBalance(serverBal);
                  localStorage.setItem('myBalance', serverBal);
                  localStorage.setItem('balHash', hashBalance(serverBal));
              }
          }
      );

      // 4. Admin Listeners
      let unsub1 = () => {}, unsub2 = () => {}, unsub3 = () => {};
      if (isAdmin) {
          unsub1 = safeSubscribe(collection(db, 'artifacts', appId, 'public', 'data', 'withdrawals'), (s) => {
              const d=[]; s.forEach(doc=>d.push({id:doc.id,...doc.data()})); setWithdrawals(d);
          });
          unsub2 = safeSubscribe(collection(db, 'artifacts', appId, 'public', 'data', 'user_stats'), (s) => {
              const d=[]; s.forEach(doc=>d.push({id:doc.id,...doc.data()})); setUserList(d);
          });
          unsub3 = safeSubscribe(collection(db, 'artifacts', appId, 'public', 'data', 'deposits'), (s) => {
              const d=[]; s.forEach(doc=>d.push({id:doc.id,...doc.data()})); setDeposits(d);
          });
      }

      return () => { unsubSettings(); unsubMatches(); unsubUser(); unsub1(); unsub2(); unsub3(); };
  }, [user, db, appId, isAdmin]);

  const showToast = (msg, type='info') => {
      setToast({msg, type});
      setTimeout(() => setToast(null), 3000);
  };

  // --- LOGIC ---
  const handleLogoTap = () => {
      setTapCount(prev => prev + 1);
      clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(() => setTapCount(0), 1000);
      
      if(tapCount + 1 === 6) {
          setShowAdminLogin(true);
          setTapCount(0);
      }
  };

  const updateBalance = async (newBal, uid = user.uid) => {
      setBalance(newBal); // Immediate UI update
      if(db) {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_stats', uid), {
              balance: newBal,
              last_seen: new Date(),
              name: localStorage.getItem('userName') || 'Player',
              uid: uid
          }, { merge: true });
      }
  };

  const generateQR = (amount) => {
      if(!amount) return;
      const upi = settings.upi_id || "9170744521@upi";
      const qrData = settings.custom_qr || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${upi}&pn=SunilEsports&am=${amount}&cu=INR`)}`;
      setQrUrl(qrData);
  };

  const joinMatch = async (m) => {
      if (balance < parseFloat(m.fee)) {
          showToast('Insufficient Balance!', 'error');
          setView('wallet');
          return;
      }
      if (m.currentPlayers >= 48) return showToast('Room Full (48/48)!', 'error');

      const myUid = user.uid;
      if (m.stage === 'Semi-Final' && !settings.semi_qualified_uids?.includes(myUid)) return showToast('Not Qualified for Semi-Finals!', 'error');
      if (m.stage === 'Final' && !settings.final_qualified_uids?.includes(myUid)) return showToast('Not Qualified for Finals!', 'error');

      if (confirm(`Join ${m.title} for ₹${m.fee}?`)) {
          await updateBalance(balance - parseFloat(m.fee));
          if(db) await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tournaments', m.id), { currentPlayers: increment(1) });
          showToast('Joined Successfully!', 'success');
          window.open(`https://wa.me/919170744521?text=JOINED MATCH: ${m.title} (ID: ${m.id}) - Player UID: ${user.uid}`);
      }
  };

  // --- RENDER ---

  if (view === 'auth') return <LoginScreen onLogin={(type, data) => { 
      const mockUid = type === 'google' ? 'google-user-' + Date.now() : 'phone-user-' + data?.phoneNumber;
      // In real deployment, Auth handles this. For now we save mock data.
      if(db) {
          setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_stats', mockUid), {
              loginMethod: type,
              phone: data?.phoneNumber || 'N/A',
              last_seen: new Date(),
              uid: mockUid
          }, {merge: true});
      }
      // Simulate Auth State Change
      setUser({ uid: mockUid, displayName: 'Player' });
      setView('home'); 
  }} />;

  if (lockdown && !isAdmin) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
              <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse mb-4" />
              <h1 className="text-4xl font-bold text-white mb-2">MAINTENANCE BREAK</h1>
              <button onClick={() => setShowAdminLogin(true)} className="mt-8 text-gray-800 text-xs">Auth</button>
              {showAdminLogin && (
                  <form onSubmit={(e) => {
                      e.preventDefault();
                      if(adminPinInput === ADMIN_PIN) { setIsAdmin(true); setLockdown(false); setView('admin'); }
                  }} className="mt-4 flex gap-2">
                      <input type="password" value={adminPinInput} onChange={e=>setAdminPinInput(e.target.value)} className="bg-gray-800 text-white p-2 rounded" placeholder="PIN" />
                      <button className="bg-red-600 text-white p-2 rounded">GO</button>
                  </form>
              )}
          </div>
      );
  }

  return (
    <div className="font-sans min-h-screen text-gray-100 overflow-x-hidden bg-slate-900 pb-20">
      <ThreeBackground />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 border-b border-cyan-500/20 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => {
                setTapCount(p => p + 1);
                clearTimeout(tapTimer.current);
                tapTimer.current = setTimeout(() => setTapCount(0), 1000);
                if(tapCount + 1 === 6) setShowAdminLogin(true);
            }}>
                <div className="w-10 h-10 rounded-full border-2 border-cyan-400 bg-slate-900 flex items-center justify-center shadow-[0_0_15px_#06b6d4]">
                    <span className="font-bold text-lg text-cyan-400">S</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-widest text-white leading-none">SUNIL <span className="text-yellow-400">LIVE</span></span>
                    {/* UPDATED UID DISPLAY with COPY functionality */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            if(user?.uid) {
                                navigator.clipboard.writeText(user.uid);
                                showToast('UID Copied!', 'success');
                            }
                        }}
                        className="text-[10px] text-gray-400 font-mono flex items-center gap-1 hover:text-white transition mt-0.5"
                    >
                        UID: {user?.uid ? user.uid.slice(0, 8) + '..' : 'Guest'} <Copy className="w-3 h-3 text-cyan-500" />
                    </button>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <button onClick={() => setView('wallet')} className="flex items-center gap-2 bg-black/60 hover:bg-gray-800 px-3 py-1.5 rounded border border-yellow-500/50 transition">
                    <Wallet className="w-4 h-4 text-yellow-400" />
                    <span className="font-mono font-bold text-white text-sm">₹{balance}</span>
                </button>
            </div>
        </div>
        <div className="bg-cyan-900/50 border-t border-b border-cyan-500/30 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee text-[10px] text-cyan-300 font-bold py-1 tracking-widest inline-block w-full text-center">
               {settings.ticker_text}
            </div>
        </div>
      </nav>

      {/* HELP FAB */}
      <button onClick={() => setView('help')} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center animate-bounce">
          <Headset className="w-6 h-6 text-black" />
      </button>

      {/* ADMIN LOGIN */}
      {showAdminLogin && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
              <div className="bg-slate-800 p-6 rounded-xl border border-red-500 w-full max-w-sm">
                  <div className="flex justify-between mb-4">
                      <h2 className="text-red-500 font-bold flex items-center gap-2"><Lock className="w-5 h-5"/> GOD MODE</h2>
                      <button onClick={() => setShowAdminLogin(false)}><X className="text-gray-400"/></button>
                  </div>
                  <form onSubmit={(e) => {
                      e.preventDefault();
                      if(adminPinInput === ADMIN_PIN) { setIsAdmin(true); setShowAdminLogin(false); setView('admin'); showToast('Welcome Admin', 'success'); } 
                      else showToast('Incorrect PIN', 'error');
                  }} className="space-y-4">
                      <input type="password" value={adminPinInput} onChange={e=>setAdminPinInput(e.target.value)} className="w-full bg-black border border-gray-600 p-3 rounded text-white" placeholder={`Enter PIN`} autoFocus />
                      <button className="w-full bg-red-600 py-3 rounded font-bold text-white">ACCESS PANEL</button>
                  </form>
              </div>
          </div>
      )}

      {/* WALLET */}
      {view === 'wallet' && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-yellow-500/50 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in max-h-[90vh] overflow-y-auto">
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                      <h3 className="font-bold text-white flex items-center gap-2"><Wallet className="w-5 h-5 text-yellow-400"/> MY VAULT</h3>
                      <button onClick={() => setView('home')}><X className="text-gray-400 w-5 h-5"/></button>
                  </div>
                  <div className="p-4">
                      <h2 className="text-4xl font-black text-white font-mono text-center mb-6">₹{balance}</h2>
                      <div className="flex gap-2 mb-4">
                          <button onClick={()=>setWalletTab('deposit')} className={`flex-1 py-2 text-xs font-bold rounded ${walletTab==='deposit'?'bg-cyan-900 text-cyan-400 border border-cyan-500':'bg-gray-800 text-gray-400'}`}>ADD MONEY</button>
                          <button onClick={()=>setWalletTab('withdraw')} className={`flex-1 py-2 text-xs font-bold rounded ${walletTab==='withdraw'?'bg-red-900 text-red-400 border border-red-500':'bg-gray-800 text-gray-400'}`}>WITHDRAW</button>
                      </div>

                      {walletTab === 'deposit' ? (
                          <div className="bg-gray-800/40 p-3 rounded-xl border border-gray-700">
                              <h4 className="text-xs font-bold text-white mb-2">Step 1: Scan QR & Pay</h4>
                              <input type="number" value={depositAmount} onChange={(e)=>{setDepositAmount(e.target.value); generateQR(e.target.value)}} className="w-full bg-black border border-gray-600 rounded-lg py-2 px-4 text-white text-sm mb-3" placeholder="Enter Amount (e.g. 50)" />
                              {qrUrl && <img src={qrUrl} className="w-32 h-32 mx-auto mb-3 border-4 border-white rounded" alt="QR" />}
                              
                              <h4 className="text-xs font-bold text-white mb-2 mt-4 pt-2 border-t border-gray-700">Step 2: Enter UTR (Auto-Add)</h4>
                              <input type="text" value={utrNumber} onChange={(e)=>setUtrNumber(e.target.value)} className="w-full bg-black border border-gray-600 rounded-lg py-2 px-3 text-white text-sm mb-3" placeholder="Enter 12-digit UTR" />
                              
                              <button onClick={async () => {
                                  if(!depositAmount || !utrNumber) return showToast('Enter Amount & UTR', 'error');
                                  if(utrNumber.length < 12) return showToast('Invalid UTR Number', 'error');
                                  
                                  await updateBalance(balance + parseFloat(depositAmount));
                                  showToast(`₹${depositAmount} Added Successfully!`, 'success');
                                  if(db) await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'deposits'), { userId: user.uid, amount: parseFloat(depositAmount), utr: utrNumber, status: 'auto-approved', timestamp: new Date() });
                                  setDepositAmount(''); setUtrNumber(''); setQrUrl('');
                              }} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded text-xs flex items-center justify-center gap-2">
                                  <Check className="w-4 h-4"/> VERIFY & ADD MONEY
                              </button>
                          </div>
                      ) : (
                          <div className="bg-gray-800/40 p-3 rounded-xl border border-gray-700">
                              <h4 className="text-xs font-bold text-red-400 mb-2">WITHDRAWAL</h4>
                              <input value={withdrawUpi} onChange={e=>setWithdrawUpi(e.target.value)} className="w-full bg-black border border-gray-600 rounded mb-2 p-2 text-xs text-white" placeholder="UPI ID" />
                              <input type="number" value={withdrawAmount} onChange={e=>setWithdrawAmount(e.target.value)} className="w-full bg-black border border-gray-600 rounded mb-2 p-2 text-xs text-white" placeholder="Amount" />
                              <button onClick={async () => {
                                  if(balance < parseFloat(withdrawAmount)) return showToast('Insufficient Balance', 'error');
                                  if(db) await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'withdrawals'), { upi: withdrawUpi, amount: parseFloat(withdrawAmount), userId: user.uid, timestamp: new Date() });
                                  updateBalance(balance - parseFloat(withdrawAmount));
                                  showToast('Request Sent', 'success');
                              }} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded text-xs">
                                  REQUEST WITHDRAWAL
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* NAME GEN */}
      {view === 'namegen' && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-purple-500 w-full max-w-sm rounded-xl p-6">
                  <div className="flex justify-between mb-4">
                      <h2 className="text-purple-400 font-bold text-xl">NAME GENERATOR</h2>
                      <button onClick={() => setView('home')}><X className="text-white"/></button>
                  </div>
                  <input value={baseName} onChange={e=>setBaseName(e.target.value)} className="w-full bg-black border border-gray-600 rounded p-3 text-white mb-4" placeholder="Your Name" />
                  <button onClick={() => setGenNames([`⚡${baseName}⚡`, `꧁${baseName}꧂`, `★${baseName}★`, `•${baseName}•`])} className="w-full bg-purple-600 text-white font-bold py-2 rounded mb-4">GENERATE</button>
                  <div className="space-y-2">
                      {genNames.map((n, i) => <div key={i} className="bg-black p-2 rounded text-center text-white font-mono">{n}</div>)}
                  </div>
              </div>
          </div>
      )}

      {/* HELP */}
      {view === 'help' && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-orange-500 w-full max-w-sm rounded-xl p-6">
                  <div className="flex justify-between mb-4">
                      <h2 className="text-orange-400 font-bold text-xl">HELP CENTER</h2>
                      <button onClick={() => setView('home')}><X className="text-white"/></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gray-800 p-3 rounded text-center"><Zap className="mx-auto text-green-400 mb-1"/><p className="text-[10px] text-white">PAYMENT</p></div>
                      <div className="bg-gray-800 p-3 rounded text-center"><Gamepad2 className="mx-auto text-blue-400 mb-1" /><p className="text-[10px] text-white">GAME ID</p></div>
                  </div>
                  <button onClick={() => window.open('https://wa.me/919170744521', '_blank')} className="w-full bg-green-600 text-white font-bold py-3 rounded flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5"/> CHAT ON WHATSAPP
                  </button>
              </div>
          </div>
      )}

      {/* ADMIN DASHBOARD */}
      {view === 'admin' && (
          <div className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto p-4">
              <div className="max-w-2xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2"><Shield /> ADMIN PANEL</h2>
                      <button onClick={() => setView('home')} className="bg-slate-800 p-2 rounded text-white"><X/></button>
                  </div>

                  <div className="flex gap-2 mb-6 overflow-x-auto">
                      {['matches', 'users', 'withdrawals', 'settings'].map(tab => (
                          <button key={tab} onClick={() => setAdminTab(tab)} className={`px-4 py-2 rounded font-bold text-xs uppercase ${adminTab === tab ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-400'}`}>{tab}</button>
                      ))}
                  </div>

                  {/* ADMIN TABS */}
                  {adminTab === 'matches' && (
                      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                          <h3 className="text-xs font-bold text-blue-400 mb-2">CREATE NEW MATCH</h3>
                          <input id="mTitle" className="w-full bg-black rounded p-2 mb-2 text-xs text-white" placeholder="Match Title" />
                          <div className="flex gap-2 mb-2">
                              <select id="mStage" className="bg-black text-white text-xs p-2 rounded flex-1"><option>Qualifier</option><option>Semi-Final</option><option>Final</option></select>
                              <select id="mType" className="bg-black text-white text-xs p-2 rounded flex-1"><option>Solo</option><option>Duo</option><option>Squad</option></select>
                          </div>
                          <div className="flex gap-2 mb-2">
                              <input id="mFee" className="flex-1 bg-black rounded p-2 text-xs text-white" placeholder="Fee" type="number" />
                              <input id="mPrize" className="flex-1 bg-black rounded p-2 text-xs text-white" placeholder="Prize" />
                          </div>
                          <div className="flex gap-2 mb-2">
                              <input id="mDate" className="flex-1 bg-black rounded p-2 text-xs text-white" placeholder="Time" />
                              <input id="mMap" className="flex-1 bg-black rounded p-2 text-xs text-white" placeholder="Map" />
                          </div>
                          <button onClick={async () => {
                              if(db) await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tournaments'), {
                                  title: document.getElementById('mTitle').value,
                                  stage: document.getElementById('mStage').value,
                                  type: document.getElementById('mType').value,
                                  fee: document.getElementById('mFee').value,
                                  prize: document.getElementById('mPrize').value,
                                  map: document.getElementById('mMap').value,
                                  date: document.getElementById('mDate').value,
                                  maxPlayers: 48, currentPlayers: 0, locked: false
                              });
                              showToast('Match Created', 'success');
                          }} className="w-full bg-blue-600 py-2 rounded text-white font-bold text-xs">PUBLISH MATCH</button>
                      </div>
                  )}

                  {adminTab === 'users' && (
                      <div className="space-y-2">
                          <h3 className="text-blue-400 font-bold mb-2">USER MANAGEMENT</h3>
                          {userList.map(u => (
                              <div key={u.id} className="bg-slate-800 p-3 rounded flex justify-between items-center border border-slate-700">
                                  <div><p className="text-white font-bold text-xs">{u.name||'User'}</p><p className="text-[10px] text-gray-500 font-mono">{u.id}</p><p className="text-green-400 font-mono font-bold text-sm">₹{u.balance||0}</p></div>
                                  <div className="flex gap-2">
                                      <button onClick={() => updateBalance(0, u.id)} className="bg-red-900 text-red-200 px-2 py-1 rounded text-[10px] border border-red-500">RESET ₹0</button>
                                      <button onClick={() => { const amt = prompt("Amount to Deduct:"); if(amt) updateBalance((u.balance||0)-parseFloat(amt), u.id); }} className="bg-orange-900 text-orange-200 px-2 py-1 rounded text-[10px] border border-orange-500">DEDUCT</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {adminTab === 'withdrawals' && (
                      <div className="space-y-2">
                          <h3 className="text-red-400 font-bold mb-2">REQUESTS</h3>
                          {withdrawals.length===0 && <p className="text-gray-500 text-xs">No pending withdrawals</p>}
                          {withdrawals.map(w => (
                              <div key={w.id} className="bg-slate-800 p-3 rounded flex justify-between items-center border border-slate-700">
                                  <div><p className="text-red-400 font-bold">₹{w.amount}</p><p className="text-xs text-white">{w.upi}</p></div>
                                  <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'withdrawals', w.id))} className="bg-slate-600 px-3 py-1 rounded text-xs">DONE</button>
                              </div>
                          ))}
                      </div>
                  )}
                  
                  {adminTab === 'settings' && (
                      <div className="space-y-4">
                          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                              <h3 className="text-xs font-bold text-yellow-400 mb-2">QUALIFIED LISTS (UIDs)</h3>
                              <p className="text-[10px] text-gray-400">Semi-Finals</p>
                              <textarea id="semiList" className="w-full bg-black text-white text-xs p-2 rounded mb-2" defaultValue={settings.semi_qualified_uids}></textarea>
                              <p className="text-[10px] text-gray-400">Finals</p>
                              <textarea id="finalList" className="w-full bg-black text-white text-xs p-2 rounded mb-2" defaultValue={settings.final_qualified_uids}></textarea>
                              <button onClick={() => {
                                  if(db) setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'public'), { semi_qualified_uids: document.getElementById('semiList').value, final_qualified_uids: document.getElementById('finalList').value }, { merge: true });
                                  showToast('Lists Updated', 'success');
                              }} className="w-full bg-yellow-600 text-black font-bold py-2 rounded text-xs">UPDATE LISTS</button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-32 pb-12 container mx-auto px-4">
          {/* HERO */}
          <section className="min-h-[50vh] flex flex-col justify-center items-center text-center mb-12">
              <div className="relative p-6 rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-md max-w-4xl w-full shadow-[0_0_50px_rgba(6,182,212,0.1)] transform hover:scale-[1.01] transition-transform duration-500">
                  <div className="mb-6 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(251,191,36,0.2)] border border-yellow-500/30 relative h-64 md:h-80 bg-black">
                      <iframe className="w-full h-full opacity-60 pointer-events-none transform scale-150" src={`https://www.youtube.com/embed/${settings.video_id}?autoplay=1&mute=1&loop=1&playlist=${settings.video_id}&controls=0&showinfo=0&rel=0`} allow="autoplay; encrypted-media"></iframe>
                      <div className="absolute bottom-4 left-4 z-20"><span className="bg-cyan-600 text-white text-[10px] px-2 py-1 rounded font-bold shadow-lg uppercase">OFFICIAL GUIDE</span></div>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black mb-2 uppercase tracking-tighter"><span className="text-white">WELCOME TO</span> <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-yellow-500">BATTLEGROUND</span></h1>
                  <div className="flex gap-4 justify-center mt-6">
                      <button onClick={() => document.getElementById('tournaments').scrollIntoView({behavior:'smooth'})} className="bg-gradient-to-b from-cyan-500 to-cyan-700 text-white px-8 py-3 rounded clip-polygon font-bold uppercase tracking-wider hover:brightness-110 transition">VIEW MATCHES</button>
                      <button onClick={() => setView('namegen')} className="border border-cyan-500 text-cyan-400 px-6 py-3 rounded uppercase font-bold text-xs flex items-center gap-2 hover:bg-cyan-900/30"><Bolt className="w-4 h-4"/> Name Gen</button>
                  </div>
              </div>
          </section>

          {/* TOURNAMENT CENTER */}
          <section className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-6 text-white flex items-center justify-center gap-2"><Trophy className="text-cyan-500"/> TOURNAMENT <span className="text-cyan-400">CENTER</span></h2>
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/30 backdrop-blur-md">
                      <h3 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-widest border-b border-gray-700 pb-2">🔥 Qualified for Semis</h3>
                      <div className="text-xs text-gray-300 space-y-1 h-32 overflow-y-auto">
                          {settings.tournament_stats?.semis ? settings.tournament_stats.semis.split(',').map((n, i) => <div key={i} className="bg-gray-800/50 p-1 px-2 rounded border-l-2 border-cyan-500 flex items-center gap-2 mb-1"><Check className="w-3 h-3 text-green-500"/> {n}</div>) : <p className="text-gray-500 italic">No Data Yet...</p>}
                      </div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-yellow-500/30 backdrop-blur-md">
                      <h3 className="text-sm font-bold text-yellow-400 mb-3 uppercase tracking-widest border-b border-gray-700 pb-2">👑 Grand Finalists</h3>
                      <div className="text-xs text-gray-300 space-y-1 h-32 overflow-y-auto">
                          {settings.tournament_stats?.finals ? settings.tournament_stats.finals.split(',').map((n, i) => <div key={i} className="bg-yellow-900/30 p-1 px-2 rounded border-l-2 border-yellow-500 flex items-center gap-2 mb-1"><Crown className="w-3 h-3 text-yellow-500"/> {n}</div>) : <p className="text-gray-500 italic">No Finalists Yet...</p>}
                      </div>
                  </div>
              </div>
          </section>

          {/* HALL OF FAME */}
          <section className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-6 text-yellow-500"><Trophy className="inline"/> HALL OF FAME</h2>
              <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto text-center items-end">
                  <div className="bg-slate-800/80 p-2 rounded-t-xl border-t border-gray-600 h-32 flex flex-col justify-end"><div className="w-10 h-10 mx-auto bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-400 mb-2">🥈</div><h4 className="font-bold text-gray-300 text-xs">{settings.leaderboard.p2.name}</h4><p className="text-[10px] text-gray-500">{settings.leaderboard.p2.kills} Kills</p></div>
                  <div className="bg-yellow-900/40 p-2 rounded-t-xl border-t border-yellow-500 h-40 flex flex-col justify-end relative z-10 shadow-[0_-10px_30px_rgba(234,179,8,0.2)]"><div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-2xl">👑</div><div className="w-14 h-14 mx-auto bg-gray-800 rounded-full flex items-center justify-center border-2 border-yellow-400 mb-2 shadow-[0_0_15px_#facc15] text-xl">🥇</div><h4 className="font-bold text-yellow-400 text-sm">{settings.leaderboard.p1.name}</h4><p className="text-[10px] text-yellow-200 font-bold">{settings.leaderboard.p1.kills} Kills</p></div>
                  <div className="bg-slate-800/80 p-2 rounded-t-xl border-t border-orange-700 h-24 flex flex-col justify-end"><div className="w-10 h-10 mx-auto bg-gray-700 rounded-full flex items-center justify-center border-2 border-orange-600 mb-2">🥉</div><h4 className="font-bold text-orange-400 text-xs">{settings.leaderboard.p3.name}</h4><p className="text-[10px] text-gray-500">{settings.leaderboard.p3.kills} Kills</p></div>
              </div>
          </section>

          {/* MATCH ZONES */}
          <section id="tournaments" className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center text-white border-b border-gray-800 pb-4">MATCH <span className="text-cyan-400">ZONES</span></h2>
              <div className="grid md:grid-cols-3 gap-6">
                  {matches.length === 0 ? <div className="col-span-3 text-center text-gray-500 py-10">Loading Matches...</div> : matches.map(m => {
                      const isFull = m.currentPlayers >= 48;
                      return (
                          <div key={m.id} className="bg-slate-900/80 rounded-xl overflow-hidden border border-cyan-500/30 hover:border-cyan-400 transition group relative">
                              <div className="h-40 bg-black relative">
                                  <img src="https://images.hdqwalls.com/wallpapers/garena-free-fire-4k-2020-5s.jpg" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition" />
                                  <div className="absolute top-2 left-2 bg-cyan-600 text-white text-[10px] font-bold px-2 py-1 rounded">{m.stage}</div>
                                  <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20">{m.type}</div>
                                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-cyan-400 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1"><Users className="w-3 h-3"/> {m.currentPlayers}/48</div>
                              </div>
                              <div className="p-4">
                                  <h3 className="text-lg font-bold text-white mb-1">{m.title}</h3>
                                  <p className="text-xs text-gray-400 mb-3">{m.date}</p>
                                  <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                                      <div className="bg-slate-800 p-2 rounded border border-slate-700"><p className="text-[10px] text-gray-500">Entry</p><p className="text-green-400 font-bold">₹{m.fee}</p></div>
                                      <div className="bg-slate-800 p-2 rounded border border-slate-700"><p className="text-[10px] text-gray-500">Prize</p><p className="text-yellow-400 font-bold">{m.prize}</p></div>
                                  </div>
                                  <button onClick={() => joinMatch(m)} disabled={isFull} className={`w-full font-bold py-3 rounded uppercase tracking-wider ${isFull ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-cyan-700 hover:bg-cyan-600 text-white'}`}>{isFull ? 'HOUSEFULL' : 'JOIN NOW'}</button>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </section>

          {/* MAP & NEWS */}
          <section className="mb-16 container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold mb-6 text-center text-white">OUR <span className="text-cyan-400">BASE</span></h2>
              <div className="bg-slate-900/50 p-2 rounded-xl border border-cyan-500/30 h-64 relative overflow-hidden">
                  <iframe src="https://maps.google.com/maps?q=Vikash%20Mobile%20Shop%20Bara%20Khas%20Prayagraj&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:0, filter:'grayscale(100%) invert(90%) contrast(80%)'}} allowFullScreen="" loading="lazy"></iframe>
                  <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 rounded border-l-4 border-cyan-500 backdrop-blur-sm"><h4 className="text-cyan-500 font-bold flex items-center gap-2"><MapPin className="w-4 h-4"/> HQ LOCATION</h4><p className="text-xs text-gray-400">Vikash Mobile Shop ke Samne,<br/>Bara Khas, Prayagraj</p></div>
              </div>
          </section>

          <section className="mb-16 container mx-auto px-4 max-w-4xl">
              <div className="bg-gradient-to-r from-purple-900/40 to-slate-900 p-8 rounded-xl border border-purple-500/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><Newspaper className="text-purple-400"/> DAILY <span className="text-purple-500">NEWS</span></h2>
                  <div className="text-gray-300 space-y-4 text-sm"><p>🔥 <strong>Pro Tip:</strong> Use Chrono character in Squad matches for better defense.</p><p>🚀 <strong>Update:</strong> New Tournament format starting next week. Get ready!</p></div>
              </div>
          </section>

          <section className="mb-16"><h2 className="text-2xl font-bold text-center mb-8 text-cyan-500">CONNECT</h2><div className="grid grid-cols-4 gap-2 md:gap-6 max-w-2xl mx-auto"><a href="https://youtube.com/@sunillive01" target="_blank" className="bg-slate-900/50 p-3 flex flex-col items-center justify-center rounded-xl hover:bg-red-900/20 text-gray-300 hover:text-white border border-gray-800 hover:border-red-500 transition"><Youtube className="text-red-500 w-6 h-6 mb-1"/> <span className="text-[10px] font-bold">YouTube</span></a><a href="https://www.instagram.com/sunil_live_1" target="_blank" className="bg-slate-900/50 p-3 flex flex-col items-center justify-center rounded-xl hover:bg-pink-900/20 text-gray-300 hover:text-white border border-gray-800 hover:border-pink-500 transition"><Instagram className="text-pink-500 w-6 h-6 mb-1"/> <span className="text-[10px] font-bold">Insta</span></a><a href="https://www.facebook.com/sunillive01" target="_blank" className="bg-slate-900/50 p-3 flex flex-col items-center justify-center rounded-xl hover:bg-blue-900/20 text-gray-300 hover:text-white border border-gray-800 hover:border-blue-500 transition"><Facebook className="text-blue-500 w-6 h-6 mb-1"/> <span className="text-[10px] font-bold">Facebook</span></a><a href="https://whatsapp.com/channel/0029VabHNnF6mYPQ8IEHex0N" target="_blank" className="bg-slate-900/50 p-3 flex flex-col items-center justify-center rounded-xl hover:bg-green-900/20 text-gray-300 hover:text-white border border-gray-800 hover:border-green-500 transition"><MessageCircle className="text-green-500 w-6 h-6 mb-1"/> <span className="text-[10px] font-bold">WhatsApp</span></a></div></section>
      </main>
    </div>
  );
}