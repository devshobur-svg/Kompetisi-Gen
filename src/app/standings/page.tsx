"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  Trophy,
  ChevronRight,
} from "lucide-react";

import { db } from "../../lib/firebase";

import BottomNav from "../../components/BottomNav";

type Fixture = {
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
};

type Competition = {
  id: string;
  name: string;
  sport: string;
  format: string;
  participants: string[];
  fixtures: Fixture[];
};

type StandingRow = {
  team: string;
  mp: number;
  win: number;
  draw: number;
  lose: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  last5: string[];
};

export default function StandingsPage() {
  const [competitions, setCompetitions] =
    useState<Competition[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  async function fetchCompetitions() {
    try {
      const snapshot =
        await getDocs(
          collection(
            db,
            "competitions"
          )
        );

      const data =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Competition),
        }));

      setCompetitions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStandings(
    competition: Competition
  ): StandingRow[] {
    const table: Record<
      string,
      StandingRow
    > = {};

    competition.participants.forEach(
      (team) => {
        table[team] = {
          team,
          mp: 0,
          win: 0,
          draw: 0,
          lose: 0,
          gf: 0,
          ga: 0,
          gd: 0,
          pts: 0,
          last5: [],
        };
      }
    );

    competition.fixtures?.forEach(
      (match) => {
        if (
          match.homeScore ===
            undefined ||
          match.awayScore ===
            undefined
        ) {
          return;
        }

        const home =
          table[match.home];

        const away =
          table[match.away];

        home.mp += 1;
        away.mp += 1;

        home.gf +=
          match.homeScore;

        home.ga +=
          match.awayScore;

        away.gf +=
          match.awayScore;

        away.ga +=
          match.homeScore;

        if (
          match.homeScore >
          match.awayScore
        ) {
          home.win += 1;
          home.pts += 3;

          away.lose += 1;

          home.last5.unshift("W");
          away.last5.unshift("L");
        } else if (
          match.homeScore <
          match.awayScore
        ) {
          away.win += 1;
          away.pts += 3;

          home.lose += 1;

          away.last5.unshift("W");
          home.last5.unshift("L");
        } else {
          home.draw += 1;
          away.draw += 1;

          home.pts += 1;
          away.pts += 1;

          home.last5.unshift("D");
          away.last5.unshift("D");
        }

        home.gd =
          home.gf - home.ga;

        away.gd =
          away.gf - away.ga;

        home.last5 =
          home.last5.slice(0, 5);

        away.last5 =
          away.last5.slice(0, 5);
      }
    );

    return Object.values(table).sort(
      (a, b) => {
        if (b.pts !== a.pts) {
          return b.pts - a.pts;
        }

        return b.gd - a.gd;
      }
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] text-white p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white pb-32">
      <div className="max-w-md mx-auto px-4 py-5">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/40 text-sm">
              Competition
            </div>

            <h1 className="text-3xl font-black mt-1">
              Standings
            </h1>
          </div>

          <div
            className="
              w-14
              h-14
              rounded-3xl
              bg-gradient-to-br
              from-yellow-500
              to-orange-500
              flex
              items-center
              justify-center
            "
          >
            <Trophy size={26} />
          </div>
        </div>

        {/* COMPETITIONS */}
        <div className="mt-8 space-y-8">
          {competitions.map(
            (competition) => {
              const standings =
                calculateStandings(
                  competition
                );

              return (
                <div
                  key={
                    competition.id
                  }
                  className="
                    rounded-[32px]
                    overflow-hidden
                    border
                    border-white/10
                    bg-[#111827]
                  "
                >
                  {/* TOP */}
                  <Link
                    href={`/competitions/${competition.id}`}
                  >
                    <div
                      className="
                        p-5
                        bg-gradient-to-r
                        from-blue-600
                        to-purple-700
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <div>
                        <div className="text-white/70 text-sm">
                          {
                            competition.sport
                          }
                        </div>

                        <div className="text-2xl font-black mt-1">
                          {
                            competition.name
                          }
                        </div>
                      </div>

                      <ChevronRight
                        size={22}
                      />
                    </div>
                  </Link>

                  {/* TABLE HEADER */}
                  <div
                    className="
                      grid
                      grid-cols-[40px_1fr_32px_32px_32px_32px_40px_40px_40px_44px]
                      gap-2
                      px-4
                      py-3
                      text-[11px]
                      font-bold
                      text-white/40
                      border-b
                      border-white/10
                    "
                  >
                    <div>#</div>
                    <div>Club</div>
                    <div>MP</div>
                    <div>W</div>
                    <div>D</div>
                    <div>L</div>
                    <div>GF</div>
                    <div>GA</div>
                    <div>GD</div>
                    <div>Pts</div>
                  </div>

                  {/* TABLE BODY */}
                  <div>
                    {standings.map(
                      (
                        team,
                        index
                      ) => (
                        <div
                          key={
                            team.team
                          }
                          className="
                            border-b
                            border-white/5
                            last:border-none
                            px-4
                            py-4
                          "
                        >
                          {/* ROW */}
                          <div
                            className="
                              grid
                              grid-cols-[40px_1fr_32px_32px_32px_32px_40px_40px_40px_44px]
                              gap-2
                              items-center
                              text-sm
                            "
                          >
                            {/* POSITION */}
                            <div>
                              <div
                                className={`
                                  w-7
                                  h-7
                                  rounded-lg
                                  flex
                                  items-center
                                  justify-center
                                  font-bold
                                  text-xs
                                  ${
                                    index ===
                                    0
                                      ? "bg-yellow-500 text-black"
                                      : index ===
                                        1
                                      ? "bg-gray-300 text-black"
                                      : index ===
                                        2
                                      ? "bg-orange-500 text-black"
                                      : "bg-white/10 text-white"
                                  }
                                `}
                              >
                                {index + 1}
                              </div>
                            </div>

                            {/* TEAM */}
                            <div className="font-semibold truncate">
                              {
                                team.team
                              }
                            </div>

                            {/* STATS */}
                            <div className="text-center">
                              {team.mp}
                            </div>

                            <div className="text-center text-green-400">
                              {team.win}
                            </div>

                            <div className="text-center text-yellow-400">
                              {team.draw}
                            </div>

                            <div className="text-center text-red-400">
                              {team.lose}
                            </div>

                            <div className="text-center">
                              {team.gf}
                            </div>

                            <div className="text-center">
                              {team.ga}
                            </div>

                            <div className="text-center">
                              {team.gd}
                            </div>

                            <div className="text-center font-black text-purple-400">
                              {team.pts}
                            </div>
                          </div>

                          {/* LAST 5 */}
                          <div className="flex items-center justify-between mt-4 pl-10">
                            <div className="text-[11px] text-white/40">
                              Last 5
                            </div>

                            <div className="flex gap-2">
                              {team.last5.length >
                              0 ? (
                                team.last5.map(
                                  (
                                    result,
                                    resultIndex
                                  ) => (
                                    <div
                                      key={
                                        resultIndex
                                      }
                                      className={`
                                        w-7
                                        h-7
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                        text-[11px]
                                        font-bold
                                        ${
                                          result ===
                                          "W"
                                            ? "bg-green-500/20 text-green-400"
                                            : result ===
                                              "L"
                                            ? "bg-red-500/20 text-red-400"
                                            : "bg-yellow-500/20 text-yellow-400"
                                        }
                                      `}
                                    >
                                      {
                                        result
                                      }
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="text-[11px] text-white/30">
                                  No matches
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}