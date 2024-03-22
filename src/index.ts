const dotenv = require("dotenv");
dotenv.config();

import { NoPonto } from "./api";
import { MongoConnection } from "./external/mongo";

MongoConnection.start()
NoPonto.start();
