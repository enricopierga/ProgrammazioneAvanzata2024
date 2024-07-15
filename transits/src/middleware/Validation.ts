import { Request, Response, NextFunction } from "express";
import GateRepository from "../repositories/GateRepository";
import UserRepository from "../repositories/UserRepository";
import { StatusCodes } from "http-status-codes";

export const checkGatesIds = async (
  res: Response,
  startGateId: number,
  endGateId: number
): Promise<boolean> => {
  // Verifica se startGateId e endGateId esistono nella tabella Gates
  const startGate = await GateRepository.getById(startGateId);
  const endGate = await GateRepository.getById(endGateId);

  if (!startGate && !endGate) {
    res.status(StatusCodes.NOT_FOUND).json({ message: `Gates not found` });
    return false;
  }

  if (!startGate) {
    res.status(StatusCodes.NOT_FOUND).json({ message: `Start gate not found` });
    return false;
  }

  if (!endGate) {
    res.status(StatusCodes.NOT_FOUND).json({ message: `End gate not found` });
    return false;
  }
  return true;
};

export const checkUserId = async (
  res: Response,
  userId: number
): Promise<boolean> => {
  const user = UserRepository.getById(userId);

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ message: `User not found` });
    return false;
  }
  return true;
};

export const checkLicensePlate = async (
  licensePlate: string
): Promise<boolean> => {
  const licensePlateRegex = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;
  return licensePlateRegex.test(licensePlate);
};

export const checkVehicleType = async (type: string): Promise<boolean> => {
  return type == ("Car" || "Truck");
};

export const checkDateFormat = async (
  date: string,
  res: Response
): Promise<boolean> => {
  const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
  if (!dateRegex.test(date)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `Invalid date format. Date should be in format 'YYYY-MM-DD'`,
    });
    return false;
  }
  return true;
};

export const checkDateOrder = async (
  startDate: string,
  endDate: string,
  res: Response
): Promise<boolean> => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `Start date should be before end date` });
    return false;
  }
  return true;
};
