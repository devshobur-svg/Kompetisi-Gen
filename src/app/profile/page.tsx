"use client";

import {
  User,
  Trophy,
  Users,
  Calendar,
} from "lucide-react";

import MobileCard from "../../components/MobileCard";

import BottomNavbar from "../../components/BottomNavbar";

export default function ProfilePage() {
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
        <MobileCard className="p-6 text-center">
          <div
            className="
              w-28
              h-28
              rounded-full
              bg-gradient-to-br
              from-blue-600
              to-purple-600
              flex
              items-center
              justify-center
              mx-auto
            "
          >
            <User size={42} />
          </div>

          <h1 className="text-3xl font-black mt-5">
            Competition Admin
          </h1>

          <div className="text-white/50 mt-2">
            organizer@competitionos.com
          </div>
        </MobileCard>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <MobileCard className="p-5">
            <Trophy
              className="text-yellow-400"
              size={28}
            />

            <div className="text-3xl font-black mt-5">
              12
            </div>

            <div className="text-white/50 text-sm mt-1">
              Competitions
            </div>
          </MobileCard>

          <MobileCard className="p-5">
            <Users
              className="text-blue-400"
              size={28}
            />

            <div className="text-3xl font-black mt-5">
              86
            </div>

            <div className="text-white/50 text-sm mt-1">
              Participants
            </div>
          </MobileCard>
        </div>

        <MobileCard className="p-5 mt-5">
          <div className="flex items-center gap-4">
            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-white/5
                flex
                items-center
                justify-center
              "
            >
              <Calendar size={24} />
            </div>

            <div>
              <div className="font-semibold">
                Next Match
              </div>

              <div className="text-white/50 text-sm mt-1">
                Tomorrow • 19:00 PM
              </div>
            </div>
          </div>
        </MobileCard>
      </div>

      <BottomNavbar />
    </div>
  );
}