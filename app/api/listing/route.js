import { mongooseConnect } from "@lib/mongoose";
import Listing from "@models/listing";

export async function POST(request) {
  const data = await request.json();

  try {
    await mongooseConnect();
    await Listing.create(data);
    return Response.json(
      { message: "Listing Created SuccessFully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message, success: false },
      { status: 404 }
    );
  }
}
