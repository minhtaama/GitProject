for(let i = 0; i<levels.length; i++) {
    let grid = document.getElementById("lev-div");
    let label = grid.appendChild(document.createElement("label"));
    let rad = label.appendChild(document.createElement("input"));
    rad.setAttribute("id",`level${i+1}`);
    rad.setAttribute("type",`radio`);
    rad.setAttribute("name",`levels`);
    rad.setAttribute("value",`${i+1}`);

    let div = label.appendChild(document.createElement("div"));
    div.setAttribute("class","box");
    div.style.backgroundImage = `url("${levels[i].src}")`;
    div.style.backgroundSize = `contain`;
    
    let name = div.appendChild(document.createElement("p"));
    name.innerHTML += `level ${i+1}`;
    
    if (localStorage.getItem(`level-${i+1}`) == null) {
        levels[i].highScore = 0;
    } else levels[i].highScore = localStorage.getItem(`level-${i+1}`)

    name.innerHTML += `<br><br><span class="small-text">HIGHSCORE</span><br>${levels[i].highScore}`;
}

let lev = document.getElementsByName("levels");
lev[0].checked = true;

document.getElementById("play").addEventListener("click", ()=> {
        for(let i = 0; i < lev.length; i++) {
            if (lev[i].checked) {
                localStorage.setItem("level",lev[i].value);
            }
        }
        location.href = "bouncing-ball.html";
    }   
)

document.getElementById("reset").addEventListener("click", ()=> {
    localStorage.clear();
    location.href = "index.html";
    }
)
