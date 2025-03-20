export interface MenstruationDay {
  date: string;
  type: "BLEEDING" | "FERTILITY" | "OVULATION" | "NORMAL";
  note: string;
}

export interface CycleInfo {
  totalDays: number;
  currentDay: number;
}

export interface MenstruationDaysResponse {
  success: boolean;
  data: {
    cycleInfo: CycleInfo;
    menstrationDays: MenstruationDay[];
  };
}

export interface CycleData {
  totalDays: number;
  currentDay: number;
  days: MenstruationDay[];
}
