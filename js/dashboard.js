function OpenDashboard(index) {
    for (var i = 0; i < document.getElementById("panels").childElementCount; i++) {
        document.getElementById("panels").children[i].classList.remove("active");
    }
    document.getElementById("panels").children[index].classList.add("active");
    document.getElementById("selector").style.transform = "translateY(calc(" + (index * 100) + "% - " + (index * 20) + "px))";
}