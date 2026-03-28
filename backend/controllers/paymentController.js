const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_neural_nexus_123');
const { readData, writeData } = require('../utils/fileHandler');

exports.subscribePayment = async (req, res) => {
    const { plan } = req.body;
    
    // Explicit Identity verified cleanly from JWT pipeline
    const userId = req.user.id; 

    if (!['Free', 'Pro', 'Creator Premium'].includes(plan)) {
        return res.status(400).json({ success: false, message: 'Invalid subscription tier requested.' });
    }

    try {
        // Here we simulate the Stripe PaymentIntent / Checkout completion
        // If this were full prod, we'd deploy webhooks. Since it's JSON local, we simulate the success callback.

        const users = await readData('users.json');
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ success: false, message: 'Identity not found for payment upgrade.' });
        }

        // Mocking Stripe logic parsing cleanly internally
        if (plan !== 'Free') {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: plan === 'Pro' ? 999 : 2999, // $9.99 or $29.99
                currency: 'usd',
                payment_method_types: ['card'],
                metadata: { userId, plan }
            });
            console.log(`[Stripe Mock] Created Payment Intent for ${plan} - ID: ${paymentIntent.id}`);
        }

        // Finalize Upgrade Matrix
        users[userIndex].subscription = plan;
        await writeData('users.json', users);

        res.json({ 
            success: true, 
            message: `Identity explicitly upgraded to ${plan} tier seamlessly!`,
            subscription: plan
        });
    } catch (error) {
        console.error("Stripe Checkout Crash:", error);
        res.status(500).json({ success: false, message: 'Stripe transaction payload failure.' });
    }
};
