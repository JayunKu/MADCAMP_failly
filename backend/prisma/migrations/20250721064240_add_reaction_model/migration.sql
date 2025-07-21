-- CreateTable
CREATE TABLE "Reaction" (
    "reaction_type" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("reaction_type")
);

-- AddForeignKey
ALTER TABLE "FailpostReactionCount" ADD CONSTRAINT "FailpostReactionCount_reaction_type_fkey" FOREIGN KEY ("reaction_type") REFERENCES "Reaction"("reaction_type") ON DELETE RESTRICT ON UPDATE CASCADE;
