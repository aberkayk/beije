export interface MenstruationDay {
  date: string;
  type: "BLEEDING";
  note: string;
}

export interface MenstruationDaysResponse {
  success: boolean;
  data: {
    menstruationDays: MenstruationDay[];
  };
}
