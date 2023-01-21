import Head from "next/head";
import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "../utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const createMutation = api.room.create.useMutation({
    onSuccess: async (data) => {
      await router.push(`/room/${data.id}`);
    },
  });

  const [roomInputField, setRoomInputField] = useState<boolean>(false);
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
              <input placeholder="room id" className="text-center" />
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
