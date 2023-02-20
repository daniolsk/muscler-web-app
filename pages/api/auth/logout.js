import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      res.setHeader(
        "Set-Cookie",
        serialize("access-token", "", {
          maxAge: -1,
          path: "/",
        })
      );
      res.status(200).json({ msg: "Logged out" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}
