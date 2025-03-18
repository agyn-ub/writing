-- Ensure the essay_bank_id column exists and has the correct name
ALTER TABLE "essays" RENAME COLUMN IF EXISTS "essaybank_id" TO "essay_bank_id";

-- If the column doesn't exist at all, create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'essays' AND column_name = 'essay_bank_id'
    ) THEN
        ALTER TABLE "essays" ADD COLUMN "essay_bank_id" INTEGER REFERENCES "essay_bank"("id");
    END IF;
END $$; 