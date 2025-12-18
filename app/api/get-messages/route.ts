import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/app/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const user = await UserModel.findById(session.user.id)
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } }, // newest messages first
      })
      .exec();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      messages: user.messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
