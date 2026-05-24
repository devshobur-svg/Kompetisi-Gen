"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  addDoc,
  collection,
} from "firebase/firestore";

import {
  Trophy,
  ChevronDown,
} from "lucide-react";

import { db } from "../../lib/firebase";

import MobileCard from "../../components/MobileCard";

import BottomNavbar from "../../components/BottomNavbar";

export default function CreateCompetitionPage() {
  const router = useRouter();

  const [name, setName] = useState("");

  const [sport, setSport] =
    useState("Football");

  const [format, setFormat] =
    useState("LEAGUE");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit() {
    if (!name) return;

    try {
      setLoading(true);

      const docRef = await addDoc(
        collection(db, "competitions"),
        {
          name,
          sport,
          format,
          status: "DRAFT",
          participants: [],
          fixtures: [],
          createdAt: new Date(),
        }
      );

      router.push(
        `/competitions/${docRef.id}`
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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
        <div className="flex items-center gap-4">
          <div
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
            "
          >
            <Trophy size={30} />
          </div>

          <div>
            <div className="text-white/50 text-sm">
              Build Tournament
            </div>

            <h1 className="text-4xl font-black mt-1">
              Create
            </h1>
          </div>
        </div>

        <MobileCard className="p-5 mt-6">
          <div className="space-y-5">
            <div>
              <div className="text-sm text-white/50 mb-3">
                Competition Name
              </div>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Liga Ramadan"
                className="
                  w-full
                  h-16
                  rounded-3xl
                  bg-white/5
                  border
                  border-white/10
                  px-5
                  text-lg
                  outline-none
                "
              />
            </div>

            <div>
              <div className="text-sm text-white/50 mb-3">
                Sport Type
              </div>

              <div className="relative">
                <select
                  value={sport}
                  onChange={(e) =>
                    setSport(e.target.value)
                  }
                  className="
                    w-full
                    h-16
                    rounded-3xl
                    bg-white/5
                    border
                    border-white/10
                    px-5
                    text-lg
                    appearance-none
                    outline-none
                  "
                >
                  <option>
                    Football
                  </option>

                  <option>
                    Basketball
                  </option>

                  <option>
                    Futsal
                  </option>

                  <option>
                    Badminton
                  </option>

                  <option>
                    Volleyball
                  </option>
                </select>

                <ChevronDown
                  size={24}
                  className="
                    absolute
                    right-5
                    top-1/2
                    -translate-y-1/2
                    text-white/50
                  "
                />
              </div>
            </div>

            <div>
              <div className="text-sm text-white/50 mb-3">
                Format Type
              </div>

              <div className="relative">
                <select
                  value={format}
                  onChange={(e) =>
                    setFormat(e.target.value)
                  }
                  className="
                    w-full
                    h-16
                    rounded-3xl
                    bg-white/5
                    border
                    border-white/10
                    px-5
                    text-lg
                    appearance-none
                    outline-none
                  "
                >
                  <option value="LEAGUE">
                    League
                  </option>

                  <option value="KNOCKOUT">
                    Knockout
                  </option>

                  <option value="GROUP_STAGE">
                    Group Stage
                  </option>
                </select>

                <ChevronDown
                  size={24}
                  className="
                    absolute
                    right-5
                    top-1/2
                    -translate-y-1/2
                    text-white/50
                  "
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full
                h-16
                rounded-3xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                font-bold
                text-lg
                shadow-2xl
                mt-2
              "
            >
              {loading
                ? "Creating..."
                : "Create Competition"}
            </button>
          </div>
        </MobileCard>
      </div>

      <BottomNavbar />
    </div>
  );
}