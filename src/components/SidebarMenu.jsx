import { RiMenu3Line, RiMenuLine, RiMoonClearFill, RiMoonClearLine, RiSunFill, RiSunLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

const SidebarMenu = () => {
    const [toggled, setToggled] = useState(false);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    return (
        <div className='flex h-full w-full p-4 bg-gray-900 text-white dark:bg-white  dark:text-black transition-colors duration-300'>
            <Sidebar onBackdropClick={() => setToggled(false)} toggled={toggled} breakPoint="all">
                <Menu>
                    <MenuItem component={<Link to="/profile" />}>Profile</MenuItem>
                    <MenuItem component={<Link to="/" />}>Community</MenuItem>
                    <MenuItem component={<Link to="/createPrompt" />}>Create Prompt</MenuItem>
                    <MenuItem component={<Link to="/likedPrompt" />}>Liked Prompt</MenuItem>
                    <MenuItem>Logout</MenuItem>
                </Menu>
            </Sidebar>

            <main className='w-full flex justify-between items-center'>
                <button className="sb-button" onClick={() => setToggled(!toggled)}>
                    <RiMenuLine />
                </button>

                <h1 className='text-xl font-semibold'>Prompt Vault</h1>

                <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <RiSunLine /> : <RiSunFill />}
                </button>
            </main>
        </div>
    );
};

export default SidebarMenu;
