import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/app/model/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = session.user.id; // Use single variable, no redeclaration
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating message acceptance status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating message acceptance status",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, isAcceptingMessages: foundUser.isAcceptingMessages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return NextResponse.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
}
