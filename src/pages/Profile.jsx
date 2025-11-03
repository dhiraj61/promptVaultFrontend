const Profile = () => {
  return (
    <div className="w-full min-h-dvh p-4 flex flex-col items-center bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="w-full flex flex-row p-2 gap-4 shadow shadow-white rounded-2xl">
        <img
          src="https://ik.imagekit.io/odbuvwyqb/promptVaultUsers/ZMa_Sm049cBORCqgr8y7L_5FirXQYhE"
          alt="avatar"
          className="h-20 w-20 rounded-[5rem]"
        />
        <div className="flex flex-col font-medium justify-center">
            <h1>Dhiraj</h1>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                    <h1 className="mb-[-0.3rem]">5</h1>
                    <h1>prompts</h1>
                </div>
                <div className="flex flex-col">
                    <h1 className="mb-[-0.3rem]">15</h1>
                    <h1>likes</h1>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
