import Head from 'next/head';
import prisma from '../lib/prisma';

export default function Home({ users }) {
	console.log(users);
	return (
		<div>
			<Head>
				<title>Workout tracker app</title>
				<meta name="description" content="Workout tracker app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="p-10 mx-auto max-w-4xl">
				<h1 className="text-6xl font-bold mb-4 text-center">Next.js Starter</h1>
				<p className="mb-20 text-xl text-center">🔥 Shop from the hottest items in the world 🔥</p>
				<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center  gap-4">
					{users.map((user) => (
						<div key={user.id}>{user.username}</div>
					))}
				</div>
			</main>

			<footer></footer>
		</div>
	);
}

export async function getServerSideProps(context) {
	const data = await prisma.user.findMany({});
	const users = data.map((user) => ({
		...user,
		createdAt: user.createdAt.toString(),
	}));
	return {
		props: { users },
	};
}
