import { Response } from "express";
import GateRepository from "../repositories/GateRepository";
import UserRepository from "../repositories/UserRepository";
import { StatusCodes } from "http-status-codes";

/**
 * Checks if startGateId and endGateId exist in the Gates table.
 * @param res - Express response object.
 * @param startGateId - ID of the start gate.
 * @param endGateId - ID of the end gate.
 * @returns Promise<boolean> indicating if both gates exist.
 */
export const checkGatesIds = async (
  res: Response,
  startGateId: number,
  endGateId: number
): Promise<boolean> => {
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

/**
 * Checks if a user with the given ID exists.
 * @param userId - ID of the user.
 * @param res - Express response object.
 * @returns Promise<boolean> indicating if the user exists.
 */
export const checkUserId = async (
  userId: number,
  res: Response
): Promise<boolean> => {
  const user = await UserRepository.getById(userId);

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ message: `User not found` });
    return false;
  }
  return true;
};

/**
 * Validates the format of a license plate.
 * @param licensePlate - License plate string.
 * @param res - Express response object.
 * @returns boolean indicating if the license plate format is valid or not.
 */
export const checkLicensePlate = (
  licensePlate: string,
  res: Response
): boolean => {
  const licensePlateRegex = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;

  if (!licensePlateRegex.test(licensePlate)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid license plate format" });
    return false;
  }
  return true;
};

/**
 * Validates the vehicle type.
 * @param type - Vehicle type string.
 * @param res - Express response object.
 * @returns boolean indicating if the vehicle type is valid.
 */
export const checkVehicleType = (type: string, res: Response): boolean => {
  if (!(type === "Car" || type === "Truck")) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid vehicle type format, it must be Car or Truck",
    });
    return false;
  }
  return true;
};

/**
 * Validates the format of a date string.
 * @param date - Date string.
 * @param res - Express response object.
 * @returns boolean indicating if the date format is valid.
 */
export const checkDateFormat = (date: string, res: Response): boolean => {
  const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;

  if (!dateRegex.test(date)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `Invalid date format. Date should be in format 'YYYY-MM-DD'`,
    });
    return false;
  }
  return true;
};

/**
 * Validates the order of two date strings.
 * @param startDate - Start date string.
 * @param endDate - End date string.
 * @param res - Express response object.
 * @returns boolean indicating if the start date is before the end date.
 */
export const checkDateOrder = (
  startDate: string,
  endDate: string,
  res: Response
): boolean => {
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

/**
 * Validates the weather string.
 * @param weather - Weather string.
 * @param res - Express response object.
 * @returns boolean indicating if the weather is valid.
 */
export const checkWeather = (weather: string, res: Response): boolean => {
  if (!(weather === "Clear" || weather === "Rainy")) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid weather, it must be Clear or Rainy" });
    return false;
  }
  return true;
};

/**
 * Validates the format of a UUID string.
 * @param uuid - UUID string.
 * @param res - Express response object.
 * @returns boolean indicating if the UUID format is valid.
 */
export const checkUuid = (uuid: string, res: Response): boolean => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!regex.test(uuid)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid uuid format" });
    return false;
  }
  return true;
};
