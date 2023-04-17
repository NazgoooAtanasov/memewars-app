import Head from "next/head";
import { useState } from "react";
import type { NextPage } from "next";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import getConfig from "next/config";

type User = {
  id: string;
  username: string;
  roomId: string;
};

const Room: NextPage = () => {
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
          </div>
        </div>
      </main>
    </>
  );
};

export default Room;
