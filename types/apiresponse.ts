import { IMessage } from "@/app/model/message";

export interface ApiResponse {
  success: boolean;
  message: string;
  username?: string;
  isAcceptingMessages?: boolean;
  messages?: Array<IMessage>;
  verificationToken?: string; // ✅ add this
}
