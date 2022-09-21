import express from "express";
import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import dotenv from "dotenv";
// Importing @sentry/tracing patches the global hub for tracing to work.
import * as Tracing from "@sentry/tracing";
dotenv.config();
import { Application } from "express";
global.__rootdir__ = __dirname || process.cwd();

// This allows TypeScript to detect our global value
declare global {
  var __rootdir__: string;
}

export const catchSentryException = (error: any) => {
  Sentry.captureException(error);
};

const sentryInitialization = (app: Application) => {
  console.log(process.env.SENTRY_DSN);
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new RewriteFrames({
        root: global.__rootdir__,
      }),
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({
        // to trace all requests to the default router
        app,
        // alternatively, you can specify the routes you want to trace:
        // router: someRouter,
      }),
    ],
    environment: process.env.NODE_ENV,
    autoSessionTracking: false, // default: true
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: Number(process.env.TRACE_SAMPLE_RATE),
  });

  app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);

  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
};

export default sentryInitialization;
