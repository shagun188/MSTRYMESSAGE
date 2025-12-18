import dbconnect from "@/lib/dbconnect";
import { UserModel } from "@/app/model/user";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbconnect();

  try {
    const { username } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Generate new OTP
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = expiryDate;
    await user.save();

    // Send email again
    const emailResponse = await sendVerificationEmail(
      user.email,
      user.username,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully!",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
