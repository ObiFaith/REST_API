const toggleDarkMode = () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
    // Save the current theme in localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
};

// Function to load the saved theme
const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme === 'dark') document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
};

window.addEventListener('DOMContentLoaded', loadTheme);
document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);