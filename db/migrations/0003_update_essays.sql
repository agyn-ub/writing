-- Add essayBankId column to essays table
ALTER TABLE "essays" ADD COLUMN IF NOT EXISTS "essay_bank_id" INTEGER REFERENCES "essay_bank"("id");

-- Update the type column to support the new essay types
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "essays_type_check";
ALTER TABLE "essays" ADD CONSTRAINT "essays_type_check" 
  CHECK ("type" IN ('ACADEMIC_TASK1', 'GENERAL_TASK1', 'TASK2', 'GENERAL', 'ACADEMIC')); 