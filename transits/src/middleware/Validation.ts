import { Request, Response, NextFunction } from "express";
import GateRepository from "../repositories/GateRepository";
import UserRepository from "../repositories/UserRepository";

export const checkGatesIds = async(res: Response, startGateId: number, endGateId: number): Promise<boolean> =>{
    // Verifica se startGateId e endGateId esistono nella tabella Gates
    const startGate = await GateRepository.getById(startGateId);
    const endGate = await GateRepository.getById(endGateId);

    if (!startGate && !endGate) {
        res.status(404).json({ message: `Gates not found` });
        return false;
    }

    if (!startGate) {
        res.status(404).json({ message: `Start gate not found` });
        return false; 
    }

    if (!endGate) {
        res.status(404).json({ message: `End gate not found` });
        return false;
    }
    return true;
}

export const checkUserId = async (res: Response, userId: number): Promise<boolean> =>{
    const user =  UserRepository.getById(userId);
        if (!user) {
          res.status(400).json({ message: `User with ID ${userId} does not exist` });
          return false;
        }
    return true;
}

export const checkLicensePlate = async (licensePlate: string): Promise<boolean> =>{
    const licensePlateRegex = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;
    return licensePlateRegex.test(licensePlate);
}

export const checkVehicleType = async (type: string): Promise<boolean> =>{
    return type == ("car" || "truck");
}

