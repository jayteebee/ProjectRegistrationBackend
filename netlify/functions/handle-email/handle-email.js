// const handler = async (event) => {
//   if (event.httpMethod !== "POST") {
//     return {
//       statusCode: 405,
//       body: "Method Not Allowed",
//       headers: { "Allow": "POST" }
//     };
//   }

//   try {
//     const data = event.body ? JSON.parse(event.body) : {};
//     console.log("Received data:", data);

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ data }),
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*", // Adjust according to your security requirements
//       }
//     };
//   } catch (error) {
//     console.error("Error handling the request:", error);
//     return {
//       statusCode: 500,
//       body: `Error parsing JSON: ${error.toString()}`,
//       headers: {
//         "Content-Type": "application/json"
//       }
//     }
//   }
// }

// module.exports = { handler };


const { Document, Packer, Paragraph, HeadingLevel } = require('docx');
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
            children: [
                new Paragraph({
                    text: "Project Registration R&D Team North Team SSA",
                    heading: HeadingLevel.TITLE,
                }),
                new Paragraph({
                    text: "Teledyne FLIR Sales Manager: Krystle Temmerman",
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({ text: "", spaceAfter: 200 }),
                ...Object.entries(formData).map(([key, value]) => 
                    new Paragraph({
                        text: `${key}: ${value}`,
                        spacing: { after: 120 },
                    })
                ),
            ],
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
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
