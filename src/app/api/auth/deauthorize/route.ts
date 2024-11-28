import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        // Get the body of the request
        const body = await req.json();

        // Validate the signed request
        const signedRequest = body.signed_request;
        const [signature, payload] = signedRequest.split('.');

        // Decode and parse the payload
        const decodedPayload = Buffer.from(payload, 'base64').toString();
        const data = JSON.parse(decodedPayload);

        // Verify the signature using the Instagram App Secret
        const expectedSignature = crypto
            .createHmac('sha256', process.env.INSTAGRAM_CLIENT_SECRET!)
            .update(payload)
            .digest('hex');

        if (signature !== expectedSignature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Handle the deauthorization (e.g., delete the user's data)
        const userId = data.user_id;
        console.log(`Deauthorized user ID: ${userId}`);
        
        // Here, delete user data from your database if needed
        // Example: await prisma.user.delete({ where: { instagramId: userId } });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Deauthorization error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
