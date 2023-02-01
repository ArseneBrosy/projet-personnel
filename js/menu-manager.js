var menus = document.getElementsByClassName("menu");

function CloseMenus() {
    Object.values(menus).forEach(menu => {
        menu.style.display = "none";
    });
}

function OpenMenu(name) {
    CloseMenus();
    var menu = document.getElementsByClassName(name)[0];
    menu.style.display = "block";
}