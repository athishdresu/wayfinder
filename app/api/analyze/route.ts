import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('campus_image') as File;
    const lat = formData.get('latitude');
    const lng = formData.get('longitude');

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
    const prompt = `You are 'WayFinder', an advanced but highly user-friendly spatial navigation assistant. 
    Analyze this image captured at GPS coordinates: ${lat}, ${lng}. 

    Format your response using Markdown, and use **bold text** to highlight important objects, landmarks, safety hazards, and directions.

    Structure your intelligence report strictly into these three sections:
    
    ### Location Context
    Accurately describe the specific environment (e.g., indoor lounge, outdoor street, office building) based on the visual data and coordinates.
    
    ### Environment Scan
    Identify the key structural pathways, immediate obstacles, or points of interest around the user. Make sure to **bold** the most important items.
    
    ### Recommended Action
    Give the user clear, actionable advice on what to do next, how to navigate around immediate obstacles, or where to move based on their surroundings.`;
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent([prompt, imagePart]);
    const aiText = result.response.text();

    return NextResponse.json({ success: true, ai_text: aiText });

  } catch (error: any) {
    console.error("Gemini Engine Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}