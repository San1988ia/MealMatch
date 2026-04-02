export type SuggestionStatus = "can-make-now" | "missing-few" | "missing-many";

export type Suggestion = {
  id: string;
  title: string;
  image?: string;
  url?: string;
  source?: string;
  match?: number;
  have?: string[];
  missing?: string[];
  status?: SuggestionStatus;
};
