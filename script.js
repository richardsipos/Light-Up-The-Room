let mainDiv = document.querySelector("#mainDiv");

let rows=5  //inputra atrakod
let cols=5  //inputra atrakod
let playerName=""
let choosenTable
let myTable
let leaderBoard = document.createElement("table")
let restartButton = document.createElement("button")
let mentesIr = document.querySelector("#mentesIras")
restartButton.innerHTML="Játék újrainditása"

let buttonStop = document.createElement("button")
buttonStop.innerHTML="Megszakítás és mentés"
buttonStop.classList.add("megszakitasMentes")
let toSave
let kezdesIdo
let intervalFunction
let illuminatePoint


let lastPlayedGames = []
let regiJatekok = document.querySelector("#regiJatekok")
let regiJatekokOszlopok = document.querySelectorAll("#regiJatekok  #divFlex div")
let isAnimationRunning = false


//window.localStorage.clear()
if(window.localStorage.getItem('adatok') !== null){
  lastPlayedGames=JSON.parse(window.localStorage.getItem('adatok'))
}
ranglista()


//korabbi palyak kozul melyik lett valasztva
palyaMenuk = document.querySelector("#palyaValasztas")
palyaMenuk.addEventListener("click",()=>{
  mentesIr.innerHTML=""
  regiJatekokOszlopok.forEach(element => {
    element.innerHTML=""
  });
  if(palyaMenuk.value=="t5table"){
    palyaFolytatas()
  }
})

let submitButton = document.querySelector("#submitButton")
submitButton.addEventListener("click",()=>{
  
  document.querySelector("#palyavalaszto").classList.toggle("kivalasztott")
  document.querySelector("#jatekter").classList.toggle("kivalasztott")
  
  //megszakitas es mentes
  kezdesIdo = performance.now();

  //player neve
  if(document.querySelector("#playerName").value==""){
    playerName="Anonymous"
  }else{
    playerName = document.querySelector("#playerName").value
  }
  document.querySelector("#playerName").value=""

  choosenTable = document.querySelector("#palyaValasztas").value
  document.querySelector("#palyaValasztas").value=document.querySelector("#palyaValasztas")[0].value
  palyaNeveHTML=""
  
  createTable(choosenTable);
  feketeSzomszed()
  myTable.addEventListener("click" ,(e)=>{
    offRed()
    tableEventListener(e)
    
  })

  //mentes es leallitas
  document.querySelector("#jatekter").append(buttonStop)

  //eltelt ido kiirasa
  time()
      
})

function time(){
  let timeHeadingStat = document.createElement("h3")
  timeHeadingStat.innerHTML = "Eltelt idő: "
  document.querySelector("#jatekter").append(timeHeadingStat);
  let timeHeading = document.createElement("h2")
  intervalFunction = setInterval(() => {
    timeHeading.innerHTML=((performance.now() - kezdesIdo)/1000).toFixed(2)
    document.querySelector("#jatekter").append(timeHeading);
  }, 10)
}

buttonStop.addEventListener("click",()=>{
  offGame(false) 
})


function tableEventListener(e){
  if(e.target.matches("td")){
    if(e.target.style.backgroundColor=="black"){
  
    }
    else if(e.target.innerHTML==String.fromCodePoint(0x0001F4A1)){
      e.target.innerHTML="";
      vilagositas(e.target.cellIndex,e.target.parentNode.rowIndex,"white");
    }else{
      e.target.innerHTML=	String.fromCodePoint(0x0001F4A1);
      vilagositas(e.target.cellIndex,e.target.parentNode.rowIndex,"yellow");    
    }
    
    
  }
}

function gameOver(){
  let a = !teljesenKivilagitott()
  let b = egymastVilagitjak()
  let c = feketeSzomszed()
  mentesIr.innerHTML=""
  regiJatekokOszlopok.forEach(element => {
    element.innerHTML=""
  });

  if( a || b || c){
    console.log("Nem helyes a megoldásod/még nincs megoldásod!")
  }else{
    alert("Good job!")
    let vegsoIdo = ((performance.now()-kezdesIdo)/1000).toFixed(2);
    console.log("A kiraly koszoni neked a segitseget")
    offGame();

    //jatek lementese:

    let currentGame = {
      jatekosNev:playerName,
      palyaNeve:choosenTable,
      valasztottPalyaNeve: palyaNeveHTML,
      ido:vegsoIdo,
      siker:true,
      palya:myTable.outerHTML
    }

    lastPlayedGames.push(currentGame)
    ranglista(true)
  }
  
}

