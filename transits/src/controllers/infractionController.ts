// src/controllers/InfractionController.ts
import { Request, Response } from "express";
import InfractionRepository from "../repositories/InfractionRepository";
import PDFDocument from 'pdfkit';
import qr from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

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



