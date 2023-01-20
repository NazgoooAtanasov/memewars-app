import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const createMutation = api.room.create.useMutation();

  function createRoom() {
    createMutation.mutate();
  }

  return (
    <>
      <Head>
        <title>Memewars</title>
        <meta name="description" content="Memewars" />
      </Head>
      <main className="flex min-h-screen flex-grow flex-col items-center">
        <h1 className="text-center">Memewars</h1>
        <button onClick={() => createRoom()} className="">
          enter the game
        </button>
      </main>
    </>
  );
};

export default Home;
