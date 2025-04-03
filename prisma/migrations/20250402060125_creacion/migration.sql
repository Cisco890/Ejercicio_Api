-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pendiente', 'en_proceso', 'resuelto');

-- CreateTable
CREATE TABLE "incidents" (
    "id" SERIAL NOT NULL,
    "reporter" VARCHAR(60) NOT NULL,
    "description" VARCHAR(60) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);
