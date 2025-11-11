import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';
import { Send, X, Mic, StopCircle, Pause, Play, Trash } from 'lucide-react';
import { Message } from '@/lib/types';
import { UseMutationResult } from '@tanstack/react-query';
import  Box  from '@/components/ui/box';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface MessageInputProps {
  chatUserId: string | null;
  currentUserId: string | null;
  chatMessage: string;
  setChatMessage: (value: string) => void;
  replyToMessage: Message | null;
  setReplyToMessage: (message: Message | null) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isOnline: boolean;
  sendMessageMutation: UseMutationResult<
    Message,
    Error,
    { content: string; parentMessageId: string | null; type: string },
    { previousMessages?: Message[] }
  >;
}

export function MessageInput({
  chatUserId,
  currentUserId,
  chatMessage,
  setChatMessage,
  replyToMessage,
  setReplyToMessage,
  handleSendMessage,
  handleKeyDown,
  isOnline,
  sendMessageMutation,
}: MessageInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [waveformLevels, setWaveformLevels] = useState<number[]>(Array(20).fill(0));
  const maxRecordingTime = 60; // 60-second limit
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(1, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update waveform visualization
  const updateWaveform = useCallback(() => {
    if (analyserRef.current && !isPaused) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const levels = Array(20)
        .fill(0)
        .map((_, i) => {
          const index = Math.floor((i * dataArray.length) / 20);
          return (dataArray[index] / 255) * 24; // Max height 24px
        });
      setWaveformLevels(levels);
    } else if (isPaused) {
      setWaveformLevels((prev) => prev.map(() => Math.random() * 2 + 2));
    }
    animationFrameRef.current = requestAnimationFrame(updateWaveform);
  }, [isPaused]);

  // Start recording
  const startRecording = async () => {
    if (!isOnline || !currentUserId) {
      toast.error('Cannot record: No internet or user not authenticated.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Audio chunk added, size:', event.data.size);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log('Recorder stopped, chunks:', audioChunksRef.current.length);
        if (timerRef.current) clearInterval(timerRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) await audioContextRef.current.close();
        if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());

        if (audioChunksRef.current.length > 0 && audioChunksRef.current.some(blob => blob.size > 0)) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log('Audio blob created, size:', audioBlob.size);
          if (audioBlob.size > 0) {
            setPreviewUrl(URL.createObjectURL(audioBlob));
          } else {
            toast.error('Audio recording is empty.');
          }
        } else {
          toast.error('No audio data recorded.');
        }

        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
        setWaveformLevels(Array(20).fill(0));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxRecordingTime) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);

      updateWaveform();
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Check microphone permissions.');
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxRecordingTime) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
      updateWaveform();
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Send audio
  const sendAudio = async () => {
    if (!previewUrl || audioChunksRef.current.length === 0 || !audioChunksRef.current.some(blob => blob.size > 0)) {
      console.error('No audio to send: previewUrl or chunks missing');
      toast.error('No audio to send.');
      cancelAudio();
      return;
    }

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      console.log('Sending audio, blob size:', audioBlob.size);
      if (audioBlob.size === 0) {
        console.error('Audio blob is empty');
        toast.error('Audio file is empty.');
        cancelAudio();
        return;
      }

      const fileName = `${crypto.randomUUID()}.webm`;
      console.log('Uploading to Supabase, filename:', fileName);
      const { data, error } = await supabase.storage
        .from('audio-messages')
        .upload(`public/${fileName}`, audioBlob, { contentType: 'audio/webm' });

      if (error || !data) {
        console.error('Supabase upload error:', error);
        toast.error(`Failed to upload audio: ${error?.message || 'Storage configuration error. Please check if the audio-messages bucket exists.'}`);
        return;
      }

      console.log('Upload successful, path:', data.path);
      const { data: publicData } = supabase.storage
        .from('audio-messages')
        .getPublicUrl(`public/${fileName}`);

      if (!publicData?.publicUrl) {
        console.error('Failed to get public URL for audio');
        toast.error('Failed to retrieve audio URL.');
        return;
      }

      console.log('Public URL:', publicData.publicUrl);
      sendMessageMutation.mutate({
        content: publicData.publicUrl,
        parentMessageId: replyToMessage?.id || null,
        type: 'audio',
      }, {
        onSuccess: () => {
          // toast.success('Audio message sent!');
          setPreviewUrl(null);
          setReplyToMessage(null);
          audioChunksRef.current = [];
        },
        onError: (err) => {
          console.error('Mutation error:', err);
          toast.error(`Failed to send audio message: ${err.message || 'Database error'}`);
        }
      });
    } catch (error) {
      console.error('Unexpected error sending audio:', error);
      toast.error('Unexpected error sending audio.');
    }
  };

  // Cancel audio
  const cancelAudio = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    audioChunksRef.current = [];
    setRecordingTime(0);
    setWaveformLevels(Array(20).fill(0));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [previewUrl]);

  return (
    <Box>
      {chatUserId && (
        <Box
          className="p-4 bg-blue-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 sticky bottom-0 z-10"
        >
          <AnimatePresence>
            {replyToMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 mb-2 max-w-4xl mx-auto bg-gray-100 dark:bg-gray-800 p-2 rounded"
              >
                <Box as="p" className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  Replying to: {replyToMessage.content.slice(0, 50)}
                </Box>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setReplyToMessage(null)}
                  className="ml-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Box className="flex gap-2 max-w-4xl mx-auto pb-[75px] sm:pb-0">
            {!isRecording && !previewUrl && (
              <>
                <Textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 resize-none min-h-[44px] max-h-[100px] rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500 px-4 py-2"
                  disabled={!isOnline}
                />
                <Button
                  size="icon"
                  onClick={startRecording}
                  className="rounded-full bg-gray-500 hover:bg-gray-600 text-white"
                  disabled={!isOnline}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={sendMessageMutation.isPending || !isOnline || !chatMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </>
            )}
          </Box>
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-[50px]  bg-gray-800 p-4 flex items-center gap-4 z-50 rounded-t-lg sm:bottom-0 left-0 right-0"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelAudio}
                  className="text-white"
                >
                  <Trash className="h-5 w-5" />
                </Button>
                <Box as="span" className="text-white text-sm">
                  {formatTime(recordingTime)}
                </Box>
                <Box className="flex-1 flex items-end gap-1 h-6">
                  {waveformLevels.map((level, i) => (
                    <motion.div
                      key={i}
                      className="bg-white rounded-full"
                      style={{ width: '3px' }}
                      animate={{ height: `${Math.max(2, level)}px` }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </Box>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  className="text-white"
                >
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </Button>
                <Button
                  size="icon"
                  onClick={stopRecording}
                  className="rounded-full bg-red-500 text-white"
                >
                  <StopCircle className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
            {previewUrl && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex items-center gap-4 z-50 rounded-t-lg"
              >
                <Box as="audio" controls src={previewUrl} className="flex-1 h-10" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelAudio}
                  className="text-white"
                >
                  <Trash className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  onClick={sendAudio}
                  className="rounded-full bg-green-500 text-white"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      )}
    </Box>
  );
}