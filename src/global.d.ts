interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  declare class SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }
  
  declare class SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    readonly length: number;
  }
  
  declare class SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    readonly length: number;
    readonly isFinal: boolean;
  }
  
  declare class SpeechRecognitionAlternative {
    readonly confidence: number;
    readonly transcript: string;
  }
  