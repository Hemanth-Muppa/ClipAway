import React from "react";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { removeBg } = useContext(AppContext);

  return (
    <div className="flex items-center justify-between max-sm:flex-col-reverse gap-y-10 px-4 mt-20 lg:px-44 sm-mt-20">
      {/* left side */}
      <div>
        <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-gray-700 leading-tight">
          Instantly remove <br className="max-md:hidden" />{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            image backgrounds
          </span>{" "}
          <br className="max-md:hidden" /> with ease
        </h1>

        <p className="my-6 text-[15px] text-gray-600">
          Upload your photo and get a transparent background in seconds using
          our <br className="max-sm:hidden" />
          AI-powered background removal tool — fast, free, and hassle-free.
        </p>

        <div>
          <input
            onChange={(e) => removeBg(e.target.files[0])}
            type="file"
            accept="image/*"
            id="upload1"
            hidden
          />
          <label
            htmlFor="upload1"
            className="inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 m-auto hover:brightness-110 transition-transform duration-500 hover:scale-105"
          >
            <img width={20} src={assets.upload_btn_icon} alt="" />
            <p className="text-white text-sm">Upload your image</p>
          </label>
        </div>
      </div>

      {/* right side */}
      <div className="w-full max-w-md">
        <img src={assets.sample} className = "w-100 h-100 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-101 hover:shadow-xl cursor-pointer" alt="" />
      </div>
    </div>
  );
};

export default Header;
