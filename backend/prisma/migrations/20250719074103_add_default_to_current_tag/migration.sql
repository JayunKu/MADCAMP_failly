-- AlterTable
ALTER TABLE "User" ALTER COLUMN "current_tag" SET DEFAULT '';

-- CreateTable
CREATE TABLE "FailpostReactionCount" (
    "failpost_id" TEXT NOT NULL,
    "reaction_type" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "FailpostReactionCount_pkey" PRIMARY KEY ("failpost_id","reaction_type")
);

-- AddForeignKey
ALTER TABLE "FailpostReactionCount" ADD CONSTRAINT "FailpostReactionCount_failpost_id_fkey" FOREIGN KEY ("failpost_id") REFERENCES "FailPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
