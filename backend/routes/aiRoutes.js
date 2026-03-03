const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Anthropic = require('@anthropic-ai/sdk').default;

// @route POST /api/ai/analyze
router.post('/analyze', protect, async (req, res) => {
  try {
    const { coin, question } = req.body;

    if (!coin) {
      return res.status(400).json({ message: 'Coin data is required' });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = `You are SignalLens AI, an expert crypto market analyst. You analyze cryptocurrency data and provide clear, actionable insights. You are concise, data-driven, and always remind users that crypto is volatile and this is not financial advice. Use bullet points and keep responses under 200 words.`;

    const userMessage = question
      ? `Analyze ${coin.name} (${coin.symbol.toUpperCase()}) and answer this question: ${question}

Here is the current market data:
- Current Price: $${coin.current_price?.toLocaleString()}
- 24h Change: ${coin.price_change_percentage_24h?.toFixed(2)}%
- 7d Change: ${coin.price_change_percentage_7d_in_currency?.toFixed(2) || 'N/A'}%
- Market Cap: $${(coin.market_cap / 1e9).toFixed(2)}B
- 24h Volume: $${(coin.total_volume / 1e9).toFixed(2)}B
- ATH: $${coin.ath?.toLocaleString()}
- ATH Change: ${coin.ath_change_percentage?.toFixed(2)}%
- Market Cap Rank: #${coin.market_cap_rank}`
      : `Give a brief market analysis of ${coin.name} (${coin.symbol.toUpperCase()}) based on this data:
- Current Price: $${coin.current_price?.toLocaleString()}
- 24h Change: ${coin.price_change_percentage_24h?.toFixed(2)}%
- Market Cap: $${(coin.market_cap / 1e9).toFixed(2)}B
- 24h Volume: $${(coin.total_volume / 1e9).toFixed(2)}B
- ATH: $${coin.ath?.toLocaleString()}
- ATH Change: ${coin.ath_change_percentage?.toFixed(2)}%
- Market Cap Rank: #${coin.market_cap_rank}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userMessage }],
      system: systemPrompt,
    });

    res.json({ analysis: message.content[0].text });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ message: 'Failed to generate analysis' });
  }
});

module.exports = router;