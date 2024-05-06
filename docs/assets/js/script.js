const isDarkMode = () => {
    return localStorage.getItem('dark-mode') === 'enabled';
}

document.querySelector('.sun-moon-switcher').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    // persist the dark mode preference in local storage
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.setItem('dark-mode', 'disabled');
    }
});

// if dark mode is enabled, show the sun icon, else show the moon icon
if (isDarkMode() === 'enabled') {
    document.querySelector('.sun').style.display = 'block';
    document.querySelector('.moon').style.display = 'none';
} else {
    document.querySelector('.sun').style.display = 'none';
    document.querySelector('.moon').style.display = 'block';
}
