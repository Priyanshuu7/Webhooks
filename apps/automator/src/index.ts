import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.AUTOMATOR_PORT || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS"]
  })
);

app.use(express.json());

type Payload = {
  id: string;
  email: string;
  name: string;
  course: string;
};

app.get("/", (req, res) => {
  return res.json({ message: "AUTOMATOR OK" });
});

app.post("/webhook", (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.secret}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, name, email, course }: Payload = req.body;

  // create discord invite
  // send email to the student

  console.log(
    `Invite sent to ${name} on ${email} for course ${course}`
  );

  return res.json({ message: "OK" });
});

app.listen(PORT, () => {
  console.log(`Automator server is running on port ${PORT}`);
});
