"use client";
import React, { useEffect } from "react";
import LogoutButton from "./LogoutButton";
import { webAppPaths } from "@/paths";
import TeamCardComponent from "./TeamCard";
import APIAdapter from "@/components/adapters/APIAdapter";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import TeamCard from "@/components/adapters/TeamCard.js";
import { useRouter } from "next/navigation";
import "@/css/globals.css";
import UnauthorizedError from "@/components/errors/UnauthorizedError";

interface TeamsData {
  username: string;
  teams: TeamCard[];
}

export default function TeamsList(): React.ReactElement {
  const router = useRouter();
  const [searchOption, setSearchOption] = React.useState("All teams");
  const [searchPattern, setSearchPattern] = React.useState("");
  const [shouldTeamShow, setShouldTeamShow] = React.useState<boolean[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [teamCards, setTeamCards] = React.useState<TeamCard[]>([]);
  const [modalCallback, setModalCallback] = React.useState(
    () => (): void => {},
  );
  const [modalCancelCallback, setModalCancelCallback] =
    React.useState<Function>(() => (): void => {});
  const [modalText, setModalText] = React.useState("");
  const [asyncError, setAsyncError] = React.useState<Error>();
  const pageTitle = `CRUD ${username}'s teams`;
  const request = new APIAdapter();

  const errorHandler = (error: Error) => {
    if (error instanceof UnauthorizedError) {
      router.push(webAppPaths.home);
    } else {
      setAsyncError(error);
    }
  };
  const updateTeamsData = async () => {
    setIsLoading(true);
    request
      .getTeams()
      .then((data: TeamsData) => {
        setUsername(data.username);
        setTeamCards(data.teams);
        setIsLoading(false);
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  const deleteTeam = (teamId: number) => async () => {
    request
      .deleteTeam(teamId)
      .then(() => {
        setTeamCards((prevCards) =>
          prevCards.filter((team) => team.id !== teamId),
        );
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  const setUpDeleteTeamModal = (
    teamId: number | string,
    teamName: string,
    modalCancelCallback: Function,
  ) => {
    setModalCallback(() => deleteTeam(Number(teamId)));
    setModalText(`Are you sure you want to delete team ${teamName}?`);
    setModalCancelCallback(modalCancelCallback);
  };
  const resetTeams = () => async () => {
    setIsLoading(true);
    request
      .resetTeamsList()
      .then(() => {
        updateTeamsData();
        setIsLoading(false);
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  useEffect(() => {
    updateTeamsData();
  }, []);
  useEffect(() => {
    const shouldTeamShowArray: boolean[] = Object.keys(teamCards).map(
      (teamIndex) => {
        const team = teamCards[Number(teamIndex)];
        if (
          team.name
            .toString()
            .toLowerCase()
            .includes(searchPattern.toLowerCase())
        ) {
          switch (searchOption) {
            case "All teams":
              return true;
            case "Default teams":
              return team.hasDefault;
            case "Custom teams":
              return !team.hasDefault;
            default:
              return true;
          }
        }
      },
    ) as boolean[];
    setShouldTeamShow(shouldTeamShowArray);
  }, [searchPattern, searchOption, teamCards]);
  useEffect(() => {
    if (asyncError) {
      throw asyncError;
    }
  }, [asyncError]);
  return (
    <div className="container">
      <title>{pageTitle}</title>
      <div className="row">
        <div className="col">
          <LogoutButton
            style={{ marginTop: "15px" }}
            text="Log out"
            router={router}
          />
          <span className="text-center teams-page-title">
            User: <div id="username">{username}</div>
          </span>
        </div>
      </div>

      <div className="row" style={{ paddingBottom: "3%" }}>
        <div className="col text-center">
          <button
            type="button"
            id="add-team-button"
            className="btn btn-shadow btn-outline-warning"
            onClick={() => router.push(webAppPaths.addTeam)}
          >
            Add new team
          </button>
        </div>

        <div className="col text-center">
          <div className="input-group mb-3">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              id="search-options-button"
            >
              {searchOption}
            </button>
            <ul
              className="dropdown-menu"
              id="search-options"
              onClick={(e) =>
                setSearchOption(
                  "textContent" in e.target
                    ? (e.target.textContent as string)
                    : "All teams",
                )
              }
            >
              <li>
                <span data-search-option="all" className="dropdown-item">
                  All teams
                </span>
              </li>
              <li>
                <span data-search-option="default" className="dropdown-item">
                  Default teams
                </span>
              </li>
              <li>
                <span data-search-option="custom" className="dropdown-item">
                  Custom teams
                </span>
              </li>
            </ul>
            <input
              id="search-input"
              type="text"
              className="form-control"
              aria-label="Text input with dropdown button"
              value={searchPattern}
              placeholder="Search teams..."
              onChange={(e) => setSearchPattern(e.target.value)}
            />
          </div>
        </div>

        <div className="col text-center">
          <button
            type="button"
            id="reset-teams-button"
            className="btn btn-shadow btn-outline-danger"
            data-toggle="tooltip"
            data-placement="auto"
            title="Erase all teams and reload default teams"
            data-bs-toggle="modal"
            data-bs-target="#confirmationModal"
            onClick={() => {
              setModalCallback(resetTeams);
              setModalText(
                "Are you sure you want to reset all teams? All custom data will be lost and this action can not be undone",
              );
            }}
          >
            Reset Teams
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="container">
            <div className="row row-cols-5 justify-content-center">
              {isLoading ? (
                <LoadingSpinner
                  style={{ marginTop: "10%", height: "20rem", width: "20rem" }}
                />
              ) : (
                teamCards.map((team: TeamCard, index: number) => (
                  <TeamCardComponent
                    team={team}
                    key={team.id}
                    deleteTeamCallback={setUpDeleteTeamModal}
                    visibility={shouldTeamShow[index]}
                    router={router}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        callback={modalCallback}
        confirmationText={modalText}
        cancelCallback={modalCancelCallback}
      />
    </div>
  );
}
