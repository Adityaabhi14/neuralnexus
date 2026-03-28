const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_neural_key_123');

// Generic Send Gateway (OTP)
exports.sendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email target required.' });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP mapping natively

        const data = await resend.emails.send({
            from: 'Neural Nexus <onboarding@resend.dev>', // Adjust to production domain later
            to: [email],
            subject: 'Neural Nexus - Verify Your Identity',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #050505; color: #fff; border-radius: 12px; border: 1px solid #1f2937;">
                    <h2 style="color: #3b82f6;">Identity Verification</h2>
                    <p style="color: #e5e7eb; font-size: 16px;">Please use the following single-use Security OTP to authenticate your network handshake:</p>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 4px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #9ca3af; font-size: 12px;">This transmission will self-destruct in 10 minutes locally.</p>
                </div>
            `,
        });

        res.status(200).json({ success: true, message: 'OTP transmitted successfully.', data });
    } catch (error) {
        console.error("Resend API Crash:", error);
        res.status(500).json({ success: false, message: 'Failed dispatching verification loop.' });
    }
};

// Internal Utility to trigger upon proper database registration
exports.sendWelcomeEmail = async (email, name) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.log(`[Email Mock] Transmitting Welcome Email to ${name} (${email}) explicitly.`);
            return;
        }

        await resend.emails.send({
            from: 'Neural Nexus <onboarding@resend.dev>',
            to: [email],
            subject: 'Welcome to Neural Nexus 🌌',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #050505; color: #fff; border-radius: 12px; border: 1px solid #1f2937;">
                    <h1 style="color: #10b981;">Welcome to the Nexus, ${name}!</h1>
                    <p style="color: #e5e7eb; font-size: 16px;">We have successfully initialized your Identity onto the global matrix.</p>
                    <p style="color: #e5e7eb; font-size: 16px;">Prepare yourself to seamlessly interact with Neural AI systems seamlessly and broadcast content globally across the network natively.</p>
                    <br/>
                    <a href="http://localhost:5173" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 20px; font-weight: bold;">Enter the Nexus</a>
                </div>
            `,
        });
        console.log(`[Resend] Successfully dispatched Welcome payload to ${email}`);
    } catch (error) {
        console.error(`[Resend] Failed deploying welcome sequence to ${email}:`, error);
    }
};
