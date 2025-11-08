import { useEffect, useState } from "react";
import axios from 'axios'

const Profile = () => {
  const [prompt, setPrompt] = useState([])
  const [loading, setLoading] = useState(true)
  const [user,setUser] = useState('')
  const [likes,setLikes] = useState('')
  const [expandedPromptId, setExpandedPromptId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('http://localhost:3000/api/post/userPrompt', { withCredentials: true })
        const like = await axios.get('http://localhost:3000/api/totalLike',{withCredentials:true})
        setPrompt(res.data.data || [])
        setUser(res.data.user)
        setLikes(like.data.likeCount)
      } catch (error) {
        console.log('User Not logged in', error)
        setPrompt([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <p className="text-center mt-10">Checking session...</p>;
  }
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 items-center bg-white text-black dark:bg-gray-900 dark:text-white overflow-hidden">
      <div className="w-full bg-gray-50 dark:bg-gray-900 flex flex-row p-2 gap-4 shadow dark:shadow-white rounded-2xl shrink-0">
        <img
          src={user.avatar}
          alt="avatar"
          className="h-20 w-20 rounded-[5rem]"
        />
        <div className="flex flex-col font-medium justify-center">
          <h1>{user.name}</h1>
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
          {
            prompt.length === 0 ? (<p className="text-center text-gray-500">No prompts yet.</p>) : (prompt.map((prompt) => {
              const shouldTrucate = prompt.prompt.length > 100
              const expanded = expandedPromptId === prompt._id
              const displayText = expanded ? prompt.prompt : prompt.prompt.slice(0, 100) + (shouldTrucate ? '...' : '')
              return (<div key={prompt._id} className="w-full flex flex-col gap-2 p-4 bg-transparent border rounded items-start">
                <p className="text-sm font-normal "><b>Prompt:</b> {displayText}</p>
                {shouldTrucate && (
                  <button onClick={() => setExpandedPromptId(expanded ? null : prompt._id)} className="text-blue-500 font-medium align-super">
                    {expanded ? 'See less' : "See more"}
                  </button>
                )
                }
                <p className="text-sm"><b>Tags:</b> {prompt.tags.map((tag,indx)=>{return indx+1 + '.' + ' '+tag+' '})}</p>
                {prompt.isPrivate ? (<p className="text-sm font-bold text-red-400">Private</p>) : (<p className="text-sm font-bold text-green-400">Public</p>)}
              </div>)
            }))

          }
        </div>
      </div>
    </div>
  );
};

export default Profile;

/*
{shouldTrucate && (
                <button onClick={() => setExpanded(!expanded)} className="mt-2 text-blue-500 hover:underline font-medium align-super">
                  {expanded ? 'See less' : "See more"}
                </button>
              )
            }
*/