import express from "express";
import cors from "cors";
import { Sequelize } from "sequelize-typescript";
import Minddlewares from "./middleware/index";
import config from "./config/config";
import routes from "./routers";
import errorMiddleware from "./middleware/ApiErrorHandler";

class App {
  express: express.Application;

  constructor() {
    this.express = express();
    this.database();
    this.middlewares();
    this.routes();
  }

  public start(): express.Application {
    console.log(`App starting at http://localhost:${config.app.port}`);
    return this.express;
  }

  private middlewares(): void {
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(express.json());
    this.express.use(cors(config.cors));
    this.express.use(...Minddlewares);
  }

  private async database() {
    const { database } = config;
    try {
      const connection = new Sequelize({
        database: database.database,
        password: database.password,
        username: database.username,
        dialect: "postgres",
        models: [`${process.cwd()}/src/models`],
      });
      connection.authenticate();
      console.log("Banco de dados conectado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  private routes(): void {
    this.express.use(routes);
    this.express.use(errorMiddleware);
  }
}

export default App;