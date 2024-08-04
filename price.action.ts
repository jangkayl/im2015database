"use server";
import { randomInt } from "crypto";
import db from "./db/drizzle";
import { prizes } from "./db/schema";
import { desc, notInArray } from "drizzle-orm";

// Track if the cron job is initialized
let isCronJobInitialized = false;

// ADD PRIZES ASYNC
export const addPrizeWithRandomNumber = async () => {
	const random_number = randomInt(1, 101);
	const number = random_number;
	const result_value = random_number % 2 === 0 ? 0 : 1;
	const result =
		random_number % 2 === 0 ? `Even&${random_number}` : `Odd&${random_number}`;

	try {
		console.log("Inserting prize:", { number, result_value, result });
		await db.insert(prizes).values({
			number,
			result_value,
			result,
		});
		console.log("Prize added successfully with random number:", random_number);
	} catch (error) {
		console.error("Error inserting prize:", error);
	}
};

// Function to delete records exceeding the limit of 50 items
export const deleteExcessRecords = async () => {
	try {
		// Fetch the IDs of the most recent 50 records
		const recentPrizes = await db
			.select()
			.from(prizes)
			.orderBy(desc(prizes.serial))
			.limit(50);
		const recentIds = recentPrizes.map((prize) => prize.serial);

		// Delete records not in the recentIds
		if (recentIds.length > 0) {
			await db.delete(prizes).where(notInArray(prizes.serial, recentIds));
			console.log("Excess records deleted successfully.");
		} else {
			console.log("No records to delete.");
		}
	} catch (error) {
		console.error("Error deleting excess records:", error);
	}
};

function getDelayToNextMinute(): number {
	const now = new Date();
	const nextMinute = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		now.getHours(),
		now.getMinutes() + 1,
		0,
		0
	);
	return nextMinute.getTime() - now.getTime();
}

// Cron job function
const job = async () => {
	try {
		console.log("Cron job started at", new Date().toISOString());
		await addPrizeWithRandomNumber();
		await deleteExcessRecords();
		console.log("Cron job completed at", new Date().toISOString());
	} catch (error) {
		console.error("Error during cron job execution:", error);
	}
};

// Initialize and start the cron job
export const startCronJob = () => {
	if (isCronJobInitialized) {
		console.log("Cron job is already initialized.");
		return;
	}

	isCronJobInitialized = true;

	// Set up the job to run every minute
	const interval = 60000; // 60,000 milliseconds (1 minute)

	setTimeout(async () => {
		await job(); // Run immediately after the initial delay
		setInterval(async () => {
			await job();
		}, interval);
	}, getDelayToNextMinute());

	console.log("Cron job scheduled to start.");
};

// Start the cron job
