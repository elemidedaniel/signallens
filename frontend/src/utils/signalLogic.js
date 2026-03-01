// SignalLens Signal Engine
// Analyzes price and volume changes to generate trading signals

export const getSignal = ({ price_change_24h, total_volume, market_cap }) => {
    // Calculate volume to market cap ratio as a proxy for volume change
    const volumeRatio = total_volume / market_cap;

    // Strong Momentum — price surging with high volume
    if (price_change_24h > 8 && volumeRatio > 0.15) {
        return {
            label: 'Strong Momentum',
            color: 'text-green-400',
            bg: 'bg-green-400/10',
            border: 'border-green-400/20',
            dot: 'bg-green-400',
            explanation: 'Price surging with significant volume backing.',
        };
    }

    // Bullish — moderate positive movement
    if (price_change_24h > 3) {
        return {
            label: 'Bullish',
            color: 'text-cyan-400',
            bg: 'bg-cyan-400/10',
            border: 'border-cyan-400/20',
            dot: 'bg-cyan-400',
            explanation: 'Positive price action with steady momentum.',
        };
    }

    // High Volatility — sharp drop
    if (price_change_24h < -8) {
        return {
            label: 'High Volatility',
            color: 'text-red-400',
            bg: 'bg-red-400/10',
            border: 'border-red-400/20',
            dot: 'bg-red-400',
            explanation: 'Sharp decline detected. High risk zone.',
        };
    }

    // Bearish — moderate negative movement
    if (price_change_24h < -3) {
        return {
            label: 'Bearish',
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
            border: 'border-orange-400/20',
            dot: 'bg-orange-400',
            explanation: 'Downward pressure building on this asset.',
        };
    }

    // Volume Spike — unusual volume with flat price
    if (volumeRatio > 0.2) {
        return {
            label: 'Volume Spike',
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10',
            border: 'border-yellow-400/20',
            dot: 'bg-yellow-400',
            explanation: 'Unusual volume detected. Possible breakout incoming.',
        };
    }

    // Neutral — no significant movement
    return {
        label: 'Neutral',
        color: 'text-gray-400',
        bg: 'bg-gray-400/10',
        border: 'border-gray-400/20',
        dot: 'bg-gray-400',
        explanation: 'No significant signal at this time.',
    };
};