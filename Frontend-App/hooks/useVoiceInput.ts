import { Audio } from 'expo-av';
import { useCallback, useState } from 'react';
import { CATEGORY_KEYWORDS } from '../constants/Categories';
import { VoiceExpenseData } from '../types';
import { buildUrl, API_ENDPOINTS } from '../config/api';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';

interface UseVoiceInputReturn {
  isRecording: boolean;
  isProcessing: boolean;
  transcription: string;
  parsedData: VoiceExpenseData | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  reset: () => void;
  error: string | null;
  processedExpenses: any[];
}

export const useVoiceInput = (): UseVoiceInputReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [parsedData, setparsedData] = useState<VoiceExpenseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [processedExpenses, setProcessedExpenses] = useState<any[]>([]);
  
  const user = useAuthStore((state) => state.user);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);

  const parseTranscription = useCallback((text: string): VoiceExpenseData => {
    const lowerText = text.toLowerCase();
    let confidence = 0;

    // Extract amount
    const amountPatterns = [
      /(\d+\.?\d*)\s*(?:dollars?|bucks?|usd|\$)/i,
      /(?:spent|paid|cost)\s+(\d+\.?\d*)/i,
      /(\d+\.?\d*)\s+(?:on|for)/i,
      /\$\s*(\d+\.?\d*)/,
      /(\d+\.?\d*)/,
    ];

    let amount: number | undefined;
    for (const pattern of amountPatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        amount = parseFloat(match[1]);
        confidence += 0.4;
        break;
      }
    }

    // Detect category
    let categoryId: string | undefined;
    let maxMatches = 0;

    for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        categoryId = catId;
      }
    }

    if (categoryId) {
      confidence += 0.3;
    }

    // Extract description
    let description = text;
    if (amount) {
      description = description.replace(/\d+\.?\d*\s*(?:dollars?|bucks?|usd|\$)/gi, '').trim();
      description = description.replace(/(?:spent|paid|cost|for|on)/gi, '').trim();
    }

    if (description.length > 3) {
      confidence += 0.3;
    }

    return {
      amount,
      categoryId,
      description: description || undefined,
      confidence: Math.min(confidence, 1),
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Request permissions
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        setError('Microphone permission not granted');
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setTranscription('');
      setparsedData(null);
    } catch (err) {
      setError('Failed to start recording');
      console.error('Recording error:', err);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (!uri) {
        throw new Error('No recording URI');
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Send audio to backend for processing
      const formData = new FormData();
      
      // Create a file object from the audio URI
      const audioFile = {
        uri,
        type: 'audio/wav',
        name: 'recording.wav',
      } as any;
      
      formData.append('file', audioFile);

      const response = await fetch(
        `${buildUrl(API_ENDPOINTS.PROCESS_AUDIO)}?user_id=${user.id}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process audio');
      }

      const result = await response.json();
      setProcessedExpenses(result.expense_ids || []);
      setTranscription(result.message || 'Processing complete');
      
      // Refresh transactions to include new expenses
      if (user.id) {
        await fetchTransactions(parseInt(user.id));
      }

      setIsProcessing(false);
      setRecording(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process recording');
      setIsProcessing(false);
      console.error('Processing error:', err);
    }
  }, [recording, user, fetchTransactions]);

  const reset = useCallback(() => {
    setIsRecording(false);
    setIsProcessing(false);
    setTranscription('');
    setparsedData(null);
    setError(null);
    setRecording(null);
    setProcessedExpenses([]);
  }, []);

  return {
    isRecording,
    isProcessing,
    transcription,
    parsedData,
    startRecording,
    stopRecording,
    reset,
    processedExpenses,
    error,
  };
};
