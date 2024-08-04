import {
	bigserial,
	boolean,
	doublePrecision,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

// ORDERS
export const prizes = pgTable("prizes", {
	time: timestamp("time", { mode: "date" }).notNull().defaultNow(),
	serial: bigserial("serial", { mode: "number" }).primaryKey(),
	number: integer("number").notNull(),
	result_value: integer("result_value").notNull(),
	result: text("result").notNull(),
});

// USERS
export const users = pgTable("user", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	uid: text("uid").notNull(),
	name: text("name"),
	phone: text("phone").notNull(),
	admin: boolean("admin").default(false),
	password: text("password"),
	image: text("image").default("https://www.im2015.com/user-avatar/n1.png"),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
	balance: doublePrecision("balance").default(0.0),
	points: doublePrecision("points").default(0.0),
});
