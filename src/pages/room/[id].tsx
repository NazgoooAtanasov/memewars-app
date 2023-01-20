import type { NextPage } from "next";
import { useRouter } from "next/router";

const Room: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return <>{id}</>;
};

export default Room;
