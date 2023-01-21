import Head from "next/head";
import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "../utils/api";
import { SyntheticEvent, useState } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const createMutation = api.room.create.useMutation({
    onSuccess: async (data) => {
      await router.push(`/room/${data.id}`);
    },
  });

  const [roomInputField, setRoomInputField] = useState<boolean>(false);
  const [roomId, setRoomId] = useState("");
  api.room.check.useQuery(
    { roomId: roomId },
    {
      enabled: !!roomId,
      onSuccess: (data) => {
        if (data.roomFound) {
          router.push(`/room/${data.roomId}`).catch((e) => {
            console.log(e);
          });
        }
      },
    }
  );

  function joinARoom(event: SyntheticEvent) {
    event.preventDefault();
    const roomId = new FormData(event.currentTarget as HTMLFormElement).get(
      "roomId"
    );
    setRoomId(roomId?.toString() || "");
  }
  return (
    <>
      <Head>
        <title>Memewars</title>
        <meta name="description" content="Memewars" />
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <h1 className="text-center">Memewars</h1>
        <div className="flex flex-grow flex-col justify-center">
          <div className="text-center">
            <button
              onClick={() => createMutation.mutate()}
              className="rounded bg-black p-4 uppercase text-white"
            >
              create a game
            </button>
            {createMutation.isLoading ? (
              <span className="ml-2">Creating...</span>
            ) : (
              <></>
            )}
          </div>
          <div className="text-center">
            <button
              onClick={() => setRoomInputField(!roomInputField)}
              className="border-gray m-2 rounded border p-1"
            >
              Join a game
            </button>
          </div>
          <div className="text-center">
            {roomInputField ? (
              <>
                <form onSubmit={(event) => joinARoom(event)}>
                  <input
                    name="roomId"
                    placeholder="room id"
                    className="text-center"
                  />
                </form>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
