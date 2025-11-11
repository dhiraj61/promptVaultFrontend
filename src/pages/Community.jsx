import { useEffect, useState } from "react";
import axios from "axios";
import { RiHeartFill, RiHeartLine } from "@remixicon/react";
import { toast } from "react-toastify";

const Community = () => {
  const [prompt, setPrompt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedPromptId, setExpandedPromptId] = useState(null);
  const [isLike, setIsLike] = useState({});
  const [likeCount, setLikeCount] = useState({});

  async function fetchData(query = "") {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/post/allPrompt?q=${query}`,
        { withCredentials: true }
      );
      const allPrompts = res.data.postWithUser;
      const likeResult = {};
      const promptLike = {};
      for (const p of allPrompts) {
        const likesRes = await axios.get(
          `http://localhost:3000/api/fetchLike/${p._id}`,
          { withCredentials: true }
        );
        likeResult[p._id] = likesRes.data.like;
        const promptLikeCount = await axios.get(
          `http://localhost:3000/api/promptLike/${p._id}`,
          { withCredentials: true }
        );
        promptLike[p._id] = promptLikeCount.data.likeCount;
      }
      setPrompt(res.data.postWithUser || []);
      setIsLike(likeResult);
      setLikeCount(promptLike);
      console.log('hii')
    } catch (error) {
      toast.error("404 Not Found", error);
      setPrompt([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  if (loading) {
    return <p className="text-center mt-10">Checking session...</p>;
  }

  const likeHandler = async (id) => {
    try {
      const like = await axios.post(
        `http://localhost:3000/api/like/${id}`,
        {},
        { withCredentials: true }
      );
      setIsLike((prev) => ({ ...prev, [id]: true }));
      if (like.data?.likeCount !== undefined) {
        setLikeCount((prev) => ({ ...prev, [id]: like.data.likeCount }));
      } else {
        setLikeCount((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const disLikeHandler = async (id) => {
    try {
      const like = await axios.delete(
        `http://localhost:3000/api/dislike/${id}`,
        { withCredentials: true }
      );
      setIsLike((prev) => ({ ...prev, [id]: false }));
      if (like.data?.likeCount !== undefined) {
        setLikeCount((prev) => ({ ...prev, [id]: like.data.likeCount }));
      } else {
        setLikeCount((prev) => ({
          ...prev,
          [id]: Math.max((prev[id] || 1) - 1, 0),
        }));
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="w-full h-full px-[8vw] sm:px-[18vw] md:px-[25vw] xl:px-[30vw] 2xl:px-[32vw] py-4  flex flex-col gap-4 items-center bg-white text-black dark:bg-gray-900 dark:text-white overflow-hidden">
      <div className="w-full h-[85vh] flex flex-col  gap-1 items-center overflow-hidden">
        <input
          type="text"
          className="w-full border-b  outline-0 p-2"
          placeholder="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div className="w-full h-[83vh] py-4 flex flex-col gap-4 overflow-y-auto">
          {prompt.length === 0 ? (
            <p className="text-center text-gray-500">No prompts yet.</p>
          ) : (
            prompt.map((prompt) => {
              const shouldTrucate = prompt.prompt.length > 100;
              const expanded = expandedPromptId === prompt._id;
              const displayText = expanded
                ? prompt.prompt
                : prompt.prompt.slice(0, 100) + (shouldTrucate ? "..." : "");
              const formatted = new Date(prompt.createdAt).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
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
                  <h1 className="text-sm font-normal ">
                    <b>Title: </b>
                    {prompt.title}
                  </h1>
                  <p className="text-sm font-normal ">
                    <b>Prompt:</b> {displayText}
                  </p>
                  {shouldTrucate && (
                    <button
                      onClick={() =>
                        setExpandedPromptId(expanded ? null : prompt._id)
                      }
                      className="text-blue-500 font-medium align-super"
                    >
                      {expanded ? "See less" : "See more"}
                    </button>
                  )}
                  <p className="text-sm">
                    <b>Tags:</b>{" "}
                    {prompt.tags.map((tag, indx) => {
                      return indx + 1 + "." + " " + tag + " ";
                    })}
                  </p>
                  <hr className="w-full" />
                  <div className="flex flex-row items-center gap-2">
                    {isLike[prompt._id] ? (
                      <button
                        onClick={() => {
                          disLikeHandler(prompt._id);
                        }}
                      >
                        <RiHeartFill className="text-red-400" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          likeHandler(prompt._id);
                        }}
                      >
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
