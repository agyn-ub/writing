import { pgTable, text, timestamp, varchar, serial, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const essayBankSchema = pgTable('essay_bank', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type', { enum: ['ACADEMIC_TASK1', 'GENERAL_TASK1', 'TASK2'] }).notNull(),
  prompt: text('prompt').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const essays = pgTable('essays', {
  id: text('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // 'ACADEMIC_TASK1', 'GENERAL_TASK1', or 'TASK2'
  content: text('content').notNull(),
  feedback: text('feedback'),
  score: text('score'),
  userId: text('user_id').references(() => users.id).notNull(),
  essayBankId: integer('essay_bank_id').references(() => essayBankSchema.id),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertEssaySchema = createInsertSchema(essays);
export const selectEssaySchema = createSelectSchema(essays);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Essay = typeof essays.$inferSelect;
export type NewEssay = typeof essays.$inferInsert;
export type EssayBank = typeof essayBankSchema.$inferSelect;
export type NewEssayBank = typeof essayBankSchema.$inferInsert; 