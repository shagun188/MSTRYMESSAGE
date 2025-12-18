"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  username: string;
  onMessageSent: (content: string) => void;
}

export default function SendMessageForm({ username, onMessageSent }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/send-messages", { username, content: message });
      if (res.data.success) {
        onMessageSent(message);
        setMessage("");
      } else alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex gap-2">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <Button onClick={handleSend} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
      </Button>
    </div>
  );
}