function offGame(win){
  //jatek lementese:
  let aktualisido = ((performance.now()-kezdesIdo)/1000).toFixed(2);

  let currentGame = {
    jatekosNev:playerName,
    palyaNeve:choosenTable,
    valasztottPalyaNeve: palyaNeveHTML,
    ido:aktualisido,
    siker:false,
    palya:myTable.outerHTML 
  }

  if(win==false){
    lastPlayedGames.push(currentGame)
  }
  
  ranglista()
  document.querySelector("#jatekter").innerHTML="Sok sikert!" 
  clearInterval(intervalFunction)
  document.querySelector("#palyavalaszto").classList.toggle("kivalasztott")
  document.querySelector("#jatekter").classList.toggle("kivalasztott")
}





function createTable(choosenTable) {
  if(choosenTable=="t1table"){

    myTable = document.querySelector("#t1table table").cloneNode(true)
    palyaNeveHTML="1. Könnyű"
    document.querySelector("#jatekter").append(myTable)
  }else if(choosenTable=="t2table"){
    myTable = document.querySelector("#t2table table").cloneNode(true)
    palyaNeveHTML="2. Haladó"
    document.querySelector("#jatekter").append(myTable)
  }else if(choosenTable=="t3table"){
    myTable = document.querySelector("#t3table table").cloneNode(true)
    palyaNeveHTML="3. Extrém"
    document.querySelector("#jatekter").append(myTable)
  }else if(choosenTable=="t4table"){
    myTable=document.createElement("table")
    palyaNeveHTML="4. Saját:" 
  }else{
    palyaNeveHTML="5. Régebbi"
    document.querySelector("#jatekter").append(myTable)
  }
  
}

function vilagositas(cellIndex,rowIndex,color){
  rows = myTable.querySelectorAll("tr")
  cells = rows[0].querySelectorAll("td")

  illuminatePoint = []

  let illuminateRight = []
  let illuminateLeft = []
  let bulb = false
  for(let l=cellIndex;l>=0;l--){ 
    if(myTable.rows[rowIndex].cells[l].style.backgroundColor == "black"){
      break;
    }else if(anotherLightBulb(rowIndex,l,rowIndex,cellIndex)){
      continue;
    }
    else if(myTable.rows[rowIndex].cells[l].innerHTML==String.fromCodePoint(0x0001F4A1) && l!=cellIndex){
      bulb=true;
      break;
    }
    else {
        illuminateLeft.push([rowIndex,l])
      
    }
  }
  
  for(let l=cellIndex+1;l<cells.length;l++){
    if(myTable.rows[rowIndex].cells[l].style.backgroundColor == "black"){
      break;
    }else if(anotherLightBulb(rowIndex,l,rowIndex,cellIndex)){
      continue;
    }else if(bulb==true){
      break;
    }
    else if(myTable.rows[rowIndex].cells[l].innerHTML==String.fromCodePoint(0x0001F4A1) && l!=cellIndex){
      bulb=true;
      break;
    }else{
        illuminateRight.push([rowIndex,l])
    }
  }
  if(bulb==true){
    illuminateRight=[]
    illuminateLeft=[]
  }
  
  bulb=false
  
  //fuggoleges kozelitese a dolgoknak
  let illuminateDown = []
  let illuminateUp= []
  for(let l=rowIndex+1;l<rows.length;l++){ 
    if(myTable.rows[l].cells[cellIndex].style.backgroundColor == "black"){
      break;
    }else if(anotherLightBulb(l,cellIndex,rowIndex,cellIndex)){
      continue;
    }else if(myTable.rows[l].cells[cellIndex].innerHTML==String.fromCodePoint(0x0001F4A1) && l!=rowIndex){
      bulb=true
      break;
    }
    else {
      illuminateDown.push([l,cellIndex])
    }
  }
  for(let l=rowIndex;l>=0;l--){
    if(myTable.rows[l].cells[cellIndex].style.backgroundColor == "black"){
      break;
    }else if(anotherLightBulb(l,cellIndex,rowIndex,cellIndex)){
      continue;
    }else if(myTable.rows[l].cells[cellIndex].innerHTML==String.fromCodePoint(0x0001F4A1) && l!=rowIndex){
      bulb=true
      break;
    }
    else {
      illuminateUp.push([l,cellIndex])
    }

  }
  if(bulb==true){
    illuminateUp=[]
    illuminateDown=[]
  }

  illuminatePoint.push(illuminateLeft)
  illuminatePoint.push(illuminateRight)
  illuminatePoint.push(illuminateUp)
  illuminatePoint.push(illuminateDown)


  isAnimationRunning=true
  Fun(`${color}`)
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
}

