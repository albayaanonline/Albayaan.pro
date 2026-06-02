import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

router.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }

    logger.info({
      event: "contact_form_submission",
      name,
      email,
      subject: subject || "(no subject)",
      messageLength: message?.length,
    });

    return res.status(200).json({ ok: true, message: "Message received. We'll respond within 2 hours via WhatsApp or email." });
  } catch (err) {
    logger.error({ event: "contact_form_error", err });
    return res.status(500).json({ error: "Failed to process message" });
  }
});

export default router;
