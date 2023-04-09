import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export async function register(request: Request, response: Response) {
  const userRepository = AppDataSource.manager.getRepository(User);

  const { email, password } = request.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = userRepository.create({
    email,
    password: hashedPassword,
  });

  await userRepository.save(createdUser);

  response.send(createdUser);
}
