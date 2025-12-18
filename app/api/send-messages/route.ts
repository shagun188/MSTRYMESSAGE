import { UserModel } from "@/app/model/user";
import { MessageModel } from "@/app/model/message";
import dbConnect from "@/lib/dbconnect";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    if (!content || content.trim().length === 0) {
      return Response.json(
        { message: "Message cannot be empty", success: false },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: "User is not accepting messages", success: false },
        { status: 403 }
      );
    }

    const newMessage = await MessageModel.create({
      content,
      createdAt: new Date(),
    });

    // push message _id into user
    user.messages.push(newMessage._id);
    await user.save();

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
