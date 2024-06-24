import React, { useState, useRef } from "react";
import ProfileImage from "../../img/profileImg.jpg";
import "./PostShare.css";
import { UilScenery, UilPlayCircle, UilTimes } from "@iconscout/react-unicons";

const PostShare = () => {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [desc, setDesc] = useState("");
  const imageRef = useRef();
  const videoRef = useRef();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage({
          image: URL.createObjectURL(img),
          base64String: e.target.result,
        });
      };
      reader.readAsDataURL(img);
      event.target.value = null;
    }
  };

  const onVideoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const vid = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideo({
          video: URL.createObjectURL(vid),
          base64String: e.target.result,
        });
      };
      reader.readAsDataURL(vid);
      event.target.value = null;
    }
  };

  const postContent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (image) {
        formData.append("images", image.base64String);
      } else if (video) {
        formData.append("videos", video.base64String);
      }
      formData.append("name", "Tzuyu");
      formData.append("userId", localStorage.getItem("userId"));
      formData.append("desc", desc);
      formData.append("likes", 0);
      formData.append("liked", false);

      const response = await fetch(
        `http://localhost:8080/api/posts/upload${video ? "/video" : ""}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Content uploaded successfully");
        resetForm();
      } else {
        console.error("Error uploading content");
      }
    } catch (error) {
      console.error("Error uploading content:", error);
    }
  };

  const resetForm = () => {
    setImage(null);
    setVideo(null);
    setDesc("");
    if (imageRef.current) {
      imageRef.current.value = null;
    }
    if (videoRef.current) {
      videoRef.current.value = null;
    }
  };

  return (
    <div className="PostShare">
      <img src={localStorage.getItem("image")} alt="" />
      <div>
        <div className="InputContainer">
          <input
            placeholder="What's happening?!"
            type="text"
            className="input"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="postOptions">
          <div
            className="option"
            style={{ color: "var(--photo)" }}
            onClick={() => imageRef.current.click()}
          >
            <UilScenery style={{ marginRight: 5 }} />
            Photo
          </div>
          <div
            className="option"
            style={{ color: "var(--video)" }}
            onClick={() => videoRef.current.click()}
          >
            <UilPlayCircle style={{ marginRight: 5 }} />
            Video
          </div>
          <button className="button-share" onClick={postContent}>
            Share
          </button>
          <div style={{ display: "none" }}>
            <input
              type="file"
              ref={imageRef}
              onChange={onImageChange}
            />
            <input
              type="file"
              ref={videoRef}
              onChange={onVideoChange}
            />
          </div>
        </div>
        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img src={image.image} alt="" />
          </div>
        )}
        {video && (
          <div className="previewImage">
            <UilTimes onClick={() => setVideo(null)} />
            <video src={video.video} controls style={{ maxWidth: '100%' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
