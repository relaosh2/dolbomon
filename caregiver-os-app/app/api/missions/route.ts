import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const db = await getDb();
    
    // Fetch all missions with their completion status for the child c1
    const missions = await db.all(`
      SELECT 
        mp.MISSION_ID as id, 
        mp.MISSION_NAME as title, 
        mp.POINTS as points,
        COALESCE(mr.STATUS, 'AVAILABLE') as status,
        mr.REG_ID as regId,
        mr.CHILD_COMMENT as comment
      FROM CG_MISSION_POOL mp
      LEFT JOIN CG_MISSION_REG mr ON mp.MISSION_ID = mr.MISSION_ID AND mr.CHILD_ID = 'c1'
      ORDER BY mp.CREATED_AT DESC
    `);

    // Fetch the child c1's wallet details
    const wallet = await db.get(`
      SELECT 
        CURRENT_POINTS as currentPoints, 
        TOTAL_EARNED as totalEarned, 
        TARGET_POINTS as targetPoints, 
        TARGET_ITEM as targetItem
      FROM CG_WALLET 
      WHERE CHILD_ID = 'c1'
    `);

    return NextResponse.json({
      success: true,
      missions,
      wallet: wallet || { currentPoints: 0, totalEarned: 0, targetPoints: 10000, targetItem: '닌텐도 스위치 칩' }
    });
  } catch (error: any) {
    console.error('Missions GET API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { action } = body;

    if (action === 'CREATE') {
      const { title, points } = body;
      if (!title || !points) {
        return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
      }

      await db.run(
        'INSERT INTO CG_MISSION_POOL (FAMILY_ID, MISSION_NAME, POINTS, CREATED_BY) VALUES (?, ?, ?, ?)',
        'FAM-DJE-2026',
        title,
        Number(points),
        'u1'
      );

      return NextResponse.json({ success: true });
    }

    if (action === 'REQUEST_COMPLETE') {
      const { missionId, comment } = body;
      if (!missionId) {
        return NextResponse.json({ success: false, error: 'Mission ID is required' }, { status: 400 });
      }

      // Check if registration already exists
      const existing = await db.get(
        'SELECT * FROM CG_MISSION_REG WHERE MISSION_ID = ? AND CHILD_ID = ?',
        missionId,
        'c1'
      );

      if (existing) {
        await db.run(
          'UPDATE CG_MISSION_REG SET STATUS = "REQUESTED", CHILD_COMMENT = ?, REQUESTED_AT = CURRENT_TIMESTAMP WHERE MISSION_ID = ? AND CHILD_ID = ?',
          comment || '',
          missionId,
          'c1'
        );
      } else {
        await db.run(
          'INSERT INTO CG_MISSION_REG (MISSION_ID, CHILD_ID, STATUS, CHILD_COMMENT) VALUES (?, ?, ?, ?)',
          missionId,
          'c1',
          'REQUESTED',
          comment || ''
        );
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'UPDATE_TARGET') {
      const { targetItem, targetPoints } = body;
      if (!targetItem || !targetPoints) {
        return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
      }

      await db.run(
        'UPDATE CG_WALLET SET TARGET_ITEM = ?, TARGET_POINTS = ?, UPDATED_AT = CURRENT_TIMESTAMP WHERE CHILD_ID = ?',
        targetItem,
        Number(targetPoints),
        'c1'
      );

      return NextResponse.json({ success: true });
    }

    if (action === 'RESET_WALLET') {
      // Deduct target points upon cash payout approval
      const { targetPoints } = body;
      await db.run(
        'UPDATE CG_WALLET SET CURRENT_POINTS = MAX(0, CURRENT_POINTS - ?), UPDATED_AT = CURRENT_TIMESTAMP WHERE CHILD_ID = ?',
        Number(targetPoints),
        'c1'
      );
      
      // Also reset the status of all approved/requested missions so they can be done again
      await db.run('DELETE FROM CG_MISSION_REG WHERE CHILD_ID = ?', 'c1');

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Missions POST API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
