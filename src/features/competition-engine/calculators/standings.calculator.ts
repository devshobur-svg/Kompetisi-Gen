import {
  Match,
  Participant,
  Standing,
} from "../types/competition.types";

export function calculateStandings(
  participants: Participant[],
  matches: Match[]
): Standing[] {
  const standings: Record<string, Standing> = {};

  participants.forEach((participant) => {
    standings[participant.id] = {
      participantId: participant.id,
      participantName: participant.name,

      played: 0,
      win: 0,
      draw: 0,
      lose: 0,

      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,

      points: 0,
    };
  });

  matches.forEach((match) => {
    if (
      match.status !== "FINISHED" ||
      match.homeScore === undefined ||
      match.awayScore === undefined
    ) {
      return;
    }

    const home = standings[match.homeParticipant.id];
    const away = standings[match.awayParticipant.id];

    home.played++;
    away.played++;

    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;

    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    home.goalDifference =
      home.goalsFor - home.goalsAgainst;

    away.goalDifference =
      away.goalsFor - away.goalsAgainst;

    if (match.homeScore > match.awayScore) {
      home.win++;
      away.lose++;

      home.points += 3;
    } else if (match.homeScore < match.awayScore) {
      away.win++;
      home.lose++;

      away.points += 3;
    } else {
      home.draw++;
      away.draw++;

      home.points += 1;
      away.points += 1;
    }
  });

  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    return b.goalDifference - a.goalDifference;
  });
}