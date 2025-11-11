import { RiMenuLine, RiSunFill, RiSunLine } from '@remixicon/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

const SidebarMenu = () => {
    const [toggled, setToggled] = useState(false);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
    const api = import.meta.env.VITE_API_URL

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const logoutHandler = async () => {
        const logout = await axios.post(`${api}/api/auth/logout`, {}, { withCredentials: true })
        if (logout) {
            window.location.href = '/login'
        }
    }

    return (
        <div className='flex w-full bg-gray-900 text-white dark:bg-white  dark:text-black transition-colors duration-300'>
            <Sidebar className='bg-white text-black dark:bg-gray-700 dark:text-blue-300' onBackdropClick={() => setToggled(false)} toggled={toggled} breakPoint="all">
                <Menu>
                    <MenuItem component={<Link to="/profile" />}>Profile</MenuItem>
                    <MenuItem component={<Link to="/" />}>Community</MenuItem>
                    <MenuItem component={<Link to="/createPrompt" />}>Create Prompt</MenuItem>
                    <MenuItem component={<Link to="/likedPrompt" />}>Liked Prompt</MenuItem>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </Menu>
            </Sidebar>
            <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
                <main className='w-full flex shrink-0 justify-between items-center p-4 bg-gray-900 text-white dark:bg-white dark:text-black'>
                    <button className="sb-button" onClick={() => setToggled(!toggled)}>
                        <RiMenuLine />
                    </button>

                    <h1 className='text-xl font-semibold'>Prompt Vault</h1>

                    <button onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? <RiSunLine /> : <RiSunFill />}
                    </button>
                </main>
            </div>

        </div>
    );
};

export default SidebarMenu;
