export type Competition = {
  id?: string;

  name: string;

  sportType: string;

  formatType: "LEAGUE" | "KNOCKOUT";

  status: "DRAFT" | "ONGOING" | "FINISHED";

  createdAt: string;
};