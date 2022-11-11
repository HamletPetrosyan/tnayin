let theme = Number(localStorage.getItem('theme'));
if(theme === null) theme = 0;

const colors = ['--backgnd', '--clr1', '--clr2', '--hvrclr', '--inputbck', '--clr', '--linkclr', '--solvedclr', '--triedclr'];
const themes = [['#203932', '#2F4B3A', '#325a32', '#3a633a', '#162823', '#C9DBCB', '#afbbb0', '#82bf89', '#420000'],
                ['#161616', '#1b1b1b', '#2a2a2a', '#3c3c3c', '#080808', '#c9c9c9', '#a1a1a1', '#58a861', '#a94848'],
                ['#F2E7D5', '#F7F7F7', '#e6e5e5', '#F2E7D5', '#F7F7F7', '#393E46', '#5a5f67', '#407b62', '#a94848'],
                ['#f5f5f5', '#f0f0f0', '#d1d1d1', '#bdbdbd', '#F7F7F7', '#494949', '#505050', '#2c8223', '#a42a2a']];

function changeTheme(x){
	let r = document.querySelector(':root');

	if(x == -1) theme = (theme + 1) % 4;
    else theme = x;

    for(let i = 0; i < colors.length; i++){
        r.style.setProperty(colors[i], themes[theme][i]);
    }
	localStorage.setItem('theme', theme);
}

changeTheme(theme);
