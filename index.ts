import express from "express";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import morgan from "morgan";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { MONGO_URI, PORT } from "@/utils/config";
import authRoutes from "@/routes/authRoutes";

dotenv.config();

const app = express();
const port = PORT;

app.get("/", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("Erbeel Apis");
});

mongoose
  .connect(
    MONGO_URI as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  )
  .then((result) => {
    app.listen(PORT);
    console.log(`[server]: Server is running at http://localhost:${port}`);
  })
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Erbeel Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Erbeel",
        url: "https://erbeel.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.use("/api/v1/auth", authRoutes);
