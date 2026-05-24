import Link from "next/link";

import {
  Trophy,
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react";

import AppHeader from "../components/AppHeader";

import BottomNavbar from "../components/BottomNavbar";

import MobileCard from "../components/MobileCard";

export default function HomePage() {
  return (
    <div className="min-h-screen px-4 py-5 pb-32">
      <div className="max-w-md mx-auto">
        <AppHeader
          title="Competition OS"
          subtitle="Sports Management"
        />

        <div className="mt-6 space-y-5">
          <MobileCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div
                className="
                  w-16
                  h-16
                  rounded-3xl
                  bg-gradient-to-br
                  from-blue-500
                  to-purple-600
                  flex
                  items-center
                  justify-center
                "
              >
                <Trophy size={30} />
              </div>

              <h2 className="text-3xl font-bold mt-5 leading-tight">
                Build Your
                <br />
                Competition
              </h2>

              <p className="text-white/60 mt-3 text-sm leading-relaxed">
                Manage leagues, cups,
                fixtures, standings and
                tournaments in one
                modern platform.
              </p>

              <Link
                href="/create-competition"
                className="
                  mt-6
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                  flex
                  items-center
                  justify-center
                  font-semibold
                  gap-2
                "
              >
                Create Competition

                <ArrowRight size={18} />
              </Link>
            </div>
          </MobileCard>

          <div className="grid grid-cols-2 gap-4">
            <MobileCard className="p-5">
              <Calendar
                className="text-blue-400"
                size={28}
              />

              <div className="mt-5 text-2xl font-bold">
                24
              </div>

              <div className="text-sm text-white/50 mt-1">
                Matches
              </div>
            </MobileCard>

            <MobileCard className="p-5">
              <Users
                className="text-purple-400"
                size={28}
              />

              <div className="mt-5 text-2xl font-bold">
                16
              </div>

              <div className="text-sm text-white/50 mt-1">
                Participants
              </div>
            </MobileCard>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                Recent Competitions
              </h2>

              <Link
                href="/competitions"
                className="text-sm text-blue-400"
              >
                See all
              </Link>
            </div>

            <div className="space-y-4">
              <MobileCard className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      Liga Ramadan
                    </div>

                    <div className="text-sm text-white/50 mt-1">
                      Football • League
                    </div>
                  </div>

                  <div
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-500/20
                      text-green-400
                      text-xs
                    "
                  >
                    Active
                  </div>
                </div>
              </MobileCard>

              <MobileCard className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      Liga Arab
                    </div>

                    <div className="text-sm text-white/50 mt-1">
                      Basketball • Cup
                    </div>
                  </div>

                  <div
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-yellow-500/20
                      text-yellow-400
                      text-xs
                    "
                  >
                    Draft
                  </div>
                </div>
              </MobileCard>
            </div>
          </div>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
}