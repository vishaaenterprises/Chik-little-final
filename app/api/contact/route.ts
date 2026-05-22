import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, email, phone, subject, message } = body

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required',
        },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_USER,

      subject: `New Contact Message - ${subject}`,

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>New Contact Form Submission</h2>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Phone:</strong> ${phone}</p>

          <p><strong>Subject:</strong> ${subject}</p>

          <p><strong>Message:</strong></p>

          <p>${message}</p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send email',
      },
      { status: 500 }
    )
  }
}