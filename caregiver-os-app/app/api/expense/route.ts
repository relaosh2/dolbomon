import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const db = await getDb();
    
    // Fetch expenses list
    const expenses = await db.all(`
      SELECT 
        e.EXPENSE_ID as id, 
        e.TITLE as title, 
        e.PAYER_ID as payerId, 
        u.USER_NAME as payer, 
        e.AMOUNT as amount, 
        e.EXPENSE_DATE as date, 
        e.IS_SETTLED as isSettled 
      FROM CG_EXPENSE e 
      JOIN CG_USER u ON e.PAYER_ID = u.USER_ID 
      WHERE e.FAMILY_ID = 'FAM-DJE-2026' 
      ORDER BY e.EXPENSE_ID DESC
    `);

    // Fetch total sum of expenses
    const totalRow = await db.get(`
      SELECT SUM(AMOUNT) as total 
      FROM CG_EXPENSE 
      WHERE FAMILY_ID = 'FAM-DJE-2026'
    `);
    const totalExpense = totalRow?.total || 0;

    // Fetch number of active family members (to calculate 1/N split)
    const membersRow = await db.get(`
      SELECT COUNT(*) as count 
      FROM CG_USER 
      WHERE FAMILY_ID = 'FAM-DJE-2026' AND ROLE != 'CHILD'
    `);
    const memberCount = membersRow?.count || 3;

    return NextResponse.json({
      success: true,
      expenses,
      totalExpense,
      memberCount
    });
  } catch (error: any) {
    console.error('Expense GET API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const { expenseId, action } = await request.json();

    if (action === 'SETTLE') {
      if (!expenseId) {
        return NextResponse.json({ success: false, error: 'Expense ID is required' }, { status: 400 });
      }

      await db.run(
        'UPDATE CG_EXPENSE SET IS_SETTLED = 1 WHERE EXPENSE_ID = ?',
        expenseId
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Expense POST API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
