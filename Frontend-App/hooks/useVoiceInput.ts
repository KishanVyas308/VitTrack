import { Audio } from 'expo-av';
import { useCallback, useState } from 'react';
import { CATEGORY_KEYWORDS } from '../constants/Categories';
import { VoiceExpenseData } from '../types';

interface UseVoiceInputReturn {
  isRecording: boolean;
  isProcessing: boolean;
  transcription: string;
  parsedData: VoiceExpenseData | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  reset: () => void;
  error: string | null;
}

export const useVoiceInput = (): UseVoiceInputReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [parsedData, setparsedData] = useState<VoiceExpenseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

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
      
      // For demo purposes, simulate transcription
      // In production, you would send the audio to a speech-to-text service
      // like Google Cloud Speech-to-Text, AWS Transcribe, or Azure Speech
      
      // Simulated transcription for demo
      setTimeout(() => {
        const mockTranscription = 'Spent 50 dollars on groceries';
        setTranscription(mockTranscription);
        
        const parsed = parseTranscription(mockTranscription);
        setparsedData(parsed);
        setIsProcessing(false);
      }, 1500);

      setRecording(null);
    } catch (err) {
      setError('Failed to process recording');
      setIsProcessing(false);
      console.error('Processing error:', err);
    }
  }, [recording, parseTranscription]);

  const reset = useCallback(() => {
    setIsRecording(false);
    setIsProcessing(false);
    setTranscription('');
    setparsedData(null);
    setError(null);
    setRecording(null);
  }, []);

  return {
    isRecording,
    isProcessing,
    transcription,
    parsedData,
    startRecording,
    stopRecording,
    reset,
    error,
  };
};
