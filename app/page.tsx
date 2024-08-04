"use client";
import { startCronJob } from "@/price.action";

export default function Home() {
	const handleSubmit = () => {
		console.log("Starting");
		startCronJob();
	};
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<button onClick={handleSubmit}>CLick me</button>
		</main>
	);
}
