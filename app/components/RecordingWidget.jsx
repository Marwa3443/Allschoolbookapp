'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2, Upload, CheckCircle } from 'lucide-react';

export default function RecordingWidget({ surahName, verseNumber, onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [errors, setErrors] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        analyzeRecording(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('يرجى السماح بالوصول إلى الميكروفون');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeRecording = (audioBlob) => {
    // Simulated analysis - in production, this would call a real speech recognition API
    const randomAccuracy = Math.floor(Math.random() * 40) + 60;
    setAccuracy(randomAccuracy);

    const mockErrors = [
      { position: 2, type: 'pronunciation', word: 'الرَّحْمَن', correct: 'الرَّحْمِن' },
      { position: 5, type: 'emphasis', word: 'كَبِيرٌ', correct: 'كَبِيرٌ' },
    ];

    if (randomAccuracy < 85) {
      setErrors(mockErrors);
    } else {
      setErrors([]);
    }
  };

  const clearRecording = () => {
    setRecordedAudio(null);
    setAccuracy(null);
    setErrors([]);
  };

  const submitRecording = () => {
    if (recordedAudio) {
      onRecordingComplete(recordedAudio);
      clearRecording();
      alert('تم حفظ التسميع بنجاح!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Recording Instructions */}
      <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg">
        <h4 className="font-bold text-blue-900 mb-2">تعليمات التسميع</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>تأكد من وضوح صوتك والخلو من الضوضاء</li>
          <li>اقرأ الآية بتمهل وتركيز على التجويد</li>
          <li>سجل تسميعك مرة واحدة بدون توقف</li>
          <li>تحقق من النتائج واستمع إلى ملاحظاتنا</li>
        </ul>
      </div>

      {/* Recording Controls */}
      <div className="islamic-card p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-islamic-dark mb-2">سورة {surahName} - الآية {verseNumber}</h3>
          <p className="text-gray-600">سجّل قراءتك للآية الكريمة</p>
        </div>

        {/* Main Recording Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse'
                : 'bg-islamic-secondary hover:bg-opacity-90'
            }`}
          >
            {isRecording ? (
              <Square size={40} className="text-white" />
            ) : (
              <Mic size={40} className="text-islamic-dark" />
            )}
          </button>
        </div>

        {/* Timer */}
        {isRecording && (
          <div className="text-center text-islamic-secondary font-bold text-2xl mb-8">
            00:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
          </div>
        )}

        {/* Recorded Audio Playback */}
        {recordedAudio && !isRecording && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h4 className="font-bold text-islamic-dark mb-4">قراءتك المسجلة</h4>
            <audio
              src={recordedAudio}
              controls
              className="w-full mb-4"
            />
            <button
              onClick={clearRecording}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 size={20} />
              حذف التسجيل
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {accuracy !== null && (
          <div className="space-y-6">
            {/* Accuracy Score */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-r-4 border-green-500">
              <div className="text-center">
                <h4 className="font-bold text-islamic-dark mb-4">نتائج التحليل</h4>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600 mb-2">{accuracy}%</div>
                    <p className="text-gray-600">معدل الإتقان</p>
                  </div>
                  <div className="w-32 h-32 rounded-full border-8 border-green-200 flex items-center justify-center">
                    <div
                      className="w-28 h-28 rounded-full border-8 border-green-600 flex items-center justify-center bg-green-50"
                      style={{
                        background: `conic-gradient(rgb(34, 197, 94) 0deg ${accuracy * 3.6}deg, rgb(229, 231, 235) ${accuracy * 3.6}deg)`
                      }}
                    >
                      <span className="font-bold text-green-600">{accuracy}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Errors if any */}
            {errors.length > 0 && (
              <div className="bg-yellow-50 border-r-4 border-yellow-500 p-6 rounded-lg">
                <h4 className="font-bold text-yellow-900 mb-4">الأخطاء المكتشفة</h4>
                <div className="space-y-3">
                  {errors.map((error, index) => (
                    <div key={index} className="bg-white p-3 rounded">
                      <p className="text-sm font-bold text-yellow-900">
                        الكلمة {error.position}: {error.word}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        نوع الخطأ: {error.type === 'pronunciation' ? 'نطق' : 'تجويد'}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        الصيغة الصحيحة: {error.correct}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Message */}
            {errors.length === 0 && accuracy >= 85 && (
              <div className="bg-green-50 border-r-4 border-green-500 p-6 rounded-lg text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-green-900 font-bold mb-2">ممتاز! قراءتك صحيحة</p>
                <p className="text-green-700 text-sm">استمر في الممارسة للوصول إلى الكمال</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      {recordedAudio && accuracy !== null && (
        <button
          onClick={submitRecording}
          className="w-full islamic-btn-primary"
        >
          <Upload size={20} className="inline mr-2" />
          حفظ التسميع
        </button>
      )}
    </div>
  );
}
