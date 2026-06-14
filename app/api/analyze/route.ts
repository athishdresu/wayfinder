import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('campus_image') as File;
    const latitude = formData.get('latitude') || "Unknown";
    const longitude = formData.get('longitude') || "Unknown";

    if (!imageFile) {
      return NextResponse.json({ success: false, error: "No image payload detected." }, { status: 400 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: imageFile.type,
      },
    };
    
    const prompt = `You are WayFinder. Analyze this image and GPS coordinates (${latitude}, ${longitude}). In exactly one single, short paragraph, do the following in order: 1) Describe the immediate environment and objects you see in the photo. 2) Provide a highly accurate address including the estimated Street Name, Neighborhood, City, State, and Country. 3) Name 2 nearby tourist spots. 4) End the paragraph with exactly this sentence: "If you want to navigate anywhere, access the Live Map below."`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent([prompt, imagePart]);
    const aiText = result.response.text();

    return NextResponse.json({ success: true, ai_text: aiText });

  } catch (error: any) {
    console.error("Gemini Engine Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}