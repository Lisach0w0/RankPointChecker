import { FieldValue } from "firebase/firestore";

export type RankOptions = {
  name: string;
  point: number;
};

// firebaseに保存する型定義
export type PointCheckerSetting = {
  id: string;
  createdAt: Date | FieldValue;
  updatedAt: Date | FieldValue;
  organizer: string;
  rankPoints: RankOptions[];
  targetPoint: number;
  isPublish: boolean;
  title: string;
};

export type UpdatePointCheckerSetting = {
  id: string;
  updatedAt: Date | FieldValue;
  organizer: string;
  rankPoints: RankOptions[];
  targetPoint: number;
  isPublish: boolean;
  title: string;
};
