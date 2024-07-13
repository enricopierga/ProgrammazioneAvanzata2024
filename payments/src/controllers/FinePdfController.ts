import { Request, Response } from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fetch from 'node-fetch';
import InfractionRepository from '../repositories/InfractionRepository';
import UserRepository from '../repositories/UserRepository';
import VehicleRepository from '../repositories/VehicleRepository';
import routeRepository from '../repositories/RouteRepository'
import GateRepository from '../repositories/GateRepository';

// Interfaccia per i dati della multa
interface TicketData {
    id: String,
    username: string;
    amount: number;
    uuid: String;
    entryLocation: string;
    exitLocation: string;
    expectedSpeed: number;
    actualSpeed: number;
    date: Date;
    paymentId: string;
    ticketId: string;
    plateNumber: string;
}

class PdfController {

    // Funzione per generare il QR code
    async generateQrCode(data: string): Promise<String> {
        return QRCode.toDataURL(data);
    };

    getPdf = async (req: Request, res: Response) => {

        const infractionId = parseInt(req.params.id, 10);
        const infraction = await InfractionRepository.getById(infractionId);
        const user = await UserRepository.getById(req.user!.userId);

        const vehicle = await VehicleRepository.getById(infraction?.vehicleId!);

        const route = await routeRepository.getById(infraction?.routeId!);
        const entryGateId = route?.startGateId;
        const exitGateId = route?.endGateId;

        const entryGate = await GateRepository.getById(entryGateId!);
        const exitGate = await GateRepository.getById(exitGateId!);

        if (isNaN(infractionId)) {
            return res.status(403).json({ message: "Invalid Format" })
        }

        if (user?.id !== infraction?.userId) {
            return res.status(404).json({ message: "Infraction not found" })
        }

        const data: TicketData = {
            username: user!.username,
            id: infraction!.id.toString(),
            uuid: infraction!.uuid.toString(),
            amount: infraction?.amount!,
            entryLocation: entryGate?.description!,
            exitLocation: exitGate?.description!,
            expectedSpeed: infraction?.limit!,
            actualSpeed: infraction?.speed!,
            date: infraction?.timestamp!,
            paymentId: "Dobbiamo ancora collegare vai a fare in culo",
            ticketId: infraction?.uuid!,
            plateNumber: vehicle?.licensePlate!,
        }

        const pdf = await this.generatePdf(data)

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=infraction_${infraction?.id}.pdf`);
        res.setHeader('Content-Length', pdf.length);

        // Invia il PDF come risposta
        res.send(Buffer.from(pdf));
    }



    // Funzione per generare il PDF della multa
    async generatePdf(infractionData: TicketData): Promise<Uint8Array> {


        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([800, 600]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        page.drawText(`Infraction:`, {
            x: 50,
            y: height - 50,
            size: 30,
            font: font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Username: ${infractionData.username}`, {
            x: 50,
            y: height - 100,
            size: 20,
            font: font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Plate Number: ${infractionData.plateNumber}`, {
            x: 50,
            y: height - 150,
            size: 20,
            font: font,
            color: rgb(0, 0, 0),
        });




        page.drawText(`Amount: ${infractionData.amount.toString()}`, {
            x: 50,
            y: height - 200,
            size: 20,
            font: font,
            color: rgb(0, 0, 0),
        });



        page.drawText(`Entry Location: ${infractionData.entryLocation}`, {
            x: 50,
            y: height - 250,
            size: 20,
            font: font,
            color: rgb(0, 0, 0),
        });



        page.drawText(`Exit Location: ${infractionData.exitLocation}`, {
            x: 50,
            y: height - 300,
            size: 20,
            font: font,
            color: rgb(0, 0, 0),
        });



        page.drawText(`Limit: ${infractionData.expectedSpeed.toString()} km/h`, {
            x: 50,
            y: height - 350,
            size: 20,
            font: font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Misured Speed: ${infractionData.actualSpeed.toString()} km/h`, {
            x: 50,
            y: height - 400,
            size: 20,
            font: font,
            color: rgb(0, 0, 0),
        });


        page.drawText(`Payment Id: ${infractionData.paymentId}`, {
            x: 50,
            y: height - 450,
            size: 15,
            font: font,
            color: rgb(0, 0, 0),
        });




        page.drawText(`Date: ${infractionData.date.toString()}`, {
            x: 50,
            y: height - 500,
            size: 20,
            font: font,
            color: rgb(0, 0, 0),
        });



        // Genera un QR code come immagine in formato Data URL
        const qrCodeDataUrl = await QRCode.toDataURL(`<${infractionData.ticketId}> | <${infractionData.uuid}> | <${infractionData.plateNumber}> | <${infractionData.amount}>`);

        // Decodifica l'immagine in formato Data URL
        const qrCodeImageBytes = await fetch(qrCodeDataUrl).then((res) => res.arrayBuffer());
        const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);

        // Aggiungi l'immagine del QR code al PDF
        const qrCodeDims = qrCodeImage.scale(0.5);
        page.drawImage(qrCodeImage, {
            x: 400,
            y: height - 50,
            width: qrCodeDims.width,
            height: qrCodeDims.height,
        });


        const pdfBytes = await pdfDoc.save();
        return pdfBytes;

    };

}


export default new PdfController();
