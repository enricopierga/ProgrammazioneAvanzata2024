// src/controllers/InfractionController.ts
import { Request, Response } from 'express';
import InfractionRepository from '../repositories/InfractionRepository';
import UserRepository from '../repositories/UserRepository';

class InfractionController {

  async getByPlatesAndPeriod(req: Request, res: Response): Promise<void> {
    const { plates, startDate, endDate } = req.body;
    const requestingUserId = Number(req.params.id)
    const requestingUser = await UserRepository.getById(requestingUserId);

    if (!plates || !startDate || !endDate) {
      res.status(400).json({ message: "Missing plates or date range" });
      return;
    }

    if(!requestingUser){
      res.status(404).json({ message: "User not found" });
      return;
    } 
    
    const isOperator = requestingUser.role === "Operatore"; 
    const infractions = await InfractionRepository.getByPlatesAndPeriod(plates, startDate, endDate, isOperator, requestingUserId);
    res.status(200).json(infractions);
  }
  
}


export default new InfractionController();







