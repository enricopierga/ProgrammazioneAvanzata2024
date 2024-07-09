// src/controllers/InfractionController.ts
import { Request, Response } from 'express';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import InfractionRepository from '../repositories/InfractionRepository';
import VehicleRepository from '../repositories/VehicleRepository';

class InfractionController {
  async create(req: Request, res: Response): Promise<void> {
    const infraction = await InfractionRepository.create(req.body);
    res.status(201).json(infraction);
  }

  async getInfractionsByPlatesAndPeriod(req: Request, res: Response): Promise<void> {
    const { plates, startDate, endDate } = req.body;
    const isOperator = true; // DA TOGLIEREE!!!!!!! <<<-----------
    const userId = 1234; // DA TOGLIEREE!!!!!!! <<<<----------
    
    if (!plates || !startDate || !endDate) {
      res.status(400).json({ message: "Missing plates or date range" });
      return;
    }

    const infractions = await InfractionRepository.getInfractionsByPlatesAndPeriod(plates, startDate, endDate, isOperator, userId);
    res.status(200).json(infractions);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const infractionId = Number(req.params.id);

    if (isNaN(infractionId)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const infraction = await InfractionRepository.getById(infractionId);
    if (infraction) {
      res.status(200).json(infraction);
    } else {
      res.status(404).json({ message: "Infraction not found" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const infractionId = Number(req.params.id);

    if (isNaN(infractionId)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const updated = await InfractionRepository.update(infractionId, req.body);
    if (updated) {
      res.status(200).json({ message: "Infraction updated successfully" });
    } else {
      res.status(404).json({ message: "Infraction not found" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const infractionId = Number(req.params.id);

    if (isNaN(infractionId)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const deleted = await InfractionRepository.delete(infractionId);
    if (deleted) {
      res.status(200).json({ message: "Infraction deleted successfully" });
    } else {
      res.status(404).json({ message: "Infraction not found" });
    }
  }
  
  async generatePaymentSlip(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const infraction = await InfractionRepository.getById(Number(id));

        if (!infraction) {
            res.status(404).json({ message: 'Infraction not found' });
            return;
        }

        const vehicle = await VehicleRepository.getById(infraction.vehicleId);

        if (!vehicle) {
            res.status(404).json({ message: 'Vehicle not found' });
            return;
        }

        const { uuid, amount } = infraction;
        const { licensePlate } = vehicle;

        // Generare il QR code
        const qrCodeData = `${uuid}|${id}|${licensePlate}|${amount}`;
        const qrCodeImageUrl = await QRCode.toDataURL(qrCodeData);

        // Creare il PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();

        // Aggiungere testo al PDF
        page.drawText(`Targa: ${licensePlate}`, {
            x: 50,
            y: height - 50,
            size: 20,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        page.drawText(`Importo: ${amount} EUR`, {
            x: 50,
            y: height - 80,
            size: 20,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        // Aggiungere QR code al PDF
        const qrImage = await pdfDoc.embedPng(qrCodeImageUrl);
        page.drawImage(qrImage, {
            x: width - 150,
            y: height - 150,
            width: 100,
            height: 100,
        });

        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-Disposition', 'attachment; filename=payment-slip.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
  }

};


export default new InfractionController();

  





