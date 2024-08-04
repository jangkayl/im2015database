import { bigserial, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// ORDERS
export const prizes = pgTable("prizes", {
	time: timestamp("time", { mode: "date" }).notNull().defaultNow(),
	serial: bigserial("serial", { mode: "number" }).primaryKey(),
	number: integer("number").notNull(),
	result_value: integer("result_value").notNull(),
	result: text("result").notNull(),
});
