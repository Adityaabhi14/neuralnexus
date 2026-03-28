const stripe = require('../utils/stripe');
const { readData, writeData } = require('../utils/fileHandler');

exports.createCheckout = async (req, res) => {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: userEmail,
            client_reference_id: userId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Neural Nexus Premium',
                            description: 'Unlock AI Features, 4K Uploads, and Advanced Networking.'
                        },
                        unit_amount: 1500, // $15.00
                        recurring: { interval: 'month' }
                    },
                    quantity: 1,
                },
            ],
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: 'Failed to initialize payment gateway.' });
    }
};

exports.handleWebhook = async (req, res) => {
    // ⚠️ Crucial: This route MUST receive the raw unparsed body to verify signatures natively
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Only trigger signature verification if a secret is provided natively 
        // (Allows testing without exposing signature crashes in dev mode)
        if (webhookSecret) {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
            console.warn("⚠️ Bypassing Stripe Signature verification! Missing STRIPE_WEBHOOK_SECRET.");
            event = JSON.parse(req.body.toString()); // Fallback parsing for raw body
        }
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;

        if (userId) {
            try {
                console.log(`[STRIPE] Provisioning Premium for User: ${userId}`);
                const users = await readData('users.json');
                const userIndex = users.findIndex(u => u.id === userId);

                if (userIndex !== -1) {
                    users[userIndex].isPremium = true;
                    users[userIndex].subscription = 'Pro'; // Optionally map standard Neural Nexus tiers
                    await writeData('users.json', users);
                    console.log(`[STRIPE] Successfully upgraded user ${users[userIndex].email}`);
                }
            } catch (err) {
                console.error("Failed to upgrade tracking array:", err);
            }
        }
    }

    res.json({ received: true });
};
