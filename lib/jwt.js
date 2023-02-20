import { sign, verify } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const generateToken = (user) => {
	const accessToken = sign({ id: user.id, username: user.username }, secret);

	return accessToken;
};

const verifyToken = (token) => {
	const verified = verify(token, secret);

	return verified;
};

export { generateToken, verifyToken };
