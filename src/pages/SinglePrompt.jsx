import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const SinglePrompt = () => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const { id } = useParams();
  const promptData = location.state?.prompt;

  useEffect(() => {
    if (promptData) {
      setTitle(promptData.title);
      setPrompt(promptData.prompt);
      setIsPrivate(promptData.isPrivate);
    } else {
      fetchPrompt();
    }
  }, [promptData]);

  const fetchPrompt = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/post/singlePrompt/${id}`,
        {
          withCredentials: true,
        }
      );
      setTitle(res.data.prompt.title);
      setPrompt(res.data.prompt.prompt);
      setIsPrivate(res.data.prompt.isPrivate);
    } catch (error) {
      toast.error("Failed to load prompt", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/post/updatePrompt/${id}`,
        { title, prompt, isPrivate },
        {
          withCredentials: true,
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Prompt Updated successfully!");
        window.location.href = "/profile";
      }
    } catch (err) {
      console.error(
        "Prompt Updation failed:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Post Updation failed");
    }
  };

  const deleteHandler = async () => {
    const deleted = await axios.delete(
      `http://localhost:3000/api/post/deletePrompt/${id}`,
      { withCredentials: true }
    );
    if (deleted) {
      toast.error("Deleted Successfully");
      window.location.href = "/profile";
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

      <button className="w-[55vw] p-4 rounded-2xl shadow-2xl text-xl bg-blue-400 dark:border active:scale-95">
        Update Prompt
      </button>
      <button
        className="w-[55vw] p-4 rounded-2xl shadow-2xl text-xl bg-red-400 dark:border active:scale-95"
        onClick={() => {
          deleteHandler();
        }}
      >
        Delete Prompt
      </button>
    </form>
  );
};

export default SinglePrompt;
