import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { type } = await request.json();
    
    // In a real app, verify the social provider token and find/create user in DB.
    // For our MVP, we return a successful response with mock u1 details.
    const db = await getDb();
    const user = await db.get('SELECT * FROM CG_USER WHERE USER_ID = ?', 'u1');

    return NextResponse.json({
      success: true,
      token: 'mock_token_12345',
      user: {
        id: user.USER_ID,
        name: user.USER_NAME,
        role: user.ROLE,
        phoneNumber: user.PHONE_NUMBER,
      }
    });
  } catch (error: any) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
