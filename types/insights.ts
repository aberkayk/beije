export interface Insight {
  _id: string;
  title: string;
  content: string;
}

export interface InsightsResponse {
  success: boolean;
  data: {
    insights: Insight[];
  };
}
