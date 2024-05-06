document.querySelector('.sun-moon-switcher').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    // if dark is active, set the css attribute of the 'moon' class to 'display: block'
    if (document.body.classList.contains('dark')) {
        document.querySelector('.sun').style.display = 'block';
        document.querySelector('.moon').style.display = 'none';
    } else {
        document.querySelector('.sun').style.display = 'none';
        document.querySelector('.moon').style.display = 'block';
    }
});
