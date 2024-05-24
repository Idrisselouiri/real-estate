"use client";

import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { app } from "@app/firebase";

export default function Profile() {
  const session = useSession();
  const { status } = session;
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const router = useRouter();
  async function logout() {
    await signOut();
    router.push("/");
  }
  useEffect(() => {
    if (status === "authenticated") {
      const getUser = async () => {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok) {
          setName(data.name);
          setEmail(data.email);
          setImage(data.image);
          setUserId(data._id);
          setProfileFetched(true);
        }
      };
      getUser();
    }
  }, [session, status]);
  console.log(name);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImage(downloadURL);
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setLoading(true);

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    const savingPromise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`/api/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, image }),
        });
        const data = await res.json();
        if (!res.ok) {
          setUpdateUserError(data.message);
          reject();
          setLoading(false);
        } else {
          setLoading(false);
          resolve();
        }
      } catch (error) {
        setLoading(false);
        setUpdateUserError(error.message);
        reject();
      }
      await toast.promise(savingPromise, {
        loading: "Saving...",
        success: "User's profile updated successfully!",
        error: "Error",
      });
    });
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    const savingPromise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/profile", {
          method: "DELETE",
        });
        if (res.ok) {
          resolve();
          logout();
          router.push("/signin");
        }
      } catch (error) {
        reject();
      }
      await toast.promise(savingPromise, {
        loading: "Saving...",
        success: "User's profile deleted successfully!",
        error: "Error",
      });
    });
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/listing?userId=${userId}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);

        return;
      }
      if (res.ok) {
        setUserListings(data.listings);
      }
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      if (res.ok) {
        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
        toast.success("Listing User Deleted Successfully");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  if (status === "loading" || !profileFetched) {
    return <p>Loading...</p>;
  }
  console.log(status);
  if (status === "unauthenticated") {
    return redirect("/login");
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || image}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <span className="text-red-700 text-sm self-center">
            {imageFileUploadError}
          </span>
        )}
        <input
          type="text"
          id="name"
          className="border p-3 rounded-lg"
          placeholder="username"
          defaultValue={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          id="email"
          className="border p-3 rounded-lg"
          placeholder="email"
          defaultValue={email}
          disabled
        />
        <input
          type="password"
          id="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          disabled
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link href={"/createListing"}>
          <button
            type="button"
            className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 w-full"
          >
            Create a list
          </button>
        </Link>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={logout} className="cursor-pointer">
          Sign Out
        </span>
      </div>

      {updateUserError && (
        <span className="text-red-700 text-sm self-center mt-5">
          {updateUserError}
        </span>
      )}
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link href={`/listing/${listing.slug}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                href={`/listing/${listing.slug}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link href={`/updateListing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
