"use client";

import { useState } from "react";

import { createCompetition } from "../../features/competitions/competition.service";

export default function CreateCompetitionPage() {
  const [name, setName] = useState("");

  const [sportType, setSportType] =
    useState("Football");

  const [formatType, setFormatType] =
    useState("LEAGUE");

  async function handleSubmit() {
    try {
      await createCompetition({
        name,

        sportType,

        formatType:
          formatType as "LEAGUE" | "KNOCKOUT",

        status: "DRAFT",

        createdAt: new Date().toISOString(),
      });

      alert("Competition Created 🚀");
    } catch (error) {
      console.error(error);

      alert("Failed create competition");
    }
  }

  return (
    <div className="p-10 max-w-xl">
      <h1 className="text-3xl font-bold mb-8">
        Create Competition
      </h1>

      <div className="space-y-6">
        <div>
          <label>
            Competition Name
          </label>

          <input
            className="border p-3 rounded w-full"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </div>

        <div>
          <label>
            Sport Type
          </label>

          <select
            className="border p-3 rounded w-full"
            value={sportType}
            onChange={(e) =>
              setSportType(e.target.value)
            }
          >
            <option>
              Football
            </option>

            <option>
              Basketball
            </option>

            <option>
              Badminton
            </option>
          </select>
        </div>

        <div>
          <label>
            Format
          </label>

          <select
            className="border p-3 rounded w-full"
            value={formatType}
            onChange={(e) =>
              setFormatType(e.target.value)
            }
          >
            <option value="LEAGUE">
              League
            </option>

            <option value="KNOCKOUT">
              Knockout
            </option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-5 py-3 rounded"
        >
          Create Competition
        </button>
      </div>
    </div>
  );
}