import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/app/model/user";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const token = body.token || body.verificationToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing verification token" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    user.isverified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    // Generate temp password for auto-login
    const tempPassword = crypto.randomBytes(8).toString("hex");
    user.password = tempPassword; // Only for CredentialsProvider
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
      user: { email: user.email, username: user.username },
      tempPassword,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during verification" },
      { status: 500 }
    );
  }
}
