import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import coursesRouter from "./courses";
import lessonsRouter from "./lessons";
import progressRouter from "./progress";
import codesRouter from "./codes";
import paymentsRouter from "./payments";
import testimonialsRouter from "./testimonials";
import statsRouter from "./stats";
import adminRouter from "./admin";
import chatRouter from "./chat";
import certificatesRouter from "./certificates";
import gamificationRouter from "./gamification";
import exercisesRouter from "./exercises";
import contactRouter from "./contact";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(coursesRouter);
router.use(lessonsRouter);
router.use(progressRouter);
router.use(codesRouter);
router.use(paymentsRouter);
router.use(testimonialsRouter);
router.use(statsRouter);
router.use(adminRouter);
router.use(chatRouter);
router.use(certificatesRouter);
router.use(gamificationRouter);
router.use(exercisesRouter);
router.use(contactRouter);
router.use(storageRouter);

export default router;
