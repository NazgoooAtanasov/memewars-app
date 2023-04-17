import Head from "next/head";
import type { FC } from "react";
import { useState } from "react";
import getConfig from "next/config";
import type { NextPage } from "next";
import { io } from "socket.io-client";
import { useRouter } from "next/router";

type User = {
  id: string;
  username: string;
  roomId: string;
};

enum GAME_STATE {
  AWAITING_PLAYERS = "awaiting_players",
  CHOOSE_THEME = "choose_theme",
}

type GameTheme = {
  id: string;
  description: string;
};

type GameStateEvent =
  | { state: GAME_STATE.AWAITING_PLAYERS }
  | { state: GAME_STATE.CHOOSE_THEME; themes: GameTheme[] };

type ChooseThemeArgs = { themes: GameTheme[] };
const ChooseTheme: FC<ChooseThemeArgs> = ({ themes }) => {
  return (
    <div className="flex h-full items-center justify-center italic">
      {themes.map((theme) => {
        return (
          <button className="m-1 border border-black p-1" key={theme.id}>
            {theme.description}
          </button>
        );
      })}
    </div>
  );
};

const AwaitingPlayers: FC = () => {
  return (
    <p className="flex h-full items-center justify-center italic">
      Awaiting players to join...
    </p>
  );
};

const Room: NextPage = () => {
  const [gameState, setGameState] = useState(GAME_STATE.AWAITING_PLAYERS);
  const [gameThemes, setGameThemes] = useState<GameTheme[]>([]);
  const [players, setPlayers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const id = router.query.id as string;

  const { publicRuntimeConfig } = getConfig() as {
    publicRuntimeConfig: { WS_URL: string };
  };

  const joinARoom = () => {
    const socket = io(publicRuntimeConfig.WS_URL);

    socket.on("player_joined", (users: User[]) => setPlayers([...users]));
    socket.on("player_left", (users: User[]) => setPlayers([...users]));
    socket.on("join_failed", (reason: string) => setError(reason));
    socket.on("room_state_update", (gameStateEvent: GameStateEvent) => {
      setGameState(gameStateEvent.state);
      if (gameStateEvent.state === GAME_STATE.CHOOSE_THEME) {
        setGameThemes(gameStateEvent.themes);
      }
    });

    socket.emit("join_request", { roomId: id, username: username });

    window.addEventListener("popstate", () => socket.disconnect(), {
      once: true,
    });
  };

  return (
    <>
      <Head>
        <title>Memewars</title>
        <meta name="description" content="Memewars" />
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <h1>Room id: {id}</h1>
        <div className="flex w-full flex-grow flex-col">
          <div className="my-2 flex justify-center">
            <div>Enter a name:</div>
            <input
              type="text"
              value={username}
              onInput={(event) => setUsername(event.currentTarget.value)}
              className="ml-4"
              placeholder="username"
            />
            <button
              onClick={() => joinARoom()}
              className="rounded bg-black px-1 text-white"
            >
              Connect
            </button>
          </div>
          {!!error ? <div className="p-5 text-center">{error}</div> : <></>}
          <div className="flex flex-grow p-1">
            <div className="m-1 basis-1/4 border border-black p-1">
              {players?.map((player) => (
                <div className="mb-1 border border-black p-5" key={player.id}>
                  {player.username}
                </div>
              ))}
            </div>

            <div className="m-1 basis-3/4 border border-black p-1">
              {gameState === GAME_STATE.AWAITING_PLAYERS ? (
                <AwaitingPlayers />
              ) : (
                <></>
              )}

              {gameState === GAME_STATE.CHOOSE_THEME ? (
                <ChooseTheme themes={gameThemes} />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Room;
