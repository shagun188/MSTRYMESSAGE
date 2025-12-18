'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from '@/components/ui/card';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from "@/types/apiresponse";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from "@/app/schemas/messageSchema";

const specialChar = '||';

const parseStringMessages = (str: string) => str.split(specialChar);

const staticSuggestions =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestions, setSuggestions] = useState(staticSuggestions);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ content: '' });
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = () => {
    setIsSuggestLoading(true);
    setTimeout(() => {
      setSuggestions(staticSuggestions);
      setIsSuggestLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <Textarea
                  placeholder="Write your anonymous message here"
                  className="resize-none"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={!messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <Button onClick={fetchSuggestedMessages} disabled={isSuggestLoading}>
          {isSuggestLoading ? "Loading..." : "Suggest Messages"}
        </Button>

        <p>Click on any message below to select it.</p>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              parseStringMessages(suggestions).map((msg, i) => (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => form.setValue('content', msg)}
                >
                  {msg}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href="/sign-up">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
