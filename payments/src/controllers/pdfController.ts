import express, { Request, Response } from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fetch from 'node-fetch';
import InfractionRepository from '../repositories/InfractionRepository';
import UserRepository from '../repositories/UserRepository';



// Interfaccia per i dati della multa
interface TicketData {
    username: string;
    amount: number;
    entryLocation: string;
    exitLocation: string;
    expectedSpeed: number;
    actualSpeed: number;
    date: string;
    paymentId: string;
    ticketId: string;
    plateNumber: string;
}

class pdfController {

    // Funzione per generare il QR code
    async generateQrCode(data: string): Promise<String> {
        return QRCode.toDataURL(data);
    };

    getPdf = async (req: Request, res: Response) => {
        const infractionId = parseInt(req.params.id, 10);
        const infraction = await InfractionRepository.getById(infractionId);
        const user = await UserRepository.getById(req.user!.userId);

        const data: TicketData = {
            username: user!.username,
            amount: 10,
            entryLocation: "string",
            exitLocation: "string",
            expectedSpeed: 100,
            actualSpeed: 200,
            date: "string",
            paymentId: "string",
            ticketId: "string",
            plateNumber: "string",
        }

        const pdf = await this.generatePdf(data)

        //TODO: verificare che è un numero, recuperare l'infraction, verifico che esiste, verifico che sia dell'utente loggato (vediInPyInfr.)
        //TODO: fare rotta Postman e trovare il modo di sparare pdf dentro all'immagine.
    }



    // Funzione per generare il PDF della multa
    async generatePdf(infractionData: TicketData): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        page.drawText('Ticket', {
            x: 50,
            y: height - 50,
            size: 30,
            font: font,
            color: rgb(0, 0, 0),
        });

        page.drawText(infractionData.username, {
            x: 50,
            y: height - 100,
            size: 20,
            font: font,
            color: rgb(0, 0, 0),
        });


        const qrCodeData = `${infractionData.paymentId}|${infractionData.ticketId}|${infractionData.plateNumber}|${infractionData.amount}`;
        const qrCodeUrl = await this.generateQrCode(qrCodeData);
        /*
                const qrImageBytes = await fetch(qrCodeUrl).then(res => res.arrayBuffer());
                const qrImage = await pdfDoc.embedPng(qrImageBytes);
                page.drawImage(qrImage, {
                    x: 400,
                    y: height - 350,
                    width: 100,
                    height: 100,
                });
        */
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;

    };
}
export default new pdfController();
