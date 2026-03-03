import { useState } from 'react';
import { analyzeCoins } from '../../services/api';

const AIAnalysisCard = ({ coin }) => {
  const [analysis, setAnalysis] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [asked, setAsked] = useState(false);

  const suggestedQuestions = [
    'Should I buy this coin now?',
    'What does the volume indicate?',
    'Is this a good long term hold?',
    'What are the key risks?',
  ];

  const handleAnalyze = async (q = '') => {
    try {
      setLoading(true);
      setError('');
      setAnalysis('');
      setAsked(true);
      const { data } = await analyzeCoins(coin, q || question);
      setAnalysis(data.analysis);
    } catch (err) {
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <span className="text-black text-xs font-black">AI</span>
          </div>
          <p className="text-white font-bold text-sm">SignalLens AI</p>
        </div>
        <span className="text-gray-500 text-xs bg-white/5 px-2 py-1 rounded-lg">
          Powered by Claude
        </span>
      </div>

      {/* Suggested Questions */}
      {!asked && (
        <div className="mb-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">
            Ask about {coin?.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQuestion(q);
                  handleAnalyze(q);
                }}
                className="text-xs bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/20 text-gray-400 hover:text-cyan-400 px-3 py-2 rounded-xl transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Output */}
      {loading && (
        <div className="bg-white/3 border border-white/8 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-gray-500 text-sm">Analyzing {coin?.name}...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="bg-white/3 border border-cyan-500/10 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              AI Analysis
            </p>
          </div>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
          <p className="text-gray-700 text-xs mt-3 pt-3 border-t border-white/5">
            ⚠️ Not financial advice. Always do your own research.
          </p>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
          placeholder={`Ask anything about ${coin?.name}...`}
          className="flex-1 bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none transition-all text-sm"
        />
        <button
          onClick={() => handleAnalyze()}
          disabled={loading || !question}
          className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {loading ? '...' : 'Ask'}
        </button>
      </div>

      {analysis && (
        <button
          onClick={() => {
            setAnalysis('');
            setQuestion('');
            setAsked(false);
          }}
          className="mt-3 text-gray-600 hover:text-gray-400 text-xs transition-colors"
        >
          ← Ask another question
        </button>
      )}
    </div>
  );
};

export default AIAnalysisCard;