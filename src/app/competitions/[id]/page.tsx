"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  Trophy,
  Users,
  CalendarDays,
  Target,
  ArrowLeft,
  Save,
  Wand2,
  Plus,
  Shield,
  Flame,
  TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";

import { db } from "../../../lib/firebase";
import BottomNav from "../../../components/BottomNav";

type Fixture = {
  week: number;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "upcoming" | "played";
};

type Competition = {
  id: string;
  name: string;
  sport: string;
  format: string;
  status: string;
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
  homePts: number;
  awayPts: number;
  deduction: number;
  form: string[];
};

export default function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [competition, setCompetition] =
    useState<Competition | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [competitionId, setCompetitionId] =
    useState("");

  const [participantName, setParticipantName] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<
      | "participants"
      | "fixtures"
      | "standings"
    >("participants");

  useEffect(() => {
    async function loadParams() {
      const resolved =
        await params;

      setCompetitionId(
        resolved.id
      );
    }

    loadParams();
  }, [params]);

  useEffect(() => {
    if (!competitionId) return;

    fetchCompetition();
  }, [competitionId]);

  async function fetchCompetition() {
    try {
      const ref = doc(
        db,
        "competitions",
        competitionId
      );

      const snapshot =
        await getDoc(ref);

      if (!snapshot.exists()) {
        return;
      }

      const data =
        snapshot.data() as Competition;

      setCompetition({
        id: snapshot.id,
        ...data,
        fixtures:
          data.fixtures || [],
        participants:
          data.participants || [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddParticipant() {
    if (!competition) return;

    if (!participantName.trim()) {
      return;
    }

    if (
      competition.participants.includes(
        participantName
      )
    ) {
      alert(
        "Participant already exists"
      );

      return;
    }

    const updatedParticipants = [
      ...competition.participants,
      participantName,
    ];

    try {
      await updateDoc(
        doc(
          db,
          "competitions",
          competition.id
        ),
        {
          participants:
            updatedParticipants,
        }
      );

      setCompetition({
        ...competition,
        participants:
          updatedParticipants,
      });

      setParticipantName("");
    } catch (error) {
      console.error(error);
    }
  }

  function generateLeagueFixtures(
    teams: string[]
  ): Fixture[] {
    const fixtures: Fixture[] = [];

    let participants = [...teams];

    if (
      participants.length % 2 !==
      0
    ) {
      participants.push("BYE");
    }

    const rounds =
      participants.length - 1;

    const matchesPerRound =
      participants.length / 2;

    for (
      let round = 0;
      round < rounds;
      round++
    ) {
      for (
        let match = 0;
        match < matchesPerRound;
        match++
      ) {
        const home =
          participants[match];

        const away =
          participants[
            participants.length -
              1 -
              match
          ];

        if (
          home !== "BYE" &&
          away !== "BYE"
        ) {
          fixtures.push({
            week: round + 1,
            home,
            away,
            homeScore: null,
            awayScore: null,
            status:
              "upcoming",
          });
        }
      }

      const fixed =
        participants[0];

      const rotate =
        participants.slice(1);

      rotate.unshift(
        rotate.pop() as string
      );

      participants = [
        fixed,
        ...rotate,
      ];
    }

    return fixtures;
  }

  async function handleGenerateFixtures() {
    if (!competition) return;

    if (
      competition.participants
        .length < 2
    ) {
      alert(
        "Minimum 2 participants"
      );

      return;
    }

    const fixtures =
      generateLeagueFixtures(
        competition.participants
      );

    try {
      await updateDoc(
        doc(
          db,
          "competitions",
          competition.id
        ),
        {
          fixtures,
        }
      );

      setCompetition({
        ...competition,
        fixtures,
      });

      setActiveTab(
        "fixtures"
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function saveScores() {
    if (!competition) return;

    try {
      setSaving(true);

      const updatedFixtures =
        competition.fixtures.map(
          (fixture) => ({
            ...fixture,
            status:
              fixture.homeScore !==
                null &&
              fixture.awayScore !==
                null
                ? "played"
                : "upcoming",
          })
        );

      await updateDoc(
        doc(
          db,
          "competitions",
          competition.id
        ),
        {
          fixtures:
            updatedFixtures,
        }
      );

      setCompetition({
        ...competition,
        fixtures:
          updatedFixtures,
      });

      alert(
        "Scores updated 🚀"
      );
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  function updateScore(
    index: number,
    field:
      | "homeScore"
      | "awayScore",
    value: string
  ) {
    if (!competition) return;

    const updatedFixtures = [
      ...competition.fixtures,
    ];

    updatedFixtures[index] = {
      ...updatedFixtures[index],
      [field]:
        value === ""
          ? null
          : Number(value),
    };

    setCompetition({
      ...competition,
      fixtures: updatedFixtures,
    });
  }

  const standings =
    useMemo(() => {
      if (!competition)
        return [];

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
            homePts: 0,
            awayPts: 0,
            deduction: 0,
            form: [],
          };
        }
      );

      competition.fixtures.forEach(
        (match) => {
          if (
            match.homeScore ===
              null ||
            match.awayScore ===
              null
          ) {
            return;
          }

          const home =
            table[match.home];

          const away =
            table[match.away];

          home.mp++;
          away.mp++;

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
            home.win++;
            home.pts += 3;
            home.homePts += 3;

            away.lose++;

            home.form.unshift("W");
            away.form.unshift("L");
          } else if (
            match.homeScore <
            match.awayScore
          ) {
            away.win++;
            away.pts += 3;
            away.awayPts += 3;

            home.lose++;

            away.form.unshift("W");
            home.form.unshift("L");
          } else {
            home.draw++;
            away.draw++;

            home.pts++;
            away.pts++;

            home.homePts += 1;
            away.awayPts += 1;

            home.form.unshift("D");
            away.form.unshift("D");
          }

          home.gd =
            home.gf - home.ga;

          away.gd =
            away.gf - away.ga;

          home.form =
            home.form.slice(0, 5);

          away.form =
            away.form.slice(0, 5);
        }
      );

      return Object.values(table).sort(
        (a, b) => {
          if (
            b.pts !== a.pts
          ) {
            return (
              b.pts - a.pts
            );
          }

          if (
            b.gd !== a.gd
          ) {
            return (
              b.gd - a.gd
            );
          }

          return (
            b.gf - a.gf
          );
        }
      );
    }, [competition]);

  function groupedFixtures() {
    if (!competition)
      return {};

    const grouped: Record<
      number,
      Fixture[]
    > = {};

    competition.fixtures.forEach(
      (fixture) => {
        if (
          !grouped[
            fixture.week
          ]
        ) {
          grouped[
            fixture.week
          ] = [];
        }

        grouped[
          fixture.week
        ].push(fixture);
      }
    );

    return grouped;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] text-white p-6">
        Loading...
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-[#070B14] text-white p-6">
        Competition not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white pb-32">
      <div className="max-w-md mx-auto px-4 py-5">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link
            href="/competitions"
            className="
              w-12
              h-12
              rounded-2xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
            "
          >
            <ArrowLeft size={20} />
          </Link>

          <button
            onClick={saveScores}
            className="
              h-12
              px-5
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              flex
              items-center
              gap-2
              font-semibold
            "
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save"}
          </button>
        </div>

        {/* HERO */}
        <div
          className="
            mt-6
            rounded-[32px]
            bg-gradient-to-br
            from-blue-600
            to-purple-700
            p-6
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">
                Competition
              </div>

              <h1 className="text-3xl font-black mt-2">
                {competition.name}
              </h1>
            </div>

            <div
              className="
                w-16
                h-16
                rounded-3xl
                bg-white/10
                flex
                items-center
                justify-center
              "
            >
              <Trophy size={30} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div
              className="
                rounded-2xl
                bg-white/10
                p-4
              "
            >
              <Users size={18} />

              <div className="mt-2 text-sm text-white/70">
                Teams
              </div>

              <div className="text-2xl font-bold mt-1">
                {
                  competition
                    .participants
                    .length
                }
              </div>
            </div>

            <div
              className="
                rounded-2xl
                bg-white/10
                p-4
              "
            >
              <CalendarDays size={18} />

              <div className="mt-2 text-sm text-white/70">
                Matches
              </div>

              <div className="text-2xl font-bold mt-1">
                {
                  competition
                    .fixtures
                    .length
                }
              </div>
            </div>

            <div
              className="
                rounded-2xl
                bg-white/10
                p-4
              "
            >
              <TrendingUp size={18} />

              <div className="mt-2 text-sm text-white/70">
                Played
              </div>

              <div className="text-2xl font-bold mt-1">
                {
                  competition.fixtures.filter(
                    (
                      f
                    ) =>
                      f.status ===
                      "played"
                  ).length
                }
              </div>
            </div>
          </div>
        </div>

        {/* TAB */}
        <div
          className="
            mt-6
            rounded-3xl
            bg-white/5
            border
            border-white/10
            p-2
            flex
            gap-2
          "
        >
          {[
            "participants",
            "fixtures",
            "standings",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(
                  tab as any
                )
              }
              className={`
                flex-1
                h-12
                rounded-2xl
                text-sm
                font-bold
                capitalize
                transition-all
                ${
                  activeTab ===
                  tab
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-white/50"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PARTICIPANTS */}
        {activeTab ===
          "participants" && (
          <div
            className="
              mt-6
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-5
            "
          >
            <div className="text-xl font-bold mb-4">
              Participants
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Team name"
                value={
                  participantName
                }
                onChange={(e) =>
                  setParticipantName(
                    e.target.value
                  )
                }
                className="
                  flex-1
                  h-14
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-white/10
                  px-4
                  outline-none
                "
              />

              <button
                onClick={
                  handleAddParticipant
                }
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-emerald-500
                  to-teal-500
                  flex
                  items-center
                  justify-center
                "
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {competition.participants.map(
                (
                  participant,
                  index
                ) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      h-14
                      rounded-2xl
                      bg-[#111827]
                      border
                      border-white/10
                      px-4
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div className="font-semibold">
                      {
                        participant
                      }
                    </div>

                    <Shield
                      size={18}
                      className="text-white/30"
                    />
                  </motion.div>
                )
              )}
            </div>
          </div>
        )}

        {/* FIXTURES */}
        {activeTab ===
          "fixtures" && (
          <>
            <button
              onClick={
                handleGenerateFixtures
              }
              className="
                mt-6
                w-full
                h-14
                rounded-3xl
                bg-gradient-to-r
                from-emerald-500
                to-teal-500
                flex
                items-center
                justify-center
                gap-3
                font-bold
                text-lg
              "
            >
              <Wand2 size={20} />
              Generate Fixtures
            </button>

            <div className="mt-8 space-y-8">
              {Object.entries(
                groupedFixtures()
              ).map(
                (
                  [week, matches]
                ) => (
                  <div key={week}>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="
                          px-4
                          py-2
                          rounded-2xl
                          bg-gradient-to-r
                          from-blue-600
                          to-purple-600
                          text-sm
                          font-bold
                        "
                      >
                        Game Week {week}
                      </div>

                      <div className="h-[1px] flex-1 bg-white/10" />
                    </div>

                    <div className="space-y-4">
                      {matches.map(
                        (
                          match,
                          index
                        ) => {
                          const realIndex =
                            competition.fixtures.findIndex(
                              (
                                f
                              ) =>
                                f.week ===
                                  match.week &&
                                f.home ===
                                  match.home &&
                                f.away ===
                                  match.away
                            );

                          return (
                            <motion.div
                              key={
                                index
                              }
                              layout
                              className="
                                rounded-3xl
                                border
                                border-white/10
                                bg-white/5
                                p-5
                              "
                            >
                              <div className="flex items-center justify-between mb-5">
                                <div
                                  className={`
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-semibold
                                    ${
                                      match.status ===
                                      "played"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-yellow-500/20 text-yellow-400"
                                    }
                                  `}
                                >
                                  {
                                    match.status
                                  }
                                </div>

                                <Flame
                                  size={16}
                                  className="text-orange-400"
                                />
                              </div>

                              <div className="space-y-5">
                                {/* HOME */}
                                <div className="flex items-center justify-between">
                                  <div className="font-bold text-lg">
                                    {
                                      match.home
                                    }
                                  </div>

                                  <input
                                    type="number"
                                    value={
                                      match.homeScore ??
                                      ""
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateScore(
                                        realIndex,
                                        "homeScore",
                                        e
                                          .target
                                          .value
                                      )
                                    }
                                    className="
                                      w-16
                                      h-14
                                      rounded-2xl
                                      bg-[#111827]
                                      border
                                      border-white/10
                                      text-center
                                      text-xl
                                      font-bold
                                      outline-none
                                    "
                                  />
                                </div>

                                {/* AWAY */}
                                <div className="flex items-center justify-between">
                                  <div className="font-bold text-lg">
                                    {
                                      match.away
                                    }
                                  </div>

                                  <input
                                    type="number"
                                    value={
                                      match.awayScore ??
                                      ""
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateScore(
                                        realIndex,
                                        "awayScore",
                                        e
                                          .target
                                          .value
                                      )
                                    }
                                    className="
                                      w-16
                                      h-14
                                      rounded-2xl
                                      bg-[#111827]
                                      border
                                      border-white/10
                                      text-center
                                      text-xl
                                      font-bold
                                      outline-none
                                    "
                                  />
                                </div>
                              </div>
                            </motion.div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}

        {/* STANDINGS */}
        {activeTab ===
          "standings" && (
          <div className="mt-8">
            {/* LEGEND */}
            <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
              <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                Champions League
              </div>

              <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                Europa League
              </div>

              <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                Relegation
              </div>
            </div>

            {/* TABLE */}
            <div
              className="
                overflow-auto
                max-h-[72vh]
                rounded-3xl
                border
                border-white/10
                bg-white/5
              "
            >
              <table className="w-full min-w-[1100px] border-separate border-spacing-0">
                <thead
                  className="
                    sticky
                    top-0
                    z-20
                    bg-[#0B1220]
                    backdrop-blur-xl
                  "
                >
                  <tr className="text-white/60 text-sm">
                    <th className="px-4 py-4 text-left">
                      #
                    </th>

                    <th className="px-4 py-4 text-left">
                      Club
                    </th>

                    <th className="px-4 py-4 text-center">
                      MP
                    </th>

                    <th className="px-4 py-4 text-center">
                      W
                    </th>

                    <th className="px-4 py-4 text-center">
                      D
                    </th>

                    <th className="px-4 py-4 text-center">
                      L
                    </th>

                    <th className="px-4 py-4 text-center">
                      GF
                    </th>

                    <th className="px-4 py-4 text-center">
                      GA
                    </th>

                    <th className="px-4 py-4 text-center">
                      GD
                    </th>

                    <th className="px-4 py-4 text-center">
                      Home
                    </th>

                    <th className="px-4 py-4 text-center">
                      Away
                    </th>

                    <th className="px-4 py-4 text-center">
                      Ded
                    </th>

                    <th className="px-4 py-4 text-center">
                      PTS
                    </th>

                    <th className="px-4 py-4 text-center">
                      Form
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {standings.map(
                    (
                      team,
                      index
                    ) => {
                      const isCL =
                        index <= 3;

                      const isEL =
                        index === 4;

                      const isRelegation =
                        index >=
                        standings.length -
                          3;

                      return (
                        <motion.tr
                          key={
                            team.team
                          }
                          layout
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          className="
                            border-b
                            border-white/5
                            text-sm
                          "
                        >
                          {/* POSITION */}
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`
                                  w-1.5
                                  h-10
                                  rounded-full
                                  ${
                                    isCL
                                      ? "bg-blue-500"
                                      : isEL
                                      ? "bg-orange-500"
                                      : isRelegation
                                      ? "bg-red-500"
                                      : "bg-white/10"
                                  }
                                `}
                              />

                              <div
                                className="
                                  w-8
                                  h-8
                                  rounded-full
                                  bg-white/10
                                  flex
                                  items-center
                                  justify-center
                                  text-xs
                                  font-bold
                                "
                              >
                                {index + 1}
                              </div>
                            </div>
                          </td>

                          {/* CLUB */}
                          <td className="px-4 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {/* CLUB LOGO */}
                              <div
                                className="
                                  w-10
                                  h-10
                                  rounded-full
                                  bg-gradient-to-br
                                  from-blue-500
                                  to-purple-500
                                  flex
                                  items-center
                                  justify-center
                                  font-black
                                "
                              >
                                {team.team
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
                              </div>

                              <div>
                                <div className="font-semibold">
                                  {
                                    team.team
                                  }
                                </div>

                                <div className="text-xs text-white/40">
                                  Club
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-5 text-center">
                            {team.mp}
                          </td>

                          <td className="px-4 py-5 text-center text-green-400 font-bold">
                            {team.win}
                          </td>

                          <td className="px-4 py-5 text-center text-yellow-400 font-bold">
                            {team.draw}
                          </td>

                          <td className="px-4 py-5 text-center text-red-400 font-bold">
                            {team.lose}
                          </td>

                          <td className="px-4 py-5 text-center">
                            {team.gf}
                          </td>

                          <td className="px-4 py-5 text-center">
                            {team.ga}
                          </td>

                          <td className="px-4 py-5 text-center font-bold">
                            {team.gd > 0
                              ? `+${team.gd}`
                              : team.gd}
                          </td>

                          <td className="px-4 py-5 text-center">
                            {
                              team.homePts
                            }
                          </td>

                          <td className="px-4 py-5 text-center">
                            {
                              team.awayPts
                            }
                          </td>

                          <td className="px-4 py-5 text-center text-red-400">
                            -
                            {
                              team.deduction
                            }
                          </td>

                          {/* POINTS */}
                          <td className="px-4 py-5 text-center">
                            <motion.div
                              layout
                              className="
                                min-w-[48px]
                                h-10
                                rounded-xl
                                bg-gradient-to-r
                                from-blue-600
                                to-purple-600
                                flex
                                items-center
                                justify-center
                                font-black
                              "
                            >
                              {team.pts}
                            </motion.div>
                          </td>

                          {/* FORM */}
                          <td className="px-4 py-5">
                            <div className="flex gap-2 justify-center">
                              {team.form.map(
                                (
                                  result,
                                  idx
                                ) => (
                                  <div
                                    key={idx}
                                    className={`
                                      w-7
                                      h-7
                                      rounded-full
                                      flex
                                      items-center
                                      justify-center
                                      text-[10px]
                                      font-bold
                                      ${
                                        result ===
                                        "W"
                                          ? "bg-green-500 text-black"
                                          : result ===
                                            "D"
                                          ? "bg-yellow-400 text-black"
                                          : "bg-red-500 text-white"
                                      }
                                    `}
                                  >
                                    {
                                      result
                                    }
                                  </div>
                                )
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* MINI STATS */}
            <div className="grid grid-cols-2 gap-4 mt-5">
              <div
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                "
              >
                <div className="text-sm text-white/60">
                  Best Attack
                </div>

                <div className="mt-2 font-black text-xl">
                  {standings[0]?.team}
                </div>

                <div className="text-green-400 mt-1">
                  {standings[0]?.gf} Goals
                </div>
              </div>

              <div
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                "
              >
                <div className="text-sm text-white/60">
                  Best Defense
                </div>

                <div className="mt-2 font-black text-xl">
                  {
                    [...standings].sort(
                      (
                        a,
                        b
                      ) =>
                        a.ga -
                        b.ga
                    )[0]?.team
                  }
                </div>

                <div className="text-blue-400 mt-1">
                  {
                    [...standings].sort(
                      (
                        a,
                        b
                      ) =>
                        a.ga -
                        b.ga
                    )[0]?.ga
                  }{" "}
                  Conceded
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}