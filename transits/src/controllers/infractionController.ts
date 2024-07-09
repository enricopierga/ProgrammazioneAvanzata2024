// src/controllers/InfractionController.ts
import { Request, Response } from 'express';
import InfractionRepository from '../repositories/InfractionRepository';

class InfractionController {
  async create(req: Request, res: Response): Promise<void> {
    const infraction = await InfractionRepository.create(req.body);
    res.status(201).json(infraction);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const infractions = await InfractionRepository.getAll();
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
}

export default new InfractionController();

	/*async getByVehicleAndPeriod(req: Request, res: Response): Promise<void> {
	  try {
		const { vehicleId, startDate, endDate } = req.query;
		const infractions = await InfractionRepository.getByVehicleAndPeriod(
		  Number(vehicleId),
		  new Date(startDate as string),
		  new Date(endDate as string)
		);
		res.status(200).json(infractions);
	  } catch (error) {
		res.status(500).json({ error: error.message });
	  }
	} */
  

/*
export const generaBollettino = async (req: Request, res: Response) => {
		const { multaId } = req.params;
	  
		const multa = await InfractionRepository.getById(multaId);
	  
		if (!multa) {
		  return res.status(404).send('Multa non trovata');
		}
	  
		const targa = multa.vehicleId;
		const importo = multa.amount;
		const uuidPagamento = uuidv4();
	  
		const qrString = `${uuidPagamento}|${multaId}|${targa}|${importo}`;
	  
		try {
		  // Genera il QR code
		  const qrCodeDataURL = await qr.toDataURL(qrString);
	  
		  // Imposta l'intestazione della risposta per il download del PDF
		  res.setHeader('Content-Disposition', 'attachment; filename=bollettino.pdf');
		  res.setHeader('Content-Type', 'application/pdf');
	  
		  // Crea il documento PDF
		  const doc = new PDFDocument();
		  doc.pipe(res);
	  
		  doc.fontSize(20).text('Bollettino di Pagamento', { align: 'center' });
		  doc.moveDown();
	  
		  doc.fontSize(16).text(`Targa: ${targa}`);
		  doc.text(`Importo: €${importo}`);
		  doc.text(`UUID Pagamento: ${uuidPagamento}`);
		  doc.moveDown();
	  
		  // Aggiunge il QR code al PDF
		  doc.image(qrCodeDataURL, {
			fit: [100, 100],
			align: 'center'
		  });
	  
		  doc.end();
		} catch (error) {
		  console.error('Errore nella generazione del QR code o del PDF:', error);
		  res.status(500).send('Errore nella generazione del bollettino di pagamento');
		}
	  };
*/


