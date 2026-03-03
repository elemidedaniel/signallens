const axios = require('axios');
const { Resend } = require('resend');
const Alert = require('../models/Alert');

const COINGECKO = 'https://api.coingecko.com/api/v3';

const getResend = () => new Resend(process.env.RESEND_API_KEY);

const checkPrices = async () => {
  try {
    console.log('🔔 Checking price alerts...');

    const alerts = await Alert.find({ active: true, triggered: false });

    if (alerts.length === 0) {
      console.log('✅ No active alerts to check');
      return;
    }

    const coinIds = [...new Set(alerts.map((a) => a.coinId))];

    const { data } = await axios.get(`${COINGECKO}/simple/price`, {
      params: {
        ids: coinIds.join(','),
        vs_currencies: 'usd',
        x_cg_demo_api_key: process.env.COINGECKO_API_KEY,
      },
      timeout: 10000,
    });

    for (const alert of alerts) {
      const currentPrice = data[alert.coinId]?.usd;
      if (!currentPrice) continue;

      const isTriggered =
        (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && currentPrice <= alert.targetPrice);

      if (isTriggered) {
        console.log(`🔔 Alert triggered: ${alert.coinSymbol} ${alert.condition} $${alert.targetPrice}`);

        alert.triggered = true;
        alert.triggeredAt = new Date();
        alert.active = false;
        await alert.save();

        await sendAlertEmail(alert, currentPrice);
      }
    }
  } catch (error) {
    console.error('Price checker error:', error.message);
  }
};

const sendAlertEmail = async (alert, currentPrice) => {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: 'SignalLens <onboarding@resend.dev>',
      to: alert.email,
      subject: `🔔 Price Alert: ${alert.coinSymbol.toUpperCase()} has hit $${alert.targetPrice.toLocaleString()}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #22d3ee; font-size: 28px; margin: 0;">SignalLens</h1>
            <p style="color: #6b7280; margin: 8px 0 0;">Price Alert Triggered</p>
          </div>

          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">
              ${alert.coinName} (${alert.coinSymbol.toUpperCase()})
            </p>
            <h2 style="color: #22d3ee; font-size: 40px; margin: 0;">
              $${currentPrice.toLocaleString()}
            </h2>
            <p style="color: #6b7280; margin: 8px 0 0;">Current Price</p>
          </div>

          <div style="background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #22d3ee; margin: 0; font-size: 16px;">
              ✅ Your alert for <strong>${alert.coinSymbol.toUpperCase()}</strong> going 
              <strong>${alert.condition}</strong> 
              <strong>$${alert.targetPrice.toLocaleString()}</strong> has been triggered!
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 32px;">
            <a 
              href="https://signallens.vercel.app/coin/${alert.coinId}"
              style="background: linear-gradient(to right, #22d3ee, #3b82f6); color: #000000; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;"
            >
              View ${alert.coinSymbol.toUpperCase()} on SignalLens →
            </a>
          </div>

          <p style="color: #374151; font-size: 12px; text-align: center; margin: 0;">
            You're receiving this because you set a price alert on SignalLens.
          </p>
        </div>
      `,
    });
    console.log(`📧 Alert email sent to ${alert.email}`);
  } catch (error) {
    console.error('Email send error:', error.message);
  }
};

const startPriceChecker = () => {
  const interval = process.env.ALERT_CHECK_INTERVAL || 300000;
  console.log(`🔔 Price checker started — checking every ${interval / 1000}s`);
  checkPrices();
  setInterval(checkPrices, parseInt(interval));
};

module.exports = { startPriceChecker };