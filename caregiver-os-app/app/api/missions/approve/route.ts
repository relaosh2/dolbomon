import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const { regId } = await request.json();

    if (!regId) {
      return NextResponse.json({ success: false, error: 'Registration ID (regId) is required' }, { status: 400 });
    }

    // Begin database transaction to ensure atomic updates
    await db.run('BEGIN TRANSACTION;');

    try {
      // 1. Update CG_MISSION_REG status to APPROVED
      await db.run(
        'UPDATE CG_MISSION_REG SET STATUS = "APPROVED", APPROVED_BY = "u1", APPROVED_AT = CURRENT_TIMESTAMP WHERE REG_ID = ?',
        regId
      );

      // 2. Add points to CG_WALLET for c1
      await db.run(`
        UPDATE CG_WALLET 
        SET CURRENT_POINTS = CURRENT_POINTS + (
          SELECT mp.POINTS FROM CG_MISSION_POOL mp
          JOIN CG_MISSION_REG mr ON mp.MISSION_ID = mr.MISSION_ID
          WHERE mr.REG_ID = ?
        ),
        TOTAL_EARNED = TOTAL_EARNED + (
          SELECT mp.POINTS FROM CG_MISSION_POOL mp
          JOIN CG_MISSION_REG mr ON mp.MISSION_ID = mr.MISSION_ID
          WHERE mr.REG_ID = ?
        ),
        UPDATED_AT = CURRENT_TIMESTAMP
        WHERE CHILD_ID = 'c1'
      `, regId, regId);

      await db.run('COMMIT;');
      return NextResponse.json({ success: true });
    } catch (txError) {
      await db.run('ROLLBACK;');
      throw txError;
    }
  } catch (error: any) {
    console.error('Missions Approve API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
