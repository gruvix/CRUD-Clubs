import React, { useEffect } from "react";
import TeamCrest from "@/components/shared/TeamCrest";
import { webAppPaths } from "../../../paths.js";
import TeamCardClass from "@/components/adapters/TeamCard";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface TeamCardProps {
  team: TeamCardClass;
  visibility: boolean;
  isDisappearing: boolean;
  deleteTeamCallback: (
    teamId: string | number,
    teamName: string,
    modalCancelCallback: Function,
  ) => void;
  router: AppRouterInstance;
}

export default function TeamCard({
  team,
  visibility,
  isDisappearing,
  deleteTeamCallback,
  router,
}: TeamCardProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [nameSize, setNameSize] = React.useState("100%");

  const calculateFontSize = (nameLength: number) => {
    const baseSize = 135; // base font size percentage
    const maxSize = 90; // minimum font size percentage
    const minLength = 14; // length at which font size starts to decrease
    const step = 7; // the rate at which the font size decreases per character above minLength

    if (nameLength <= minLength) {
      return `${baseSize}%`;
    } else {
      const newSize = baseSize - (nameLength - minLength) * step;
      return `${Math.max(newSize, maxSize)}%`; // ensure font size doesn't go below maxSize
    }
  };

  useEffect(() => {
    setNameSize(calculateFontSize(team.name.length));
  }, [team.name]);

  return (
    <div
      className={
        "card card-container group " +
        (isDisappearing
          ? "transition duration-1000 ease-out scale-0 opacity-0"
          : "")
      }
      style={visibility ? { display: "flex" } : { display: "none" }}
    >
      <div className="card-header">
        <h5
          className="card-title team-card-title text-nowrap overflow-x-clip"
          style={{ fontSize: nameSize }}
        >
          {team.name}
        </h5>
      </div>
      {isLoading ? (
        <>
          <LoadingSpinner
            style={{
              marginTop: "15%",
              marginLeft: "15%",
              height: "10rem",
              width: "10rem",
            }}
          />
        </>
      ) : (
        <TeamCrest
          teamCrest={team.crestUrl}
          className="list-team-crest-image mb-[10%] group-hover:mb-[38%] group-hover:scale-150 transition-all duration-300"
        />
      )}
      <div
        className="absolute top-15 group-hover:translate-y-[525%] transition-transform duration-300"
        style={{ alignSelf: "center" }}
        id={team.id.toString()}
      >
        <button
          type="button"
          className="btn btn-outline-warning overlay-button-dark edit transition-transform duration-300 ease-in-out hover:scale-125"
          onClick={() => {
            setIsLoading(true);
            router.push(`${webAppPaths.team(team.id)}`);
          }}
          style={{ marginRight: "10px", display: "inline" }}
        >
          edit
        </button>
        <button
          type="button"
          className="btn btn-outline-danger overlay-button-dark delete transition-transform duration-300 ease-in-out hover:scale-125"
          data-bs-toggle="modal"
          data-bs-target="#confirmationModal"
          onClick={() => {
            setIsLoading(true);
            deleteTeamCallback(
              team.id,
              team.name,
              () => () => setIsLoading(false),
            );
          }}
        >
          delete
        </button>
      </div>
    </div>
  );
}
