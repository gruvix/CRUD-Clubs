import React from "react";
import TeamCrest from "@/components/shared/TeamCrest";
import { webAppPaths } from "../../../paths.js";
import TeamCardClass from "@/components/adapters/TeamCard";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface TeamCardProps {
  team: TeamCardClass;
  visibility: boolean;
  deleteTeamCallback: (teamId: string | number, teamName: string, modalCancelCallback: Function) => void;
  router: AppRouterInstance;
}

export default function TeamCard({
  team,
  visibility,
  deleteTeamCallback,
  router,
}: TeamCardProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <div
      className="card card-container"
      style={visibility ? { display: "flex" } : { display: "none" }}
    >
      <div className="card-header">
        <h5 className="card-title team-card-title">{team.name}</h5>
      </div>
      {isLoading? (
      <>
        <LoadingSpinner
          style={{ marginTop: "15%", marginLeft: "15%", height: "10rem", width: "10rem" }}
        />
      </>
      ) : (
      <TeamCrest teamCrest={team.crestUrl} className="list-team-crest-image" />)}
      <div
        className=""
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
            deleteTeamCallback(team.id, team.name, () => () => setIsLoading(false));
          }}
        >
          delete
        </button>
      </div>
    </div>
  );
}