async function Fun(color){
  await Async(color)
  gameOver();
  
}
function Async(color){
  return new Promise((resolve) =>{
    setTimeout(()=>{
      resolve(illuminateWithAnimation(illuminatePoint,100,color));} ,100);
    })
  }

function anotherLightBulb(rowIndex,cellIndex,latestBulbRow,latestBulbCol){
  rows = myTable.querySelectorAll("tr")
  cells = rows[0].querySelectorAll("td")

  for(let i = rowIndex;i<rows.length;i++){
    if(myTable.rows[i].cells[cellIndex].style.backgroundColor=="black"){
      break;
    }
    if(myTable.rows[i].cells[cellIndex].innerHTML==String.fromCodePoint(0x0001F4A1) && i!=latestBulbRow){ 
      return true
    }
  }
  for(let i = rowIndex;i>=0;i--){
    if(myTable.rows[i].cells[cellIndex].style.backgroundColor=="black"){
      
      break;
    }
     if(myTable.rows[i].cells[cellIndex].innerHTML==String.fromCodePoint(0x0001F4A1) && i!=latestBulbRow){
      return true
    }
  }
  for(let j=cellIndex;j<cells.length;j++){
    if(myTable.rows[rowIndex].cells[j].style.backgroundColor=="black"){
      break;
    }
    if(myTable.rows[rowIndex].cells[j].innerHTML==String.fromCodePoint(0x0001F4A1) && j!=latestBulbCol){ 
      return true
    }
  }
  for(let j=cellIndex;j>=0;j--){
    if(myTable.rows[rowIndex].cells[j].style.backgroundColor=="black"){
      break;
    }
    if(myTable.rows[rowIndex].cells[j].innerHTML==String.fromCodePoint(0x0001F4A1) && j!=latestBulbCol){
      return true
    }
  }
  return false;
}
function offRed(){
  for (let i=0;i<rows.length;i++) 
  {
      for(let j=0; j<cells.length;j++) 
      {
        if(myTable.rows[i].cells[j].classList.contains('redBG'))
        {
          myTable.rows[i].cells[j].classList.remove('redBG')
        }
      }
  }
}

function teljesenKivilagitott(){
  rows = myTable.querySelectorAll("tr")
  cells = rows[0].querySelectorAll("td")
  for (let i=0;i<rows.length;i++) 
  {
      for(let j=0; j<cells.length;j++) 
      {
        if(myTable.rows[i].cells[j].style.backgroundColor=="white")
        {
          return false;
        }
      }
  }
  return true;
}

