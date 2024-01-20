import express, { Request, Response } from "express";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";
import AddClientUsecase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";
import { AddClientInputDto } from "../../../modules/client-adm/usecase/add-client/add-client.usecase.dto";

export const clientsRoute = express.Router();

clientsRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddClientUsecase(new ClientRepository());
  const clientDto: AddClientInputDto = {
    name: req.body.name,
    email: req.body.email,
    document: req.body.document,
    address: req.body.address,
  };
  const output = await usecase.execute(clientDto);
  res.send(output);
});
