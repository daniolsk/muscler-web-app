import prisma from './../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { username, password } = req.body;

			const user = await prisma.user.findUnique({
				where: {
					username: username,
				},
			});

			if (user) {
				return res.status(400).json({ msg: 'User already exists' });
			}

			const hash = await bcrypt.hash(password, 10);
			const newUser = await prisma.user.create({
				data: {
					username,
					password: hash,
				},
			});

			return res.status(200).json({ msg: 'User registered' });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ msg: 'Something went wrong' });
		}
	} else {
		return res.status(405).json({ msg: 'Method not allowed' });
	}
}
