import { useEffect, useState } from "react";
import axios from "axios";
import { RiHeartFill, RiHeartLine } from "@remixicon/react";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const Community = () => {
  const [prompt, setPrompt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedPromptId, setExpandedPromptId] = useState(null);
  const [isLike, setIsLike] = useState({});
  const [likeCount, setLikeCount] = useState({});
  const api = import.meta.env.VITE_API_URL;

  const fetchData = async (query = "") => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/api/post/allPrompt?q=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allPrompts = res.data.postWithUser;
      const likeResult = {};
      const promptLike = {};

      for (const p of allPrompts) {
        const likesRes = await axios.get(`${api}/api/fetchLike/${p._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        likeResult[p._id] = likesRes.data.like;

        const promptLikeCount = await axios.get(
          `${api}/api/promptLike/${p._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        promptLike[p._id] = promptLikeCount.data.likeCount;
      }

      setPrompt(allPrompts || []);
      setIsLike(likeResult);
      setLikeCount(promptLike);
    } catch (error) {
      toast.error("Failed to fetch prompts");
      setPrompt([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  if (loading) return <Loading />

  const likeHandler = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${api}/api/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsLike((prev) => ({ ...prev, [id]: true }));
      setLikeCount((prev) => ({
        ...prev,
        [id]: res.data.likeCount ?? (prev[id] || 0) + 1,
      }));
    } catch {
      toast.error("Failed to like post");
    }
  };

  const disLikeHandler = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${api}/api/dislike/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLike((prev) => ({ ...prev, [id]: false }));
      setLikeCount((prev) => ({
        ...prev,
        [id]: res.data.likeCount ?? Math.max((prev[id] || 1) - 1, 0),
      }));
    } catch {
      toast.error("Failed to dislike post");
    }
  };

  return (
    <div className="w-full h-full px-[8vw] sm:px-[18vw] md:px-[25vw] xl:px-[30vw] 2xl:px-[32vw] py-4 flex flex-col gap-4 items-center bg-white text-black dark:bg-gray-900 dark:text-white overflow-hidden">
      <div className="w-full h-[85vh] flex flex-col gap-1 items-center overflow-hidden">
        <input
          type="text"
          className="w-full border-b outline-0 p-2"
          placeholder="Search prompts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="w-full h-[83vh] py-4 flex flex-col gap-4 overflow-y-auto">
          {prompt.length === 0 ? (
            <p className="text-center text-gray-500">No prompts yet.</p>
          ) : (
            prompt.map((prompt) => {
              const shouldTruncate = prompt.prompt.length > 100;
              const expanded = expandedPromptId === prompt._id;
              const displayText = expanded
                ? prompt.prompt
                : prompt.prompt.slice(0, 100) +
                (shouldTruncate ? "..." : "");
              const formatted = new Date(prompt.createdAt).toLocaleDateString(
                "en-GB",
                { day: "2-digit", month: "short", year: "numeric" }
              );
              return (
                <div
                  key={prompt._id}
                  className="w-full flex flex-col gap-2 p-4 bg-transparent border rounded items-start"
                >
                  <div className="flex flex-row items-center gap-2">
                    <img
                      src={prompt.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-2xl object-cover"
                    />
                    <div className="flex flex-col">
                      <h1>{prompt.name}</h1>
                      <h6>{formatted}</h6>
                    </div>
                  </div>
                  <hr className="w-full" />
                  <h1 className="text-sm font-normal">
                    <b>Title:</b> {prompt.title}
                  </h1>
                  <p className="text-sm font-normal">
                    <b>Prompt:</b> {displayText}
                  </p>
                  {shouldTruncate && (
                    <button
                      onClick={() =>
                        setExpandedPromptId(expanded ? null : prompt._id)
                      }
                      className="text-blue-500 font-medium"
                    >
                      {expanded ? "See less" : "See more"}
                    </button>
                  )}
                  <p className="text-sm">
                    <b>Tags:</b>{" "}
                    {prompt.tags.map((tag, index) => `${index + 1}. ${tag} `)}
                  </p>
                  <hr className="w-full" />
                  <div className="flex flex-row items-center gap-2">
                    {isLike[prompt._id] ? (
                      <button onClick={() => disLikeHandler(prompt._id)}>
                        <RiHeartFill className="text-red-400" />
                      </button>
                    ) : (
                      <button onClick={() => likeHandler(prompt._id)}>
                        <RiHeartLine />
                      </button>
                    )}
                    <p>{likeCount[prompt._id]}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;