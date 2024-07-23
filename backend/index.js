const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5009;

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));

const razorpay = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET',
});

app.use(bodyParser.json());

// Endpoint to create an order
app.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100,
    currency: currency || 'INR',
    receipt: 'receipt_order_74394',
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json(response);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error in creating order' });
  }
});

// Endpoint to create a plan for recurring payments
app.post('/create-plan', async (req, res) => {
  const { period, interval, item } = req.body;

  const options = {
    period,
    interval,
    item: {
      name: item.name,
      amount: item.amount * 100,
      currency: item.currency || 'INR',
      description: item.description,
    }
  };

  try {
    const response = await razorpay.plans.create(options);
    res.json(response);
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: 'Error in creating plan' });
  }
});

// Endpoint to create a subscription for recurring payments
app.post('/create-subscription', async (req, res) => {
  const { plan_id, customer_notify, total_count, start_at } = req.body;

  const options = {
    plan_id,
    customer_notify,
    total_count,
    start_at,
  };

  try {
    const response = await razorpay.subscriptions.create(options);
    res.json(response);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Error in creating subscription' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
