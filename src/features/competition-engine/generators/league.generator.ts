import { Match, Participant } from "../types/competition.types";

export function generateLeagueFixtures(
  participants: Participant[]
): Match[] {
  const teams = [...participants];

  if (teams.length % 2 !== 0) {
    teams.push({
      id: "bye",
      name: "BYE",
    });
  }

  const totalRounds = teams.length - 1;
  const matchesPerRound = teams.length / 2;

  const rounds: Match[] = [];

  for (let round = 0; round < totalRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = teams[match];
      const away = teams[teams.length - 1 - match];

      if (home.id !== "bye" && away.id !== "bye") {
        rounds.push({
          id: crypto.randomUUID(),

          round: round + 1,

          homeParticipant: home,
          awayParticipant: away,

          status: "PENDING",
        });
      }
    }

    teams.splice(1, 0, teams.pop()!);
  }

  return rounds;
}