import { isAdmin } from "@app/api/auth/[...nextauth]/route";
import { mongooseConnect } from "@lib/mongoose";
import Listing from "@models/listing";

export async function GET(request, { params }) {
  await mongooseConnect();
  try {
    const listing = await Listing.findById(params.id);
    if (!listing) {
      return Response.json(
        { message: "listing Not Found", success: false },
        { status: 404 }
      );
    }
    return Response.json(listing, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error.message, success: false },
      { status: 404 }
    );
  }
}
export async function PUT(request, { params }) {
  const data = await request.json();
  try {
    await mongooseConnect();
    const updatedListing = await Listing.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    return Response.json(updatedListing, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error.message, success: false },
      { status: 404 }
    );
  }
}

export async function DELETE(request, { params }) {
  await mongooseConnect();
  try {
    if (await isAdmin()) {
      await Listing.findByIdAndDelete(params.id);
      return Response.json(
        { message: "deleting Successfully", success: true },
        { status: 200 }
      );
    } else {
      return Response.json({});
    }
  } catch (error) {
    return Response.json(
      { message: error.message, success: false },
      { status: 404 }
    );
  }
}
