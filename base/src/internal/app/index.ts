/**
 * DO NOT EDIT
 * AUTO-GENERATED FILE
 * This file was generated with 'design-first'
 */

import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Parse .env
const result: dotenv.DotenvConfigOutput = dotenv.config();
 
if (result.error) {
  throw result.error
}

// Create Express server
const app: express.Application = express();

// Express configuration
app.set('port', process.env.PORT || 8080);
app.set('host', process.env.HOST || 'localhost');
app.set('env', process.env.NODE_ENV || 'development');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export default app;
