"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { redirect } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { app } from "@app/firebase";
import Link from "next/link";

const Profile = () => {
  const session = useSession();
  const { status } = session;
  const [userName, setUserName] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const filePickerRef = useRef();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      const getUser = async () => {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok) {
          setUserData(data);
          setIsAdmin(data.isAdmin);
          setProfileFetched(true);
        }
      };
      getUser();
    }
  }, [session, status]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const savingPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: userName, image }),
        });
        const data = await res.json();
        if (data.success === false) {
          reject();
          setLoading(false);
        }
        if (res.ok) {
          resolve();
          setLoading(false);
        }
      } catch (error) {
        reject();
        setLoading(false);
      }
    });
    await toast.promise(savingPromise, {
      loading: "Saving...",
      success: "Profile saved!",
      error: "Error",
    });
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    const savingPromise = new Promise(async (resolve, reject) => {
      try {
        dispatch(deleteUserStart());
        const res = await fetch("/api/profile", {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success === false) {
          reject();
        }
        if (res.ok) {
          resolve();
        }
      } catch (error) {
        reject();
      }
    });
    await toast.promise(savingPromise, {
      loading: "Saving...",
      success: "User Deleted!",
      error: "Error",
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  async function logout() {
    await signOut();
    router.push("/");
  }

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
  if (status === "loading" || !profileFetched) {
    return (
      <p className="w-full text-2xl font-semibold text-center">Loading...</p>
    );
  }

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
            src={imageFileUrl || userData?.image}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <span color="failure">{imageFileUploadError}</span>
        )}
        <input
          type="text"
          id="name"
          placeholder="username"
          defaultValue={userData?.name}
          onChange={(ev) => setUserName(ev.target.value)}
          className="p-2 border-[3px] border-[lightgray] bg-slate-100 outline-none rounded"
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          onChange={(ev) => setUserEmail(ev.target.value)}
          defaultValue={userData?.email}
          className="p-2 border-[3px] border-[lightgray] bg-slate-100 outline-none rounded"
        />
        <input
          type="password"
          disabled={true}
          id="password"
          placeholder="password"
          className="p-2 border-[3px] border-[lightgray] bg-slate-100 outline-none rounded"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          disabled={imageFileUploading || loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        {isAdmin && (
          <Link
            className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
            href={"/createListing"}
          >
            Create Listing
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={logout} className="cursor-pointer">
          Sign Out
        </span>
        <span className="cursor-pointer" onClick={toggleModal}>
          Delete Account
        </span>
        {showModal && (
          <>
            <div className="fixed inset-0 z-10 bg-gray-300/50"></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
              <div className="mx-auto w-full overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-sm">
                <div className="relative p-5">
                  <div className="text-center">
                    <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Delete user
                      </h3>
                      <div className="mt-2 text-sm text-gray-500 max-w-sm">
                        Are you sure you want to delete this{" "}
                        {userData.name.split(" ")[0]} user?
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-end gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300"
                      onClick={handleDeleteUser}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
