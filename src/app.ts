import express, { Application, Request, Response } from "express";
import * as Sentry from "@sentry/node";
import sentryInitialization, { catchSentryException } from "../sentry";
const app: Application = express();

const port: number = 3001;

sentryInitialization(app);

app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// the rest of your app
app.get("/toto", async (req: Request, res: Response) => {
  try {
    res.end("Hello toto");
    fetch("https://jsonplaceholder.typicode.com/tods/1")
      .then((response) => response.json())
      .then((json) => console.log(json));
    throw new Error("Oh no!");
  } catch (error) {
    catchSentryException("an error occurred");
  }
});

app.get("/debug-sentry", function mainHandler(req: Request, res: Response) {
  throw new Error("My first Sentry error!");
});

app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
