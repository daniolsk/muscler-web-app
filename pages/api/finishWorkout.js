import prisma from "./../../lib/prisma";
import { verifyToken } from "../../lib/jwt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies["access-token"];

      if (!(token && verifyToken(token))) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const { id } = req.body;

      await prisma.workout.update({
        where: {
          id: id,
        },
        data: {
          isActive: false,
        },
      });

      return res.status(200).json({ msg: "Workout finished" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}
