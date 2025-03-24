import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    const db = await dbConnect()
    const [rows] = await db.execute('SELECT * FROM menu WHERE category = ?', ['Minuman'])

    if (!rows.length) {
        return NextResponse.json({ message: 'Tidak ada menu dengan kategori Minuman' }, { status: 404 })
    }

    return NextResponse.json(rows)
}