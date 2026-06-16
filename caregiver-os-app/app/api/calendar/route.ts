import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const db = await getDb();
    
    // Fetch events and join with user names to display the assignee
    const events = await db.all(`
      SELECT 
        c.EVENT_ID as id,
        c.EVENT_DATE as date,
        c.EVENT_TIME as time,
        c.TITLE as title,
        c.DESCRIPTION as description,
        c.ASSIGNEE_ID as assigneeId,
        c.STATUS as status,
        u.USER_NAME as assigneeName
      FROM CG_CALENDAR c
      LEFT JOIN CG_USER u ON c.ASSIGNEE_ID = u.USER_ID
      WHERE c.FAMILY_ID = 'FAM-DJE-2026'
      ORDER BY c.EVENT_DATE ASC
    `);

    // Fetch list of family members for selection dropdown
    const members = await db.all(`
      SELECT USER_ID as id, USER_NAME as name, ROLE as role 
      FROM CG_USER 
      WHERE FAMILY_ID = 'FAM-DJE-2026' AND ROLE != 'CHILD'
    `);

    return NextResponse.json({
      success: true,
      events,
      members
    });
  } catch (error: any) {
    console.error('Calendar GET API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { action } = body;

    if (action === 'CREATE') {
      const { date, time, title, description } = body;
      if (!date || !time || !title) {
        return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
      }

      await db.run(
        'INSERT INTO CG_CALENDAR (FAMILY_ID, EVENT_DATE, EVENT_TIME, TITLE, DESCRIPTION, STATUS) VALUES (?, ?, ?, ?, ?, ?)',
        'FAM-DJE-2026',
        date,
        time,
        title,
        description || '',
        'PENDING'
      );

      return NextResponse.json({ success: true });
    }

    if (action === 'ASSIGN') {
      const { eventId, assigneeId } = body;
      if (!eventId || !assigneeId) {
        return NextResponse.json({ success: false, error: 'Event ID and Assignee ID are required' }, { status: 400 });
      }

      await db.run(
        'UPDATE CG_CALENDAR SET ASSIGNEE_ID = ?, STATUS = "ASSIGNED" WHERE EVENT_ID = ?',
        assigneeId,
        eventId
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Calendar POST API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
