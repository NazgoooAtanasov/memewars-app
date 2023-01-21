import Head from "next/head";
import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

enum GAME_STAGE {
  SELECT_THEME,
  UPLOAD_IMAGES,
  VOTE,
}

type User = {
  id: string;
  username: string;
  roomId: string;
};

const UploadImages: React.FunctionComponent = () => {
  return <div className="m-1 basis-3/4  border border-black p-1">board</div>;
};

const Room: NextPage = () => {
  const [stage, setStage] = useState<GAME_STAGE>(GAME_STAGE.SELECT_THEME);
  const [players, setPlayers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const id = router.query.id as string;

  const joinARoom = () => {
    const socket = io("http://localhost:3001");
    socket.on("player_joined", ({ users }: { users: User[] }) => {
      setPlayers([...users]);
    });
    socket.on("join_failed", (data: { reason: string }) => {
      //
    });
    socket.emit("join_request", { roomId: id, username: username });
    window.addEventListener("popstate", () => socket.disconnect());
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
          <div className="flex flex-grow p-1">
            <div className="m-1 basis-1/4 border border-black p-1">
              {players?.map((player) => (
                <div className="mb-1 border border-black p-5" key={player.id}>
                  {player.username}
                </div>
              ))}
            </div>

            {stage === GAME_STAGE.SELECT_THEME ? <></> : <></>}
            {stage === GAME_STAGE.UPLOAD_IMAGES ? <UploadImages /> : <></>}
            {stage === GAME_STAGE.VOTE ? <></> : <></>}
          </div>
        </div>
      </main>
    </>
  );
};

export default Room;
