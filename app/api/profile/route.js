import User from "@models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { mongooseConnect } from "@lib/mongoose";

export async function PUT(request) {
  const { name, image } = await request.json();

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return Response.json({});
  }

  if (name) {
    if (name.length < 7 || name.length > 20) {
      return Response.json(
        {
          message: "Username must be between 7 and 20 characters",
          success: false,
        },
        { status: 400 }
      );
    }
    if (name.includes(" ")) {
      return Response.json(
        { message: "Username cannot contain spaces", success: false },
        { status: 400 }
      );
    }
    if (name !== name.toLowerCase()) {
      return Response.json(
        { message: "Username must be lowercase", success: false },
        { status: 400 }
      );
    }
    if (!name.match(/^[a-zA-Z0-9]+$/)) {
      return Response.json(
        {
          message: "Username can only contain letters and numbers",
          success: false,
        },
        { status: 400 }
      );
    }
  }
  try {
    await mongooseConnect();
    await User.updateOne({ email: userEmail }, { name, image });
    return Response.json(
      { message: "Updated Successfull", success: true },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message, success: false },
      { status: 404 }
    );
  }
}
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.userEmail;
  if (!email) {
    return Response.json({});
  }

  try {
    await mongooseConnect();
    await User.findOneAndDelete({ email });
    return Response.json(
      { message: "Deleted  Successfull", success: true },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message, success: false },
      { status: 404 }
    );
  }
}
export async function GET(request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return Response.json({});
  }

  try {
    await mongooseConnect();
    const user = await User.findOne({ email }).lean();
    return Response.json(user, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error.message, success: false },
      { status: 404 }
    );
  }
}
