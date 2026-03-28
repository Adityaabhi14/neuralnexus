const { Resend } = require('resend');
require('dotenv').config();

// 1. Verify API Key presence immediately upon file load
const API_KEY = process.env.RESEND_API_KEY;
console.log("--> [EMAIL DEBUG] Booting Resend Module...");
console.log("--> [EMAIL DEBUG] API Key Check:", API_KEY ? "KEY IS PRESENT ✅" : "KEY IS MISSING ❌");

const resend = new Resend(API_KEY);

exports.sendEmail = async (to, subject, html) => {
    console.log(`\n--> [EMAIL DEBUG] ===========================`);
    console.log(`--> [EMAIL DEBUG] Function sendEmail() Triggered!`);
    console.log(`--> [EMAIL DEBUG] Target Recipient: ${to}`);
    console.log(`--> [EMAIL DEBUG] Subject Line: ${subject}`);
    
    if (!API_KEY) {
        console.error('--> [EMAIL DEBUG ERROR] RESEND_API_KEY is not defined in .env! Aborting dispatch.');
        return null;
    }

    try {
        console.log(`--> [EMAIL DEBUG] Compiling payload...`);
        const payload = {
            from: 'Neural Nexus <onboarding@resend.dev>',
            to,
            subject,
            html,
        };
        console.log(`--> [EMAIL DEBUG] Payload compiled securely.`);
        console.log(`--> [EMAIL DEBUG] Dispatching to Resend API now...`);

        const data = await resend.emails.send(payload);
        
        console.log(`--> [EMAIL DEBUG] Dispatch Complete! ✅`);
        console.log(`--> [EMAIL DEBUG] Resend API Response Data:`, JSON.stringify(data, null, 2));
        
        return data;
    } catch (error) {
        console.error('\n--> [EMAIL DEBUG ERROR] CRITICAL FAULT IN RESEND API DISPATCH!');
        console.error('--> [EMAIL DEBUG ERROR] Error Name:', error.name);
        console.error('--> [EMAIL DEBUG ERROR] Error Message:', error.message);
        console.error('--> [EMAIL DEBUG ERROR] Full Error Stack:\n', error);
        
        throw error;
    }
};
