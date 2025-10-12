import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "@/app/utils/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Please enter your email" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Travest");
    const collection = db.collection("users");

    const user = await collection.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Email does not exist." }, { status: 200 });
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = Date.now() + 3600000;

    await collection.updateOne(
      { email },
      { $set: { resetToken, resetTokenExpiry } }
    );

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/resetPassword?token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Password reset request",
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
    });

    return NextResponse.json({ message: "Reset link has been sent." });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
