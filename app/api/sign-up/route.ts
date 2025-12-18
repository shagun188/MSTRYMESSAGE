import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/app/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Validation: Check if all fields are provided
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Check if a verified user already owns this username
    const existingUserByUsername = await UserModel.findOne({ 
      username, 
      isverified: true 
    });
    
    if (existingUserByUsername) {
      return NextResponse.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    // 2️⃣ Check if email exists
    const existingUserByEmail = await UserModel.findOne({ email });

    // 3️⃣ Generate verification token
    const verificationToken = crypto.randomUUID();
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let createdOrUpdatedUser;

    if (existingUserByEmail && !existingUserByEmail.isverified) {
      // Update unverified user with new details
      existingUserByEmail.username = username;
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verificationToken = verificationToken;
      existingUserByEmail.verificationTokenExpires = verificationTokenExpires;

      createdOrUpdatedUser = await existingUserByEmail.save();
    } else if (!existingUserByEmail) {
      // Create new user
      createdOrUpdatedUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        isverified: false,
        isAcceptingMessages: true,
        messages: [],
        verificationToken,
        verificationTokenExpires,
      });
    } else {
      // Email is already registered and verified
      return NextResponse.json(
        { success: false, message: "Email is already registered" },
        { status: 400 }
      );
    }

    // 4️⃣ Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verificationToken
    );
    
    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    // 5️⃣ Return success with token
    return NextResponse.json(
      {
        success: true,
        message: "Signup successful! A verification email has been sent to your inbox.",
        verificationToken: createdOrUpdatedUser.verificationToken,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}