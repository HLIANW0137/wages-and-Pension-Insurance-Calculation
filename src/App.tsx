import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Info, Settings, User, Wallet, ChevronDown, ChevronUp, Briefcase, DollarSign, Sparkles, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Data & Constants ---
const locationData: Record<string, { avgSalary: number, transitionRate: number }> = {
  "北京": { avgSalary: 12183, transitionRate: 0.01 },
  "上海": { avgSalary: 12183, transitionRate: 0.012 },
  "深圳": { avgSalary: 10795, transitionRate: 0.012 },
  "广州": { avgSalary: 10449, transitionRate: 0.012 },
  "杭州": { avgSalary: 10499, transitionRate: 0.012 },
  "成都": { avgSalary: 9000, transitionRate: 0.013 },
  "南京": { avgSalary: 9800, transitionRate: 0.012 },
  "武汉": { avgSalary: 9000, transitionRate: 0.012 },
  "重庆": { avgSalary: 8500, transitionRate: 0.013 },
  "天津": { avgSalary: 9000, transitionRate: 0.011 },
  "苏州": { avgSalary: 9500, transitionRate: 0.012 },
  "自定义": { avgSalary: 8000, transitionRate: 0.013 }
};

const monthsMap: Record<number, number> = {
  50: 195, 55: 170, 60: 139, 63: 116, 65: 101,
};

// --- Helper: Tax Calculation ---
function calculateTax(taxableIncome: number) {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 3000) return taxableIncome * 0.03;
  if (taxableIncome <= 12000) return taxableIncome * 0.1 - 210;
  if (taxableIncome <= 25000) return taxableIncome * 0.2 - 1410;
  if (taxableIncome <= 35000) return taxableIncome * 0.25 - 2660;
  if (taxableIncome <= 55000) return taxableIncome * 0.3 - 4410;
  if (taxableIncome <= 80000) return taxableIncome * 0.35 - 7160;
  return taxableIncome * 0.45 - 15160;
}

function calculateBonusTax(bonus: number) {
  if (bonus <= 0) return 0;
  const monthly = bonus / 12;
  if (monthly <= 3000) return bonus * 0.03;
  if (monthly <= 12000) return bonus * 0.1 - 210;
  if (monthly <= 25000) return bonus * 0.2 - 1410;
  if (monthly <= 35000) return bonus * 0.25 - 2660;
  if (monthly <= 55000) return bonus * 0.3 - 4410;
  if (monthly <= 80000) return bonus * 0.35 - 7160;
  return bonus * 0.45 - 15160;
}

// --- UI Components ---
const GlassCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:border-white/20 ${className}`}
    >
      <div 
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.1), transparent 40%)`
        }}
      />
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "number", step, suffix, icon: Icon }: any) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
      {Icon && <Icon className="w-4 h-4 text-cyan-400" />}
      {label}
    </label>
    <div className="relative">
      <input 
        type={type} step={step} value={value} onChange={onChange}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
      />
      {suffix && <span className="absolute right-4 top-2.5 text-slate-400">{suffix}</span>}
    </div>
  </div>
);

// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab] = useState<'pension' | 'salary'>('pension');

  // --- Pension State ---
  const [age, setAge] = useState<number>(60);
  const [location, setLocation] = useState<string>('北京');
  const [avgSalary, setAvgSalary] = useState<number>(locationData['北京'].avgSalary);
  const [contributionIndex, setContributionIndex] = useState<number>(1.0);
  const [contributionRatio, setContributionRatio] = useState<number>(8);
  const [totalYears, setTotalYears] = useState<number>(15);
  const [deemedYears, setDeemedYears] = useState<number>(0);
  const [accountBalance, setAccountBalance] = useState<number>(100000);
  const [transitionRate, setTransitionRate] = useState<number>(locationData['北京'].transitionRate);
  const [showPolicy, setShowPolicy] = useState<boolean>(false);

  useEffect(() => {
    if (location !== '自定义') {
      setAvgSalary(locationData[location].avgSalary);
      setTransitionRate(locationData[location].transitionRate);
    }
  }, [location]);

  const handleEstimateBalance = () => {
    const estimated = (avgSalary * contributionIndex) * (contributionRatio / 100) * 12 * totalYears;
    setAccountBalance(Math.round(estimated));
  };

  const distributionMonths = monthsMap[age] || 139;
  const indexedSalary = avgSalary * contributionIndex;
  const basePension = ((avgSalary + indexedSalary) / 2) * totalYears * 0.01;
  const personalPension = accountBalance / distributionMonths;
  const transitionalPension = avgSalary * contributionIndex * deemedYears * transitionRate;
  const totalPension = basePension + personalPension + transitionalPension;

  // --- Salary State ---
  const [preTax, setPreTax] = useState<number>(15000);
  const [socialBase, setSocialBase] = useState<number>(15000);
  const [fundBase, setFundBase] = useState<number>(15000);
  const [fundRatio, setFundRatio] = useState<number>(7);
  const [specialDeduction, setSpecialDeduction] = useState<number>(1500);
  const [bonus, setBonus] = useState<number>(0);

  // Sync bases with preTax by default
  useEffect(() => {
    setSocialBase(preTax);
    setFundBase(preTax);
  }, [preTax]);

  const pensionPersonal = socialBase * 0.08;
  const medicalPersonal = socialBase * 0.02;
  const unemploymentPersonal = socialBase * 0.005;
  const fundPersonal = fundBase * (fundRatio / 100);
  const totalSocialPersonal = pensionPersonal + medicalPersonal + unemploymentPersonal + fundPersonal;
  
  const taxableIncome = Math.max(0, preTax - totalSocialPersonal - 5000 - specialDeduction);
  const monthlyTax = calculateTax(taxableIncome);
  const netSalary = preTax - totalSocialPersonal - monthlyTax;
  
  const bonusTax = calculateBonusTax(bonus);
  const netBonus = bonus - bonusTax;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-12 relative selection:bg-cyan-500/30">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">全能型财务计算器</h1>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('pension')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pension' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              养老金测算
            </button>
            <button 
              onClick={() => setActiveTab('salary')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'salary' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              工资个税计算
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'pension' ? (
            <motion.div 
              key="pension"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-7 space-y-6">
                <GlassCard>
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-white">
                    <User className="w-5 h-5 text-cyan-400" /> 基本信息
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">参保城市</label>
                      <select 
                        value={location} onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none appearance-none"
                      >
                        {Object.keys(locationData).map(loc => <option key={loc} value={loc} className="bg-slate-900">{loc}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">退休年龄</label>
                      <select 
                        value={age} onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none appearance-none"
                      >
                        {[50, 55, 60, 63, 65].map(a => <option key={a} value={a} className="bg-slate-900">{a}岁 (计发{monthsMap[a]}个月)</option>)}
                      </select>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-white">
                    <Settings className="w-5 h-5 text-cyan-400" /> 基数与比例
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="当地社平工资" value={avgSalary} onChange={(e: any) => setAvgSalary(Number(e.target.value))} suffix="元" />
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">平均缴费指数 (0.6-3.0)</label>
                      <div className="flex items-center gap-4 bg-black/20 border border-white/10 rounded-xl px-4 py-2.5">
                        <input 
                          type="range" min="0.6" max="3.0" step="0.01" value={contributionIndex}
                          onChange={(e) => setContributionIndex(Number(e.target.value))}
                          className="flex-1 accent-cyan-500"
                        />
                        <span className="font-mono text-cyan-400 font-medium">{contributionIndex.toFixed(2)}</span>
                      </div>
                    </div>
                    <Input label="个人账户缴费比例" value={contributionRatio} onChange={(e: any) => setContributionRatio(Number(e.target.value))} suffix="%" />
                    <Input label="过渡系数" value={(transitionRate * 100).toFixed(1)} step="0.1" onChange={(e: any) => setTransitionRate(Number(e.target.value) / 100)} suffix="%" />
                  </div>
                </GlassCard>

                <GlassCard>
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-white">
                    <Wallet className="w-5 h-5 text-cyan-400" /> 年限与账户
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="累计缴费年限" value={totalYears} onChange={(e: any) => setTotalYears(Number(e.target.value))} suffix="年" />
                    <Input label="视同缴费年限" value={deemedYears} onChange={(e: any) => setDeemedYears(Number(e.target.value))} suffix="年" />
                    <div className="sm:col-span-2">
                      <div className="flex justify-between items-end mb-1.5">
                        <label className="block text-sm font-medium text-slate-300">个人账户累计储存总额 (元)</label>
                        <button onClick={handleEstimateBalance} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-1 rounded-md transition-colors">
                          <Sparkles className="w-3 h-3" /> 自动估算
                        </button>
                      </div>
                      <input 
                        type="number" value={accountBalance} onChange={(e) => setAccountBalance(Number(e.target.value))}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-mono focus:ring-2 focus:ring-cyan-500/50 outline-none"
                      />
                      <p className="text-xs text-slate-500 mt-2">* 自动估算基于当前社平工资、指数和年限进行粗略计算，实际金额请以社保局为准。</p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="sticky top-8">
                  <GlassCard className="!p-0 overflow-hidden border-cyan-500/30 shadow-cyan-900/20">
                    <div className="p-8 text-center relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
                      <p className="text-cyan-300 text-sm font-medium uppercase tracking-wider mb-2">预计每月总养老金</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-light text-cyan-500">¥</span>
                        <span className="text-6xl font-bold tracking-tight font-mono text-white">{totalPension.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="p-6 space-y-3 bg-black/20">
                      {[
                        { label: '基础养老金', value: basePension, desc: '社平工资 × 指数 × 年限 × 1%' },
                        { label: '个人账户养老金', value: personalPension, desc: `总额 ÷ 计发月数(${distributionMonths})` },
                        { label: '过渡性养老金', value: transitionalPension, desc: '视同缴费年限补偿' }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                          <div>
                            <p className="text-sm font-medium text-slate-200">{item.label}</p>
                            <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                          </div>
                          <span className="text-lg font-mono text-cyan-400">¥{item.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="mt-6 !p-0">
                    <button 
                      onClick={() => setShowPolicy(!showPolicy)}
                      className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-semibold text-slate-200 flex items-center gap-2">
                        <Info className="w-5 h-5 text-cyan-400" /> 政策说明与计算公式
                      </span>
                      {showPolicy ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>
                    <AnimatePresence>
                      {showPolicy && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-5 pt-0 text-sm text-slate-400 space-y-3 border-t border-white/10 bg-black/20">
                            <p><strong className="text-slate-200">基础养老金：</strong> (社平工资 + 指数化工资) ÷ 2 × 缴费年限 × 1%</p>
                            <p><strong className="text-slate-200">个人账户养老金：</strong> 账户总额 ÷ 计发月数。</p>
                            <p><strong className="text-slate-200">过渡性养老金：</strong> 社平工资 × 指数 × 视同缴费年限 × 过渡系数。</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="salary"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-7 space-y-6">
                <GlassCard>
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-white">
                    <Briefcase className="w-5 h-5 text-cyan-400" /> 薪资与基数
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="税前月薪" value={preTax} onChange={(e: any) => setPreTax(Number(e.target.value))} suffix="元" />
                    <Input label="专项附加扣除 (每月)" value={specialDeduction} onChange={(e: any) => setSpecialDeduction(Number(e.target.value))} suffix="元" />
                    <Input label="社保基数" value={socialBase} onChange={(e: any) => setSocialBase(Number(e.target.value))} suffix="元" />
                    <Input label="公积金基数" value={fundBase} onChange={(e: any) => setFundBase(Number(e.target.value))} suffix="元" />
                    <Input label="公积金比例" value={fundRatio} onChange={(e: any) => setFundRatio(Number(e.target.value))} suffix="%" />
                    <Input label="年终奖 (选填)" value={bonus} onChange={(e: any) => setBonus(Number(e.target.value))} suffix="元" />
                  </div>
                </GlassCard>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="sticky top-8">
                  <GlassCard className="!p-0 overflow-hidden border-cyan-500/30 shadow-cyan-900/20">
                    <div className="p-8 text-center relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
                      <p className="text-cyan-300 text-sm font-medium uppercase tracking-wider mb-2">预计税后月薪</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-light text-cyan-500">¥</span>
                        <span className="text-6xl font-bold tracking-tight font-mono text-white">{netSalary.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="p-6 space-y-3 bg-black/20">
                      <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-sm font-medium text-slate-200">个人缴纳五险一金</span>
                        <span className="text-lg font-mono text-rose-400">-¥{totalSocialPersonal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-sm font-medium text-slate-200">个人所得税</span>
                        <span className="text-lg font-mono text-rose-400">-¥{monthlyTax.toFixed(2)}</span>
                      </div>
                      {bonus > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs text-cyan-400 mb-3 uppercase tracking-wider font-semibold">年终奖计算</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">年终奖税额</span>
                              <span className="font-mono text-rose-400">-¥{bonusTax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-200 font-medium">税后年终奖</span>
                              <span className="font-mono text-emerald-400 font-medium">¥{netBonus.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
