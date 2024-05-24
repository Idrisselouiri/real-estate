import { mongooseConnect } from "@lib/mongoose";
import Listing from "@models/listing";

export async function POST(request) {
  const data = await request.json();
  const slug = data.name
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  try {
    await mongooseConnect();
    const newListing = await Listing.create({ ...data, slug });
    return Response.json(newListing, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error.message, success: false },
      { status: 404 }
    );
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  try {
    await mongooseConnect();
    const startIndex = parseInt(searchParams.get("startIndex")) || 0;
    const limit = parseInt(searchParams.get("limit")) || 9;
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    let offer = searchParams.get("offer");

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = searchParams.get("furnished");

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = searchParams.get("parking");

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = searchParams.get("type");

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const listings = await Listing.find({
      ...(searchParams.get("userId") && { userId: searchParams.get("userId") }),
      ...(searchParams.get("slug") && { slug: searchParams.get("slug") }),
      ...(searchParams.get("listingId") && {
        _id: searchParams.get("listingId"),
      }),
      ...(searchParams.get("searchTerm") && {
        $or: [
          { name: { $regex: searchParams.get("searchTerm"), $options: "i" } },
          {
            description: {
              $regex: searchParams.get("searchTerm"),
              $options: "i",
            },
          },
        ],
      }),
    })
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);

    const totalListings = await Listing.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthListings = await Listing.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    return Response.json(
      { listings, totalListings, lastMonthListings },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message, success: false },
      { status: 404 }
    );
  }
}
