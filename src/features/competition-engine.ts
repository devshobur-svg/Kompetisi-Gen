export type Participant = {
  id: string;

  name: string;
};

export type Fixture = {
  round: number;

  home: Participant;

  away: Participant;

  homeScore?: number;

  awayScore?: number;

  status?: "PENDING" | "COMPLETED";
};

export function generateLeagueFixtures(
  participants: Participant[]
): Fixture[] {
  const fixtures: Fixture[] = [];

  const teams = [...participants];

  if (teams.length % 2 !== 0) {
    teams.push({
      id: "bye",
      name: "BYE",
    });
  }

  const totalRounds =
    teams.length - 1;

  const half =
    teams.length / 2;

  for (
    let round = 0;
    round < totalRounds;
    round++
  ) {
    for (
      let i = 0;
      i < half;
      i++
    ) {
      const home = teams[i];

      const away =
        teams[
          teams.length - 1 - i
        ];

      if (
        home.name !== "BYE" &&
        away.name !== "BYE"
      ) {
        fixtures.push({
          round: round + 1,

          home,

          away,

          homeScore: 0,

          awayScore: 0,

          status: "PENDING",
        });
      }
    }

    const fixed = teams[0];

    const rotated = [
      fixed,
      teams[teams.length - 1],
      ...teams.slice(
        1,
        teams.length - 1
      ),
    ];

    teams.splice(
      0,
      teams.length,
      ...rotated
    );
  }

  return fixtures;
}