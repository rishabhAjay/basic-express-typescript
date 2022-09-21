import express, { Application, Request, Response } from "express";
import sentryInitialization, { catchSentryException } from "../sentry";
const app: Application = express();

const port: number = 3001;

//your sentry initialization for the app
sentryInitialization(app);

// the rest of your app
app.get("/toto", async (req: Request, res: Response) => {
  try {
    //sample API route
    res.end("Hello toto");
    fetch("https://jsonplaceholder.typicode.com/tods/1")
      .then((response) => response.json())
      .then((json) => console.log(json));
    throw new Error("Oh no!");
  } catch (error) {
    //calling the custom error handler integrated with Sentry
    catchSentryException(error);
  }
});

//hit this endpoint to test if Sentry began capturing transactions
app.get("/debug-sentry", function mainHandler(req: Request, res: Response) {
  throw new Error("My first Sentry error!");
});

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
