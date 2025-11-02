import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHaptics } from '../../hooks/useHaptics';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { VoiceExpenseData } from '../../types';

interface VoiceInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: VoiceExpenseData & { amount: number; categoryId: string }) => void;
}

type VoiceState = 'initial' | 'recording' | 'processing' | 'success';

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { trigger } = useHaptics();
  const {
    isRecording,
    isProcessing,
    transcription,
    parsedData,
    startRecording,
    stopRecording,
    reset,
    error,
    processedExpenses,
  } = useVoiceInput();

  const [voiceState, setVoiceState] = useState<VoiceState>('initial');
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasAutoCompleted, setHasAutoCompleted] = useState(false);

  // Wave animations (20 bars)
  const waveAnimations = useRef(
    Array(20).fill(0).map(() => new Animated.Value(0.3))
  ).current;

  // Pulse animations for icons
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Update voice state based on recording/processing status
  useEffect(() => {
    if (isRecording) {
      setVoiceState('recording');
    } else if (isProcessing) {
      setVoiceState('processing');
    } else if (showSuccess) {
      setVoiceState('success');
    } else {
      setVoiceState('initial');
    }
  }, [isRecording, isProcessing, showSuccess]);

  // Auto-close when processing completes and expenses are created
  useEffect(() => {
    if (!isProcessing && !isRecording && processedExpenses.length > 0 && !hasAutoCompleted) {
      setHasAutoCompleted(true);
      setShowSuccess(true);
      
      // Close modal after brief success display to trigger review modal
      setTimeout(() => {
        onClose();
        // Don't reset immediately - let parent handle review modal first
        setTimeout(() => {
          setShowSuccess(false);
          setHasAutoCompleted(false);
          reset();
        }, 500);
      }, 1500);
    }
  }, [isProcessing, isRecording, processedExpenses, hasAutoCompleted, onClose, reset]);

  // Wave animations based on state
  useEffect(() => {
    if (voiceState === 'recording') {
      // Recording: Dynamic wave animation
      waveAnimations.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 50),
            Animated.timing(anim, {
              toValue: 0.3 + Math.random() * 0.7,
              duration: 300 + Math.random() * 200,
              useNativeDriver: false,
            }),
          ])
        ).start();
      });
    } else if (voiceState === 'processing') {
      // Processing: Flowing wave animation
      waveAnimations.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 100),
            Animated.timing(anim, {
              toValue: 0.8,
              duration: 800,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 800,
              useNativeDriver: false,
            }),
          ])
        ).start();
      });
    } else if (voiceState === 'success') {
      // Success: Static bars
      waveAnimations.forEach((anim) => {
        anim.setValue(0.5 + Math.random() * 0.3);
      });
    } else {
      // Initial: Static low bars
      waveAnimations.forEach((anim) => {
        anim.setValue(0.3);
      });
    }
  }, [voiceState]);

  // Pulse animation for recording dot and processing icon
  useEffect(() => {
    if (voiceState === 'recording' || voiceState === 'processing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [voiceState]);

  // Rotate animation for processing icon
  useEffect(() => {
    if (voiceState === 'processing') {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [voiceState]);

  // Reset on close
  useEffect(() => {
    if (!visible) {
      setShowSuccess(false);
      setHasAutoCompleted(false);
      reset();
    }
  }, [visible, reset]);

  const handleMicPress = () => {
    trigger('medium');
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Note: handleSave removed - expenses are created via backend /process_audio/
  // and the review modal opens automatically after processing completes

  const handleClose = () => {
    trigger('light');
    onClose();
  };

  // Get colors based on state
  const getStateColors = () => {
    switch (voiceState) {
      case 'recording':
        return {
          header: '#1e2139',
          subtitle: 'Listening to your transaction...',
          waveColor: ['#8b5cf6', '#6366f1'] as const,
          buttonColor: ['#ef4444', '#dc2626'] as const,
          icon: 'mic-off',
          statusDot: '#ef4444',
          statusText: 'Recording',
        };
      case 'processing':
        return {
          header: '#1a1d29',
          subtitle: 'Processing your input...',
          waveColor: ['#8b5cf6', '#a78bfa'] as const,
          buttonColor: ['#8b5cf6', '#6366f1'] as const,
          icon: 'sparkles',
          statusDot: '#8b5cf6',
          statusText: 'Processing',
        };
      case 'success':
        return {
          header: '#10b981',
          subtitle: 'Transaction saved successfully!',
          waveColor: ['#10b981', '#14b8a6'] as const,
          buttonColor: ['#10b981', '#059669'] as const,
          icon: 'checkmark-circle',
          statusDot: '#10b981',
          statusText: 'Completed',
        };
      default:
        return {
          header: '#1a1d29',
          subtitle: 'Speak naturally about your expense',
          waveColor: ['#4a5568', '#6b7280'] as const,
          buttonColor: ['#8b5cf6', '#6366f1'] as const,
          icon: 'mic',
          statusDot: '#8b5cf6',
          statusText: 'Ready',
        };
    }
  };

  const stateColors = getStateColors();
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent
    >
      <View className="flex-1" style={{ backgroundColor: stateColors.header }}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView className="flex-1" edges={['top']}>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View className="px-5 pt-4 pb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white text-2xl font-black">Voice Assistant</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-10 h-10 bg-gray-800/50 rounded-full items-center justify-center"
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-400 text-sm font-medium">{stateColors.subtitle}</Text>
            </View>

            {/* Main Audio Visualization Card */}
            <View className="px-5 mb-6">
              <View className="bg-[#252938] rounded-3xl p-6">
                {/* Waveform Visualization */}
                <View className="flex-row items-center justify-center h-24 mb-8 gap-1">
                  {waveAnimations.map((anim, index) => (
                    <Animated.View
                      key={index}
                      className="w-1 rounded-full"
                      style={{
                        height: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [8, 96],
                        }),
                        backgroundColor: voiceState === 'initial' ? '#4a5568' : 
                          voiceState === 'success' ? '#10b981' : '#8b5cf6',
                      }}
                    />
                  ))}
                </View>

                {/* Microphone/Action Button */}
                <View className="items-center">
                  <TouchableOpacity
                    onPress={voiceState === 'initial' || voiceState === 'recording' ? handleMicPress : undefined}
                    activeOpacity={0.8}
                    disabled={voiceState === 'processing' || voiceState === 'success'}
                    className="items-center justify-center"
                    style={{
                      width: 120,
                      height: 120,
                      shadowColor: stateColors.buttonColor[0],
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.4,
                      shadowRadius: 16,
                      elevation: 12,
                    }}
                  >
                    <LinearGradient
                      colors={stateColors.buttonColor}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {voiceState === 'processing' ? (
                        <Animated.View style={{ transform: [{ rotate }] }}>
                          <Ionicons name="sparkles" size={48} color="#fff" />
                        </Animated.View>
                      ) : (
                        <Ionicons name={stateColors.icon as any} size={48} color="#fff" />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Status Indicator */}
                  {(voiceState === 'recording' || voiceState === 'processing' || voiceState === 'success') && (
                    <View className="mt-6 bg-gray-800/50 rounded-full px-4 py-2 flex-row items-center gap-2">
                      <Animated.View
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: stateColors.statusDot,
                          transform: [{ scale: voiceState === 'success' ? 1 : pulseAnim }],
                        }}
                      />
                      <Text className="text-white text-sm font-semibold">{stateColors.statusText}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* State-specific bottom cards */}
            {voiceState === 'initial' && (
              <>
                {/* AI-Powered Recognition */}
                <View className="px-5 mb-4">
                  <View className="bg-[#252938] rounded-2xl p-5 flex-row">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                    >
                      <Ionicons name="sparkles" size={24} color="#8b5cf6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-base font-bold mb-2">
                        AI-Powered Recognition
                      </Text>
                      <Text className="text-gray-400 text-sm font-medium leading-5">
                        Automatically detects amount, category, and description from your voice
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Quick Tips */}
                <View className="px-5 mb-6">
                  <View className="bg-[#252938] rounded-2xl p-5 flex-row">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                    >
                      <Ionicons name="trending-up" size={24} color="#8b5cf6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-base font-bold mb-3">Quick Tips</Text>
                      <View className="gap-2">
                        <View className="flex-row items-start">
                          <Text className="text-gray-400 text-sm mr-2">•</Text>
                          <Text className="text-gray-400 text-sm font-medium flex-1">
                            Say the amount and category clearly
                          </Text>
                        </View>
                        <View className="flex-row items-start">
                          <Text className="text-gray-400 text-sm mr-2">•</Text>
                          <Text className="text-gray-400 text-sm font-medium flex-1">
                            Example: "Spent 25 dollars on coffee"
                          </Text>
                        </View>
                        <View className="flex-row items-start">
                          <Text className="text-gray-400 text-sm mr-2">•</Text>
                          <Text className="text-gray-400 text-sm font-medium flex-1">
                            Works with most common expenses
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}

            {voiceState === 'recording' && (
              <View className="px-5 mb-6">
                <View className="bg-[#252938] rounded-2xl p-6">
                  <Text className="text-white text-xl font-black text-center mb-2">
                    Listening...
                  </Text>
                  <Text className="text-gray-400 text-sm font-medium text-center">
                    Speak clearly about your transaction
                  </Text>
                </View>
              </View>
            )}

            {voiceState === 'processing' && (
              <View className="px-5 mb-6">
                <View className="bg-[#252938] rounded-2xl p-6">
                  <Text className="text-white text-xl font-black text-center mb-2">
                    Processing...
                  </Text>
                  <Text className="text-gray-400 text-sm font-medium text-center">
                    Analyzing your voice input...
                  </Text>
                </View>
              </View>
            )}

            {voiceState === 'success' && (
              <View className="px-5 mb-6">
                <View className="bg-[#252938] rounded-2xl p-6">
                  <Text className="text-white text-xl font-black text-center mb-2">
                    Expenses Processed!
                  </Text>
                  <Text className="text-gray-400 text-sm font-medium text-center">
                    {processedExpenses.length > 0 
                      ? `${processedExpenses.length} expense${processedExpenses.length > 1 ? 's' : ''} created successfully`
                      : 'Your expenses have been recorded'
                    }
                  </Text>
                  <Text className="text-gray-500 text-xs font-medium text-center mt-2">
                    Opening review modal...
                  </Text>
                </View>
              </View>
            )}

            {/* Show transcription if available during processing */}
            {transcription && voiceState === 'processing' && (
              <View className="px-5 mb-6">
                <View className="bg-[#252938] rounded-2xl p-5">
                  <Text className="text-white text-sm font-medium text-center mb-2">
                    Transcribed:
                  </Text>
                  <Text className="text-gray-400 text-sm italic text-center">
                    "{transcription}"
                  </Text>
                </View>
              </View>
            )}

            {error && (
              <View className="px-5 mb-6">
                <View className="bg-red-500/20 border border-red-500 rounded-2xl p-4">
                  <Text className="text-red-500 text-sm font-medium text-center">
                    {error}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};
