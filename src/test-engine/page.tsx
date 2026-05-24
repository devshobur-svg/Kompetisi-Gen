import {
  generateLeagueFixtures,
  calculateStandings,
  Participant,
} from "../../features/competition-engine";

export default function TestEnginePage() {
  const participants: Participant[] = [
    { id: "1", name: "Garuda FC" },
    { id: "2", name: "Rajawali FC" },
    { id: "3", name: "Tiger FC" },
    { id: "4", name: "Elang FC" },
  ];

  const fixtures = generateLeagueFixtures(participants);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        League Fixtures
      </h1>

      <div className="space-y-4">
        {fixtures.map((match) => (
          <div
            key={match.id}
            className="border rounded-lg p-4"
          >
            <div>
              Round {match.round}
            </div>

            <div className="font-semibold">
              {match.homeParticipant.name} vs{" "}
              {match.awayParticipant.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}