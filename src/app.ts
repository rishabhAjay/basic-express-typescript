import express, { Application, Request, Response } from "express";
import * as Sentry from "@sentry/node";
import sentryInitialization from "../sentry";
const app: Application = express();

const port: number = 3001;

sentryInitialization(app);

app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// the rest of your app
app.get("/toto", (req: Request, res: Response) => {
  res.send("Hello toto");
});

app.get("/debug-sentry", function mainHandler(req: Request, res: Response) {
  throw new Error("My first Sentry error!");
});

app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