function egymastVilagitjak(){
  rows = myTable.querySelectorAll("tr")
  cells = rows[0].querySelectorAll("td")


  for (let i=0;i<rows.length;i++) 
  {
      for(let j=0; j<cells.length;j++) 
      {
        if(myTable.rows[i].cells[j].innerHTML==String.fromCodePoint(0x0001F4A1)){
          for(let l=j+1;l<cells.length;l++){
            if(myTable.rows[i].cells[l].style.backgroundColor == "black"){
              break;
            }else{
              if(myTable.rows[i].cells[l].innerHTML==String.fromCodePoint(0x0001F4A1)){
                myTable.rows[i].cells[j].classList.add("redBG")
                myTable.rows[i].cells[l].classList.add("redBG")
                return true;
              }
            }
          }
          for(let l=j-1;l>=0;l--){
            if(myTable.rows[i].cells[l].style.backgroundColor == "black"){
              break;
            }else{
              if(myTable.rows[i].cells[l].innerHTML==String.fromCodePoint(0x0001F4A1)){
                myTable.rows[i].cells[l].classList.add("redBG")
                myTable.rows[i].cells[j].classList.add("redBG")
                return true;
              }
            }
          }
          //fuggoleges kozelitese a dolgoknak
          for(let l=i+1;l<rows.length;l++){
            if(myTable.rows[l].cells[j].style.backgroundColor == "black"){
              break;
            }else{
              if(myTable.rows[l].cells[j].innerHTML==String.fromCodePoint(0x0001F4A1)){
                myTable.rows[l].cells[j].classList.add("redBG")
                myTable.rows[i].cells[j].classList.add("redBG")
                return true;
              }
            }
          }
          for(let l=i-1;l>=0;l--){
            if(myTable.rows[l].cells[j].style.backgroundColor == "black"){
              break;
            }else{
              if(myTable.rows[l].cells[j].innerHTML==String.fromCodePoint(0x0001F4A1)){
                myTable.rows[l].cells[j].classList.add("redBG")
                myTable.rows[i].cells[j].classList.add("redBG")
                return true;
              }
            }
          }

        }
      }
  }
  return false;
}


function feketeSzomszed(){
  rows = myTable.querySelectorAll("tr")
  cells = rows[0].querySelectorAll("td")
  let helytelen = false

  for (let i=0;i<rows.length;i++) 
  {
      for(let j=0; j<cells.length;j++) 
      {
        if(myTable.rows[i].cells[j].style.backgroundColor=="black" && myTable.rows[i].cells[j].innerHTML!=""){
          let maximum = myTable.rows[i].cells[j].innerHTML;
          let sum=0
          //szomszedok megnezzese
          if(i-1>=0 && myTable.rows[i-1].cells[j].innerHTML==String.fromCodePoint(0x0001F4A1)){
            sum++
          }
          if(i+1<rows.length && myTable.rows[i+1].cells[j].innerHTML==String.fromCodePoint(0x0001F4A1)){
            sum++
          }
          if(j-1>=0 && myTable.rows[i].cells[j-1].innerHTML==String.fromCodePoint(0x0001F4A1)){
            sum++
          }
          if(j+1<cells.length && myTable.rows[i].cells[j+1].innerHTML==String.fromCodePoint(0x0001F4A1)){
            sum++
          }
          if(sum!=maximum){
            myTable.rows[i].cells[j].style.color="red"
            helytelen=true
          }else{
            myTable.rows[i].cells[j].style.color="green"
          }
          

        }

      }
  }


  return helytelen;
}

function ranglista(){
  //localStorage
  window.localStorage.setItem('adatok', JSON.stringify(lastPlayedGames));
  
  leaderBoard.innerHTML=""
  let completedGames = lastPlayedGames.filter(e => e.siker == true)
  let unCompletedGames = lastPlayedGames.filter(e => e.siker == false)

  completedGames.sort(compare)
  unCompletedGames.sort(compare)

  let palyaIndex=-1;
  if(choosenTable=="t1table"){
    palyaIndex=0;
  }else if(choosenTable=="t2table"){
    palyaIndex=1;
  }
  else if(choosenTable=="t3table"){
    palyaIndex=2;
  }
  else if(choosenTable=="t4table"){
    palyaIndex=3;
  }
  else if(choosenTable=="t5table"){
    palyaIndex=4;
  }
  
  let rowHeader = document.createElement('tr')
  let Hcell0 =document.createElement('td') ;Hcell0.innerHTML=`<b>Sorszám</b>`
  let Hcell1 = document.createElement('td') ;Hcell1.innerHTML=`<b>Játékos</b>`
  let Hcell2 = document.createElement('td') ;Hcell2.innerHTML=`<b>Pálya</b>`
  let Hcell3 = document.createElement('td') ;Hcell3.innerHTML=`<b>Idő</b>`
  let Hcell4 = document.createElement('td') ; Hcell4.innerHTML=`<b>Siker?</b>`
  rowHeader.append(Hcell0)
  rowHeader.append(Hcell1) ;rowHeader.append(Hcell2)
  rowHeader.append(Hcell3) ; rowHeader.append(Hcell4)
  leaderBoard.append(rowHeader)

  let counter=0

  completedGames.forEach(e => {
    counter++
    let row = document.createElement('tr')
    let cell0 = document.createElement('td')
    cell0.innerHTML=`<br>${counter}`
    let cell1 = document.createElement('td')
    cell1.innerHTML=e.jatekosNev
    let cell2 = document.createElement('td')
    cell2.innerHTML=e.valasztottPalyaNeve
    let cell3 = document.createElement('td')
    cell3.innerHTML=e.ido
    let cell4 = document.createElement('td')
    if(e.siker==false){
      cell4.innerHTML="NEM"
    }else{
      cell4.innerHTML="SIKER"
    }
    row.append(cell0); row.append(cell1); row.append(cell2); row.append(cell3); row.append(cell4);
    leaderBoard.append(row);

    document.querySelector("#leaderBoard").append(leaderBoard)
  });
  let row = document.createElement('tr')
  leaderBoard.append(row)
  unCompletedGames.forEach(e => {
    
    let row = document.createElement('tr')
    counter++
    let cell0 = document.createElement('td')
    cell0=counter
    let cell1 = document.createElement('td')
    cell1.innerHTML=e.jatekosNev
    let cell2 = document.createElement('td')
    cell2.innerHTML=e.valasztottPalyaNeve
    let cell3 = document.createElement('td')
    cell3.innerHTML=e.ido
    let cell4 = document.createElement('td')
    if(e.siker==false){
      cell4.innerHTML="NEM"
    }else{
      cell4.innerHTML="SIKER"
    }
    
    row.append(cell0); row.append(cell1); row.append(cell2); row.append(cell3); row.append(cell4);
    leaderBoard.append(row);
    document.querySelector("#leaderBoard").append(leaderBoard)
  });

}

