const { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, WidthType, BorderStyle } = require('docx');
const nodemailer = require('nodemailer');

const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const docPath = await generateDocument(data);
    await sendEmailWithAttachment(docPath, data.Customer);
    
    return {
      statusCode: 200,
      body: "Email sent with document attached.",
    };
  } catch (error) {
    console.error("Error handling the request:", error);
    return { statusCode: 500, body: error.toString() };
  }
};


async function generateDocument(formData) {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: "Project Registration R&D Team North, Team SSA",
                    heading: HeadingLevel.TITLE,
                }),
                new Paragraph({
                    text: "Teledyne FLIR Sales Manager: Krystle Temmerman",
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({ text: "", spaceAfter: 200 }),
                createDetailsTable(formData),
            ],
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
}

function createDetailsTable(data) {
  const labels = [
      "Customer", "Application Details", "Summarise The Application", "Budget",
      "Demonstration Date and what will you be demonstrating and why that model:",
      "Expected closure date:", "Existing customer or new customer?", "Next Action Point:"
  ];

  // Calculate the width of each column to be 33% of the full page width
  const columnWidth = Math.round(11500 * 0.33); // About 33% of the usable page width

  const tableRows = labels.map(label => {
    const value = data[label] || "Not provided on Zoho..";
    return new TableRow({
        children: [
            new TableCell({
                children: [new Paragraph(label)],
                width: { size: 5000, type: WidthType.DXA },
                borders: {
                    top: { size: 1, style: BorderStyle.SINGLE },
                    bottom: { size: 1, style: BorderStyle.SINGLE },
                    left: { size: 1, style: BorderStyle.SINGLE },
                    right: { size: 1, style: BorderStyle.SINGLE }
                }
            }),
            new TableCell({
                children: [new Paragraph(value)],
                width: { size: 5000, type: WidthType.DXA },
                borders: {
                    top: { size: 1, style: BorderStyle.SINGLE },
                    bottom: { size: 1, style: BorderStyle.SINGLE },
                    left: { size: 1, style: BorderStyle.SINGLE },
                    right: { size: 1, style: BorderStyle.SINGLE }
                }
            })
        ]
    });
});

  return new Table({
      rows: tableRows,
      width: { size: 11500, type: WidthType.DXA } // Ensure the table spans the full page width
  });
}





async function sendEmailWithAttachment(buffer, customerName) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "jethro@thermalvisionresearch.co.uk",
            pass: "ThermalVR2k4",
        },
    });

    let mailOptions = {
        from: "jethro@thermalvisionresearch.co.uk",
        to: "jethro@thermalvisionresearch.co.uk",
        subject: 'New Project Registration Submission',
        text: `Hi Krystle,
        
        See Attached:`,
        attachments: [{
            filename: `Registration - ${customerName || "Unnamed Customer"}.docx`,
            content: buffer,
            contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }],
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { handler };