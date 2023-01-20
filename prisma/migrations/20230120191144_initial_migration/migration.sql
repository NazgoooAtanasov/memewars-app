-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "currentPlayers" INTEGER NOT NULL DEFAULT 0,
    "maxPlayers" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
