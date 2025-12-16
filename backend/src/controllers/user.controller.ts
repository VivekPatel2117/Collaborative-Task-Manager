import { Request, Response } from "express";
import { UserService } from "../services/user.service";

/** CREATE USER */
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = await UserService.create({
    name,
    email,
    password,
  });

  res.status(201).json(user);
};

/** GET ALL USERS */
export const getUsers = async (_req: Request, res: Response) => {
  const users = await UserService.getAll();
  res.json(users);
};

/** GET USER BY ID */
export const getUserById = async (req: Request, res: Response) => {
  const user = await UserService.getById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

/** UPDATE USER */
export const updateUser = async (req: Request, res: Response) => {
  const user = await UserService.update(req.params.id, req.body);
  res.json(user);
};

/** DELETE USER */
export const deleteUser = async (req: Request, res: Response) => {
  await UserService.delete(req.params.id);
  res.status(204).send();
};
