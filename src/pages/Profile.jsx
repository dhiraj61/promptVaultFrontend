import { useEffect, useState } from "react";
import axios from "axios";
import { RiHeartFill, RiHeartLine } from "@remixicon/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [prompt, setPrompt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState(0);
  const [expandedPromptId, setExpandedPromptId] = useState(null);
  const [isLike, setIsLike] = useState({});
  const [likeCount, setLikeCount] = useState({});
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/post/userPrompt",
        { withCredentials: true }
      );
      const totallike = await axios.get(
        "http://localhost:3000/api/totalLike",
        { withCredentials: true }
      );
      const allPrompts = res.data.data;
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
      setPrompt(res.data.data || []);
      setUser(res.data.user);
      setLikes(totallike.data.likeCount);
      setIsLike(likeResult);
      setLikeCount(promptLike);
    } catch (error) {
      toast.error("404 Not Found", error);
      setPrompt([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
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
      setLikes((prev) => prev + 1);
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
      setLikes((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="h-full w-full px-[8vw] sm:px-[18vw] md:px-[25vw] xl:px-[30vw] 2xl:px-[32vw] py-4  flex flex-col gap-4 items-center bg-white text-black dark:bg-gray-900 dark:text-white overflow-hidden">
      <div className="w-full bg-gray-50 dark:bg-gray-900 flex flex-row px-8 gap-4 justify-center">
        <img
          src={user?.avatar}
          alt="avatar"
          className="h-20 w-20 rounded-[5rem]"
        />
        <div className="flex flex-col font-medium justify-center">
          <h1>{user?.name}</h1>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col">
              <h1 className="mb-[-0.3rem]">{prompt.length}</h1>
              <h1>prompts</h1>
            </div>
            <div className="flex flex-col">
              <h1 className="mb-[-0.3rem]">{likes}</h1>
              <h1>likes</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[78vh] flex flex-col  gap-1 items-center overflow-hidden">
        <h1 className="text-xl font-medium ">Prompts</h1>
        <hr className="w-full" />
        <div className="w-full h-[80vh] p-4 flex flex-col gap-4 overflow-y-auto">
          {prompt.length === 0 ? (
            <p className="text-center text-gray-500">No prompts yet.</p>
          ) : (
            prompt.map((prompt) => {
              const shouldTrucate = prompt.prompt.length > 100;
              const expanded = expandedPromptId === prompt._id;
              const displayText = expanded
                ? prompt.prompt
                : prompt.prompt.slice(0, 100) + (shouldTrucate ? "..." : "");
              return (
                <div
                  key={prompt._id}
                  className="w-full flex flex-col gap-2 p-4 bg-transparent border rounded items-start cursor-pointer"
                  onClick={() => {
                    navigate(`/singleprompt/${prompt._id}`, {
                      state: { prompt },
                    });
                  }}
                >
                  <h1 className="text-sm font-normal ">
                    <b>Title: </b>
                    {prompt.title}
                  </h1>
                  <p className="text-sm font-normal ">
                    <b>Prompt:</b> {displayText}
                  </p>
                  {shouldTrucate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPromptId(expanded ? null : prompt._id)
                      }
                      }
                      className="text-blue-500 font-medium align-super"
                    >
                      {expanded ? "See less" : "See more"}
                    </button>
                  )
                  }
                  <p className="text-sm">
                    <b>Tags:</b>{" "}
                    {prompt.tags.map((tag, indx) => {
                      return indx + 1 + "." + " " + tag + " ";
                    })}
                  </p>
                  {
                    prompt.isPrivate ? (
                      <p className="text-sm font-bold text-red-400">Private</p>
                    ) : (
                      <p className="text-sm font-bold text-green-400">Public</p>
                    )
                  }
                  < hr className="w-full" />
                  <div className="flex flex-row items-center gap-2">
                    {isLike[prompt._id] ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          disLikeHandler(prompt._id);
                        }}
                      >
                        <RiHeartFill className="text-red-400" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
    </div >
  );
};

export default Profile;
