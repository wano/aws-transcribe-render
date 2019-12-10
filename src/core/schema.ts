export interface TranscribeResult {
  jobName: string;
  accountId: string;
  results: Results;
  status: string;
}
export interface Results {
  transcripts?: (TranscriptsEntity)[] | null;
  speaker_labels: SpeakerLabels;
  items?: (ItemsEntity)[] | null;
}
export interface TranscriptsEntity {
  transcript: string;
}
export interface SpeakerLabels {
  speakers: number;
  segments: (SegmentsEntity)[] ;
}
export interface SegmentsEntity {
  start_time: string;
  speaker_label: string;
  end_time: string;
  items: (ItemsEntity1)[] ;
}
export interface ItemsEntity1 {
  start_time: string;
  speaker_label: string;
  end_time: string;
}
export interface ItemsEntity {
  start_time?: string | null;
  end_time?: string | null;
  alternatives: (AlternativesEntity)[];
  type: string;
}
export interface AlternativesEntity {
  confidence: string;
  content: string;
}
