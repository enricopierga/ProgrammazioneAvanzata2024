import { Request, Response } from "express"; // Import Request and Response types from Express
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"; // Import PDF creation tools from pdf-lib
import QRCode from "qrcode"; // Import QR code generation library
import InfractionRepository from "../repositories/InfractionRepository"; // Import the InfractionRepository
import UserRepository from "../repositories/UserRepository"; // Import the UserRepository
import VehicleRepository from "../repositories/VehicleRepository"; // Import the VehicleRepository
import routeRepository from "../repositories/RouteRepository"; // Import the RouteRepository
import GateRepository from "../repositories/GateRepository"; // Import the GateRepository
import { ReasonPhrases, StatusCodes } from "http-status-codes"; // Import HTTP status codes and reason phrases

// Interface for ticket data
interface TicketData {
  id: String;
  username: string;
  amount: number;
  uuid: String;
  entryLocation: string;
  exitLocation: string;
  expectedSpeed: number;
  actualSpeed: number;
  date: Date;
  ticketId: string;
  plateNumber: string;
  isPaid: boolean;
}

class PdfController {
  // Function to generate QR code
  async generateQrCode(data: string): Promise<String> {
    return QRCode.toDataURL(data);
  }

  // Function to handle PDF generation request
  getPdf = async (req: Request, res: Response) => {
    const infractionId = parseInt(req.params.id, 10); // Parse the infraction ID from the request parameters
    const infraction = await InfractionRepository.getById(infractionId); // Retrieve infraction details from the repository
    const user = await UserRepository.getById(req.user!.userId); // Retrieve user details from the repository

    const vehicle = await VehicleRepository.getById(infraction?.vehicleId!); // Retrieve vehicle details from the repository
    const route = await routeRepository.getById(infraction?.routeId!); // Retrieve route details from the repository
    const entryGateId = route?.startGateId;
    const exitGateId = route?.endGateId;
    const entryGate = await GateRepository.getById(entryGateId!); // Retrieve entry gate details from the repository
    const exitGate = await GateRepository.getById(exitGateId!); // Retrieve exit gate details from the repository

    // Check if infraction ID is valid
    if (isNaN(infractionId)) {
      return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
    }

    // Check if the user is authorized to access the infraction
    if (user?.id !== infraction!.userId) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    // Prepare the data for the ticket
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
      ticketId: infraction?.uuid!,
      plateNumber: vehicle?.licensePlate!,
      isPaid: infraction!.paid,
    };

    const pdf = await this.generatePdf(data); // Generate the PDF with the ticket data

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=infraction_${infraction?.id}.pdf`
    );
    res.setHeader("Content-Length", pdf.length);

    // Send the generated PDF as a response
    res.send(Buffer.from(pdf));
  };

  // Function to generate the PDF of the infraction
  async generatePdf(infractionData: TicketData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([800, 550]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fineStatus = infractionData.isPaid ? "Paid" : "Pending";

    page.drawText(`INFRACTION:`, {
      x: 50,
      y: height - 50,
      size: 30,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Status: ${fineStatus}`, {
      x: 50,
      y: height - 100,
      size: 20,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Username: ${infractionData.username}`, {
      x: 50,
      y: height - 150,
      size: 20,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Plate Number: ${infractionData.plateNumber}`, {
      x: 50,
      y: height - 200,
      size: 20,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Amount: ${infractionData.amount.toString()},00€`, {
      x: 50,
      y: height - 250,
      size: 20,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Entry Location: ${infractionData.entryLocation}`, {
      x: 50,
      y: height - 300,
      size: 20,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Exit Location: ${infractionData.exitLocation}`, {
      x: 50,
      y: height - 350,
      size: 20,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Limit: ${infractionData.expectedSpeed.toString()} km/h`, {
      x: 50,
      y: height - 400,
      size: 20,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText(
      `Measured Speed: ${infractionData.actualSpeed.toString()} km/h`,
      {
        x: 50,
        y: height - 450,
        size: 20,
        font: font,
        color: rgb(0, 0, 0),
      }
    );

    page.drawText(`Date: ${infractionData.date.toString()}`, {
      x: 50,
      y: height - 500,
      size: 20,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Generate a QR code as a Data URL image
    const qrCodeDataUrl = await QRCode.toDataURL(
      `${infractionData.id} | ${infractionData.uuid} | ${infractionData.plateNumber} | ${infractionData.amount}`
    );

    // Decode the Data URL image
    const qrCodeImageBytes = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");
    const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);

    // Add the QR code image to the PDF
    const qrCodeDims = qrCodeImage.scale(0.8);
    page.drawImage(qrCodeImage, {
      x: 400,
      y: height - 300,
      width: qrCodeDims.width,
      height: qrCodeDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
}

export default new PdfController(); // Export an instance of PdfController
