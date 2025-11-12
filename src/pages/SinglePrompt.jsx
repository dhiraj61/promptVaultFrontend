import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const SinglePrompt = () => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const promptData = location.state?.prompt;
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

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
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/api/post/singlePrompt/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle(res.data.prompt.title);
      setPrompt(res.data.prompt.prompt);
      setIsPrivate(res.data.prompt.isPrivate);
    } catch {
      toast.error("Failed to load prompt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${api}/api/post/updatePrompt/${id}`,
        { title, prompt, isPrivate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Prompt updated successfully!");
        navigate("/profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Prompt update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${api}/api/post/deletePrompt/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 || res.status === 201) {
        toast.error("Prompt deleted successfully");
        navigate("/profile");
      }
    } catch {
      toast.error("Failed to delete prompt");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white w-full min-h-dvh flex flex-col justify-center items-center gap-4 px-[8vw] sm:px-[18vw] md:px-[25vw] xl:px-[30vw] 2xl:px-[32vw] py-4"
    >
      <input
        className="w-full h-16 border-b outline-0 p-4"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />

      <textarea
        className="w-full border-b outline-0 p-4"
        value={prompt}
        rows="5"
        cols="30"
        wrap="hard"
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Prompt"
        required
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

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          className="w-[55vw] sm:w-[24vw] lg:w-[20vw] xl:w-[18vw] 2xl:w-[12vw] p-4 rounded-2xl shadow-2xl text-xl bg-blue-400 dark:border active:scale-95"
        >
          Update Prompt
        </button>

        <button
          type="button"
          className="w-[55vw] sm:w-[24vw] lg:w-[20vw] xl:w-[18vw] 2xl:w-[12vw] p-4 rounded-2xl shadow-2xl text-xl bg-red-400 dark:border active:scale-95"
          onClick={deleteHandler}
        >
          Delete Prompt
        </button>
      </div>
    </form>
  );
};

export default SinglePrompt;
