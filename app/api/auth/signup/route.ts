import { query, connectDB, disconnectDB } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Handle POST requests
export async function POST(request: NextRequest) {
    const body = await request.json();


    await connectDB();
    console.log('Successfully connected to the database✅')

    // Check if email already exists
    const existingUser = await query(`SELECT id FROM users WHERE email = '${body.email}'`);
    if (existingUser.length > 0) {
        disconnectDB();
        return NextResponse.json({
            message: 'Email already exists',
            status: 'error'
        }, { status: 409 });
    }

    //run an sql query to insert the photo into the database 
    

    //   run an sql query to insert the user into the databae
    const data = await query(`INSERT  into users(name, email, password) values('${body.name}', '${body.email}', '${body.password}') RETURNING id`)
    console.log(data)

    disconnectDB()
    return NextResponse.json({
        message: 'Registration Success',
        status: 'success',
        userId: data[0].id
    });

}