function compare( a, b ) {
  if ( a.ido < b.ido ){
    return -1;
  }
  if ( a.ido > b.ido ){
    return 1;
  }
  return 0;
}


function palyaFolytatas(){
  regiJatekok = document.querySelector("#regiJatekok")
  regiJatekokOszlopok = document.querySelectorAll("#divFlex div")


  mentesIr = document.querySelector("#mentesIras")
  mentesIr.innerHTML=""
  mentesIr.innerHTML=`<h3>Korábbi mentések:</h3>`

  if(lastPlayedGames.length==0){
    regiJatekok.innerHTML=`<h3>Sajnos nincsen egy korábbi pálya se.</h3>`
  }else{
    regiJatekokOszlopok.forEach(element => {
      element.innerHTML=""  
    });

    let count=0;
    lastPlayedGames.forEach(element => {
      
      if(count%2==0){
        regiJatekokOszlopok[0].innerHTML=regiJatekokOszlopok[0].innerHTML+String(element.palya)+`<caption>${element.jatekosNev} pályája</caption>`
      }else{
        regiJatekokOszlopok[1].innerHTML=regiJatekokOszlopok[1].innerHTML+String(element.palya)+`<caption>${element.jatekosNev} pályája</caption>`
      }
      
      count++;
    });
  }
  

}

regiJatekok.addEventListener("click",(e)=>{
  alert("Pálya kiválasztva, ha szeretnéd elinditani, kattints a submit gombra.");
  myTable=e.target.closest("table")
  let currGame = lastPlayedGames.filter(item=>item.palya===myTable)

  playerName=currGame.playerName
  choosenTable=currGame.palyaNeve
  palyaNeveHTML=currGame.valasztottPalyaNeve
  vegsoIdo = currGame.ido
  lastPlayedGames = lastPlayedGames.filter(item => item.palya!==myTable)
})

function illuminateWithAnimation(illuminatePoint,howFast,color){
  
  let voltEgy=false
  for(let j=0;j<4;j++){
    if(illuminatePoint[j][0]!=undefined && illuminatePoint[j][0].length!=0){
      voltEgy=true
      myTable.rows[illuminatePoint[j][0][0]].cells[illuminatePoint[j][0][1]].style.backgroundColor=color;

      illuminatePoint[j].shift()

      
    }
    
  }
  if(voltEgy!=false){
    return new Promise((resolve) =>{
      setTimeout(()=>{
        resolve(illuminateWithAnimation(illuminatePoint,howFast,color));} ,howFast);
      })
    
  }else{
    isAnimationRunning = isAnimationRunning && voltEgy
    return isAnimationRunning
    
  }
}