'use client';

import React, { useEffect, useState } from 'react';
import { IMessage } from '@/app/model/message';
import axios from 'axios';
import { ApiResponse } from '@/types/apiresponse';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2, Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const { toast } = useToast();

  const fetchDashboard = async () => {
    try {
      const res = await axios.get<ApiResponse>('/api/user/me');
      setMessages(res.data.messages || []);
      setIsAcceptingMessages(res.data.isAcceptingMessages ?? true);
      setUsername(res.data.username || '');
    } catch (err) {
      toast({
        title: 'Failed to load dashboard',
        description: 'Please refresh the page',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const toggleAcceptMessages = async () => {
    try {
      setIsAcceptingMessages((prev) => !prev);
      await axios.post('/api/accept-messages', { accept: !isAcceptingMessages });
      toast({ title: 'Settings updated', description: `Accept messages: ${!isAcceptingMessages}` });
    } catch {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const copyProfileLink = () => {
    if (!username) return;
    const link = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Copied!', description: 'Your profile link has been copied.' });
  };

  const deleteMessage = async (id: string) => {
    try {
      await axios.delete(`/api/message/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      toast({ title: 'Deleted', description: 'Message removed successfully.' });
    } catch {
      toast({ title: 'Failed', description: 'Could not delete message.', variant: 'destructive' });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <Loader2 className="animate-spin h-8 w-8 text-blue-300" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-12 px-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6"
      >
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text mb-2">
            Your Dashboard
          </h1>
          <span className="block text-gray-300 text-base font-medium">Welcome back!</span>
        </div>
        <div className="flex items-center gap-3 bg-blue-950 px-5 py-3 rounded-lg shadow">
          <span className="text-blue-200 font-semibold">Accept Messages</span>
          <Switch checked={isAcceptingMessages} onCheckedChange={toggleAcceptMessages} />
        </div>
      </motion.div>

      <Separator className="mb-8 border-blue-700" />

      {/* Profile Link Card */}
      {username && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 max-w-lg mx-auto"
        >
          <Card className="bg-blue-950/80 backdrop-blur border border-blue-900 text-white shadow-lg rounded-2xl cursor-pointer hover:shadow-blue-600 transition-shadow">
            <CardContent className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Your Public Profile Link</h3>
                <p className="text-base mt-1 font-mono break-all text-blue-200">
                  {`${window.location.origin}/${username}`}
                </p>
              </div>
              <Button 
                variant="secondary"
                size="sm"
                onClick={copyProfileLink}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                <Copy className="h-4 w-4" /> Copy
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Messages/Empty State */}
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mt-32"
        >
          <span className="text-[4rem] mb-4">💌</span>
          <p className="text-2xl font-semibold mb-2 text-blue-100">No messages yet</p>
          <p className="text-base text-blue-300">Share your profile link above to start receiving messages anonymously!</p>
        </motion.div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="bg-blue-950 border border-blue-900 text-white rounded-2xl hover:shadow-blue-600 transition-shadow duration-300 relative">
                  <CardHeader>
                    <h3 className="font-medium text-blue-300">Message #{index + 1}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-blue-100 break-words">{msg.content}</p>
                  </CardContent>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white rounded"
                    onClick={() => deleteMessage(msg.id)}
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
