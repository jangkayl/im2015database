"use client";
import { useState, useEffect } from "react";
import { startCronJob, stopCronJob } from "@/price.action";

type Log = {
	type: "log" | "error";
	message: string;
};

export default function Home() {
	const [countdown, setCountdown] = useState<string>("0");
	const [logs, setLogs] = useState<Log[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
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
			setCountdown(
				Math.max((nextMinute.getTime() - now.getTime()) / 1000, 0).toFixed(0)
			);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const originalLog = console.log;
		const originalError = console.error;

		console.log = (...args: any[]) => {
			originalLog(...args);
			setLogs((prevLogs) => [
				...prevLogs,
				{ type: "log", message: args.join(" ") },
			]);
		};

		console.error = (...args: any[]) => {
			originalError(...args);
			setLogs((prevLogs) => [
				...prevLogs,
				{ type: "error", message: args.join(" ") },
			]);
		};

		return () => {
			console.log = originalLog;
			console.error = originalError;
		};
	}, []);

	const handleStart = () => {
		console.log("Starting");
		startCronJob();
	};

	const handleStop = () => {
		console.log("Stopping");
		stopCronJob();
	};

	return (
		<main className="flex min-h-screen flex-col items-center p-24 gap-3">
			<div className="flex flex-col items-center gap-3">
				<button
					onClick={handleStart}
					className="px-3 py-2 bg-blue-600 text-white rounded-xl">
					Start Cron Job
				</button>
				<button
					onClick={handleStop}
					className="px-3 py-2 bg-red-600 text-white rounded-xl">
					Stop Cron Job
				</button>
				<div className="text-xl">Next job in: {countdown} seconds</div>
			</div>
			<div className="mt-6 w-full max-w-md p-4 bg-gray-100 rounded-lg overflow-y-auto h-64">
				<h3 className="text-lg font-bold mb-2">Console Logs:</h3>
				{logs.map((log, index) => (
					<div
						key={index}
						className={`text-sm ${
							log.type === "error" ? "text-red-600" : "text-black"
						}`}>
						{log.message}
					</div>
				))}
			</div>
		</main>
	);
}
