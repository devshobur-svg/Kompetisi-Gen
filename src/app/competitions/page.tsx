"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import {
  Plus,
  Trophy,
  Search,
  Pencil,
  Trash2,
  ChevronRight,
} from "lucide-react";

import { db } from "../../lib/firebase";

import BottomNav from "../../components/BottomNav";

type Competition = {
  id: string;
  name: string;
  sport: string;
  format: string;
  status: string;
};

export default function CompetitionsPage() {
  const [competitions, setCompetitions] =
    useState<Competition[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  useEffect(() => {
    fetchCompetitions();
  }, []);

  async function fetchCompetitions() {
    try {
      const snapshot = await getDocs(
        collection(db, "competitions")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<
          Competition,
          "id"
        >),
      }));

      setCompetitions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCompetition(
    id: string
  ) {
    const confirmDelete = confirm(
      "Delete this competition?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "competitions", id)
      );

      setCompetitions((prev) =>
        prev.filter(
          (competition) =>
            competition.id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  const filteredCompetitions =
    useMemo(() => {
      return competitions.filter(
        (competition) => {
          const matchSearch =
            competition.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchFilter =
            filter === "ALL"
              ? true
              : competition.format ===
                filter;

          return (
            matchSearch && matchFilter
          );
        }
      );
    }, [competitions, search, filter]);

  return (
    <div
      className="
        min-h-screen
        bg-[#070B14]
        text-white
        px-4
        py-5
        pb-32
      "
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/50">
              Competition Manager
            </div>

            <h1 className="text-4xl font-black mt-1">
              Competitions
            </h1>
          </div>

          <Link
            href="/create-competition"
            className="
              w-16
              h-16
              rounded-3xl
              bg-gradient-to-br
              from-blue-600
              to-purple-600
              flex
              items-center
              justify-center
              shadow-2xl
            "
          >
            <Plus size={28} />
          </Link>
        </div>

        {/* SEARCH */}
        <div className="relative mt-6">
          <Search
            size={20}
            className="
              absolute
              left-5
              top-1/2
              -translate-y-1/2
              text-white/40
            "
          />

          <input
            type="text"
            placeholder="Search competition..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              h-14
              rounded-3xl
              bg-white/5
              border
              border-white/10
              pl-14
              pr-5
              outline-none
            "
          />
        </div>

        {/* FILTER */}
        <div className="flex gap-3 mt-5 overflow-x-auto no-scrollbar">
          {[
            "ALL",
            "LEAGUE",
            "KNOCKOUT",
            "GROUP_STAGE",
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`
                px-5
                h-11
                rounded-2xl
                whitespace-nowrap
                text-sm
                font-semibold
                transition-all
                ${
                  filter === item
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : "bg-white/5 border border-white/10 text-white/60"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="mt-6 space-y-5">
          {loading && (
            <div className="text-white/50">
              Loading competitions...
            </div>
          )}

          {!loading &&
            filteredCompetitions.length ===
              0 && (
              <div
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-8
                  text-center
                "
              >
                <Trophy
                  size={50}
                  className="mx-auto text-purple-400"
                />

                <div className="mt-5 text-xl font-bold">
                  No Competition Found
                </div>
              </div>
            )}

          {filteredCompetitions.map(
            (competition) => (
              <div
                key={competition.id}
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur-xl
                "
              >
                <div className="flex items-start justify-between">
                  <Link
                    href={`/competitions/${competition.id}`}
                    className="flex gap-4 flex-1"
                  >
                    <div
                      className="
                        w-16
                        h-16
                        rounded-3xl
                        bg-gradient-to-br
                        from-purple-500
                        to-blue-500
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Trophy size={28} />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">
                        {competition.name}
                      </h2>

                      <div className="text-white/50 mt-2">
                        {competition.sport}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <div
                          className="
                            px-3
                            py-1
                            rounded-full
                            bg-blue-500/20
                            text-blue-300
                            text-xs
                            font-semibold
                          "
                        >
                          {
                            competition.format
                          }
                        </div>

                        <div
                          className="
                            px-3
                            py-1
                            rounded-full
                            bg-yellow-500/20
                            text-yellow-300
                            text-xs
                            font-semibold
                          "
                        >
                          {
                            competition.status
                          }
                        </div>
                      </div>
                    </div>
                  </Link>

                  <ChevronRight
                    size={22}
                    className="text-white/30"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-5">
                  <Link
                    href={`/competitions/${competition.id}`}
                    className="
                      flex-1
                      h-12
                      rounded-2xl
                      bg-gradient-to-r
                      from-blue-600
                      to-purple-600
                      flex
                      items-center
                      justify-center
                      gap-2
                      font-semibold
                    "
                  >
                    <Pencil size={18} />
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      deleteCompetition(
                        competition.id
                      )
                    }
                    className="
                      w-14
                      h-12
                      rounded-2xl
                      bg-red-500/15
                      border
                      border-red-500/20
                      flex
                      items-center
                      justify-center
                      text-red-400
                    "
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}