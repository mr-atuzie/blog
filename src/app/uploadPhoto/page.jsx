"use client";
import { uploadPic } from "@/services/user";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UplaodPhoto = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = Cookies.get("user_token");

  const router = useRouter();

  async function uploadPhoto(ev) {
    ev.preventDefault();
    setUploading(true);

    if (!selectedImage) {
      return alert("Please select image");
    }

    try {
      const file = selectedImage;
      const dataDoc = new FormData();

      dataDoc.append("file", file);
      dataDoc.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);
      dataDoc.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);

      const res = await fetch(process.env.NEXT_PUBLIC_CLOUD_URL, {
        method: "post",
        body: dataDoc,
      });

      const imageData = await res.json();

      const uploadedFileUrl = imageData.secure_url.toString();

      console.log(uploadedFileUrl);

      const formData = {
        token,
        profilePic: uploadedFileUrl,
      };

      const response = await uploadPic(formData);
      const data = JSON.parse(response);

      router.push("/");

      setUploading(false);
    } catch (error) {
      setUploading(false);
      console.log(error);
    }
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <form className="flex gap-6 flex-col justify-center items-center w-full lg:w-[40%] my-20  mx-auto bg-white rounded-md shadow-md p-4 lg:p-8 ">
        <div>
          <h1 className="font-bold text-center text-2xl">Add Picture</h1>
          <p className="text-sm text-center text-gray-500">
            Join our community and share event,we got you
          </p>
        </div>
        <div className=" w-40 h-40 rounded-full  relative">
          <Image
            className=" object-cover rounded-full"
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt=""
            fill
            // width={96}
            // height={96}
          />
          <div className="">
            <label
              htmlFor="myImage"
              className=" cursor-pointer  absolute bottom-0 right-2 p-2 h-10 w-10 rounded-full bg-black text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </label>

            <input
              className="hidden"
              type="file"
              name="myImage"
              id="myImage"
              onChange={(event) => {
                console.log(event.target.files[0]); // Log the selected file
                setSelectedImage(event.target.files[0]); // Update the state with the selected file
              }}
            />
          </div>
        </div>

        <button
          onClick={uploadPhoto}
          disabled={uploading}
          className=" bg-black text-white py-2 px-4 rounded-md"
        >
          {uploading ? (
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            "Upload Image"
          )}
        </button>
      </form>
    </div>
  );
};

export default UplaodPhoto;
