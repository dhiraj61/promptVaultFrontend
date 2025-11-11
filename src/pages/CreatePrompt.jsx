import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePrompt = () => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/post/createPost",
        { title, prompt, isPrivate },
        {
          withCredentials: true,
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Prompt Created successfully!");
        navigate('/profile')
      }
    } catch (err) {
      console.error(
        "Prompt Creation failed:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Post Creation failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white w-full min-h-dvh flex flex-col justify-center items-center gap-4 p-4"
    >
      <input
        className="w-full h-16 border-b outline-0 p-4"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        className="w-full border-b outline-0 p-4"
        value={prompt}
        rows="5"
        cols="30"
        wrap="hard"
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Prompt"
      ></textarea>

      <div className="w-full h-7 flex flex-row gap-4 items-baseline">
        <label htmlFor="private" className="text-xl">
          Private
        </label>
        <input
          id="private"
          className="w-4"
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
      </div>

      <button className="p-4 rounded-2xl shadow-2xl text-xl dark:bg-transparent dark:border active:scale-95">
        Create Prompt
      </button>
    </form>
  );
};

export default CreatePrompt;
