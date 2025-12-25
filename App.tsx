
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Clock from './components/Clock';
import { getRandomTime, getTimeReading, isSpecialTime } from './services/japaneseTime';

const App: React.FC = () => {
  const [time, setTime] = useState(getRandomTime());
  const [showAnswer, setShowAnswer] = useState(false);
  const [geminiTip, setGeminiTip] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate a tip using Gemini to help students remember special readings
  const fetchGeminiTip = useCallback(async (h: number, m: number) => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Updated prompt to ensure no English/Romaji and specific focus
      const prompt = `你是一位日语老师。当前时间是 ${h}:${m < 10 ? '0' + m : m}。请用中文简要提示学生注意这个时间的读法特殊点。
      要求：
      1. 只针对当前出现的那个特殊情况（例如4点、7点、9点，或分钟是1,3,4,6,8,0结尾时的促音/半浊音变化）进行说明。
      2. 如果没有特殊点，不需要解释。
      3. **绝对不要**使用任何英文或罗马音，所有日语读音必须直接用平假名表示（例如：よじ、しちじ、いっぷん）。
      4. 保持简短，一句话即可。`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setGeminiTip(response.text || "");
    } catch (error) {
      console.error("Gemini Error:", error);
      setGeminiTip("");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNext = () => {
    const nextTime = getRandomTime();
    setTime(nextTime);
    setShowAnswer(false);
    setGeminiTip("");
  };

  const handleToggleAnswer = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      if (isSpecialTime(time.hour, time.minute)) {
        fetchGeminiTip(time.hour, time.minute);
      }
    }
  };

  const hiraganaReading = getTimeReading(time.hour, time.minute);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">日语时间练习</h1>
      </header>

      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-lg border-4 border-blue-50">
        <div className="flex flex-col items-center gap-8">
          {/* The Clock UI */}
          <Clock hour={time.hour} minute={time.minute} />

          {/* Digital representation */}
          <div className="text-3xl font-mono text-slate-400 bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
             {time.hour < 10 ? '0' + time.hour : time.hour}:{time.minute < 10 ? '0' + time.minute : time.minute}
          </div>

          {/* Answer Display Area */}
          <div className="h-28 flex flex-col items-center justify-center text-center w-full">
            {showAnswer ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-full">
                <p className="text-3xl font-bold text-pink-600 mb-3 tracking-widest leading-relaxed">
                  {hiraganaReading}
                </p>
                {isLoading ? (
                  <p className="text-sm text-blue-400 animate-pulse">小贴士加载中...</p>
                ) : (
                  geminiTip && (
                    <div className="flex justify-center">
                      <p className="text-sm text-slate-600 bg-blue-50 p-2 rounded-lg border border-blue-100 max-w-xs shadow-sm">
                        💡 {geminiTip}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-slate-300 italic">点击“查看答案”学习平假名读法</p>
            )}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              onClick={handleToggleAnswer}
              disabled={showAnswer}
              className={`py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-md transform active:scale-95 ${
                showAnswer 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              查看答案
            </button>
            <button
              onClick={handleNext}
              className="py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md transform active:scale-95"
            >
              下一个
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-slate-400 text-sm max-w-2xl text-center">
        <p className="mb-2 text-slate-500 font-semibold">特殊读法速查 (Special Readings)</p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <span className="bg-red-50 text-red-500 px-2 py-1 rounded-lg border border-red-100 shadow-sm">4时: よじ</span>
          <span className="bg-red-50 text-red-500 px-2 py-1 rounded-lg border border-red-100 shadow-sm">7时: しちじ</span>
          <span className="bg-red-50 text-red-500 px-2 py-1 rounded-lg border border-red-100 shadow-sm">9时: くじ</span>
          
          <span className="bg-blue-50 text-blue-500 px-2 py-1 rounded-lg border border-blue-100 shadow-sm">1分: いっぷん</span>
          <span className="bg-blue-50 text-blue-500 px-2 py-1 rounded-lg border border-blue-100 shadow-sm">3分: さんぷん</span>
          <span className="bg-blue-50 text-blue-500 px-2 py-1 rounded-lg border border-blue-100 shadow-sm">4分: よんぷん</span>
          <span className="bg-blue-50 text-blue-500 px-2 py-1 rounded-lg border border-blue-100 shadow-sm">6分: ろっぷん</span>
          <span className="bg-blue-50 text-blue-500 px-2 py-1 rounded-lg border border-blue-100 shadow-sm">8分: はっぷん</span>
          <span className="bg-blue-50 text-blue-500 px-2 py-1 rounded-lg border border-blue-100 shadow-sm">10分: じゅっぷん</span>
        </div>
        <p>通过圆形时钟直观学习日语平假名的时间表达。加油！</p>
      </footer>
    </div>
  );
};

export default App;
