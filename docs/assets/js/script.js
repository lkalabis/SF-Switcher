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
console.log(isDarkMode());
if (isDarkMode()) {
    document.querySelector('.sun').style.display = 'block';
    document.querySelector('.moon').style.display = '';
    // add the dark class to the body if is not already there
    if (!document.body.classList.contains('dark')) {
        document.body.classList.add('dark');
    }
} else {
    document.querySelector('.sun').style.display = 'none';
    document.querySelector('.moon').style.display = 'block';
    // remove the dark class from the body if is there
    if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
    }
}
