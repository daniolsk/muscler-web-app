import prisma from "./../../../lib/prisma";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

import { generateToken } from "./../../../lib/jwt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, password } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        return res.status(400).json({ msg: "User does not exists" });
      }

      const dbPassword = user.password;

      const checkCredentials = await bcrypt.compare(password, dbPassword);

      if (!checkCredentials) {
        return res.status(400).json({ msg: "Wrong username or password" });
      }

      const accessToken = generateToken(user);
      res.setHeader(
        "Set-Cookie",
        serialize("access-token", accessToken, {
          maxAge: 3600000 * 24 * 7,
          path: "/",
        })
      );

      return res.status(200).json({ msg: "User logged in" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}
