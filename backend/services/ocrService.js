const { createWorker } = require('tesseract.js');

const runTesseractOcr = async (imagePath) => {
  const worker = await createWorker();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(imagePath);
  await worker.terminate();
  return text;
};

// A very basic NLP-like post-processor for demonstration purposes
const postProcessOcrText = (rawText) => {
  const parsedData = {
    patientName: '',
    date: '',
    doctorName: '',
    medicines: [],
    rawText: rawText,
  };

  // Example: simple regex to find common medication patterns
  const medicineRegex = /(.*?)\s+(\d+)(mg|g)\s+(.*?)(daily|twice a day|thrice a day|once a day|every \d+ hours|PRN)\s+(for \d+ days|as needed)/gi;
  let match;
  const lines = rawText.split('\n');

  for (const line of lines) {
    // Basic extraction for patient/doctor/date (highly simplified)
    if (line.toLowerCase().includes('patient name:')) {
      parsedData.patientName = line.split('patient name:')[1].trim();
    } else if (line.toLowerCase().includes('date:')) {
      parsedData.date = new Date(line.split('date:')[1].trim());
    } else if (line.toLowerCase().includes('doctor:')) {
      parsedData.doctorName = line.split('doctor:')[1].trim();
    }

    while ((match = medicineRegex.exec(line)) !== null) {
      parsedData.medicines.push({
        name: match[1] ? match[1].trim() : '',
        dose: match[2] + match[3],
        frequency: match[4].trim(),
        duration: match[5].trim(),
        notes: '', // Further NLP would be needed for detailed notes
      });
    }
  }

  return parsedData;
};

exports.runOcrPipeline = async (imagePath) => {
  const rawText = await runTesseractOcr(imagePath);
  const parsedData = postProcessOcrText(rawText);
  return parsedData;
};
