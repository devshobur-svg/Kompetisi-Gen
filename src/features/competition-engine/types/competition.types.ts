export type Participant = {
  id: string;
  name: string;
};

export type Match = {
  id: string;

  round: number;

  homeParticipant: Participant;
  awayParticipant: Participant;

  homeScore?: number;
  awayScore?: number;

  status: "PENDING" | "LIVE" | "FINISHED";
};

export type Standing = {
  participantId: string;
  participantName: string;

  played: number;
  win: number;
  draw: number;
  lose: number;

  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;

  points: number;
};