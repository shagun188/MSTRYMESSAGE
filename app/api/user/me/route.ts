import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbconnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { UserModel } from "@/app/model/user";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json(
      { message: "Not authenticated", success: false },
      { status: 401 }
    );
  }

  try {
    const user = await UserModel.findById(session.user.id).populate("messages");

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
