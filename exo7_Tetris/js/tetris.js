
    //document.getElementById("tetris").style.display = "block";
    document.getElementById("tetris").innerHTML = "\
    <div align='center'>\n\
        <div class='myMap' align='center'>\n\
            <div id='form'>\n\
                <!--<div id='form1'>\n\
                </div>\n\
                <div id='form_general'>\n\
                    <div id='form2'>\n\
                    </div>\n\
                    <div id='form3'>\n\
                    </div>\n\
                    <div id='form4'>\n\
                    </div>\n\
                </div>-->\n\
                <div class='position_Bscore'> <div id='best'>best Score</div> <p id='best_score'>0</p></div>\n\
            </div>\n\
            <div class='couleur' align='center'>\n\
                <canvas id='myMap'>\n\
                </canvas>\n\
                <div align=center' id='game_over'></div>\n\
            </div>\n\
            <button id='rejouer'>rejouer</button>\n\
            <h1 id='niveau'></h1>\n\
        </div>\n\
    </div>";

    var boite1 = document.querySelector('#heure'); 
    //variable objet 
    function horloge() 
    { 
    var heure =new Date(); 
    /*var heureGMT = heure.toGMTString();*/ 
    boite1.textContent = heure.getHours()+":"+ heure.getMinutes()+":"+ heure.getSeconds() /*+ " mais en GMT il est : " + heureGMT*/; 
    } 
    setInterval("horloge()", 1000);
    
//Début de la création du canvas
//avec une appèle de mon canvas avec "getElementById" 
//et l'appèle de l'id du canvas. 
var myMap = document.getElementById("myMap");

//variable pour la création de mon object et
//de ma grille sur mon canvas.
var map = myMap.getContext("2d");

//variable pour afficher le score
//et le meilleur score de l'utilisateur

var scoreUser = document.getElementById("score");
var scoreUser2 = document.getElementById("best_score");
var niveau = document.getElementById("niveau");
   
    myMap.width = 386;
    myMap.height = 500;
    //var user = document.getElementById('operation').value;
    
    var ligne = 18;
    var colonne = 14;
    var tc = taille_carre = 25;
    var background = "rgba(0, 0, 0)";
    
    //couleur de mes piece
    //créer avec des matrice carré dans 
    //dans le fichier Tetrominos.js
    var drawPiece = [
        [Z,"rgb(242, 215, 213)"],
        [S,"rgb(253, 237, 236 )"],
        [T,"rgb(245, 238, 248 )"],
        [O,"rgb(244, 236, 247 )"],
        [L,"rgb(234, 242, 248)"],
        [I,"rgb(235, 245, 251)"],
        [J,"rgb(232, 248, 245 )"]
    ];

//lancement de la fonction Game(); a partir d'un click

var lancer = document.querySelector("#play");
lancer.addEventListener("click", Game);

var rejouer = document.querySelector("#rejouer");
rejouer.addEventListener("click", Game);

var meilleur_score = 0;

function Game(){
    
    if(getState() === CHANGED){
        return;
    }
    setState(CHANGED);

    
    document.getElementById("game_over").style.display = "none";
    document.getElementById("rejouer").style.display = "none";
    document.getElementById("play").style.display = "none";
    
    niveau.style.display = "block";
    
    function drawSquare(x, y, couleur){
        
        //création des pieces et des grille
        //donc nous allont former notre premier ligne
        map.fillStyle = couleur;
        map.fillRect(x*(tc+3), y*(tc+3), tc, tc);
        grille(x, y);
    }
    function grille(x, y){
        /*var grilles = 20;
        if(user === grilles){
            map.strokeStyle="#222222";
        }else{
            map.strokeStyle="#555555";
        }*/
        map.strokeStyle="#222222";
        map.strokeRect(x*(tc+3), y*(tc+3), tc, tc);
        
    }
    //le but de cette condition et de
    //multiplier nos ligne et nos colonne 
    //de façon a créer notre grille
    var board = [];
    for(i = 0; i < ligne ; i++){
        board[i] = [];
        for(j = 0; j < colonne; j++){
            board[i][j] = background;
        }
    }
    function drawCadre(){
        for(i = 0; i < ligne ; i++){
            for(j = 0; j < colonne; j++){
                drawSquare(j,i,board[i][j]);
            }
        }    
    }
    //affichage de notre gille sur le canvas
    drawCadre();
 
    //piece aleatoire
    //du coup cette fonction nous permet
    //d'afficher aleatoirement nos piece sur le canvas
    function Piece_aleatoire(){
        var i = randomN = Math.floor(Math.random() * drawPiece.length)// 0 --> 6
        return new Piece(drawPiece[i][0],drawPiece[i][1]);
    }
    
    let p = Piece_aleatoire();
    
    /*création des piece*/
    function Piece(tetromino,couleur){
        this.tetromino = tetromino;
        this.couleur = couleur;
        
        this.tetrominoN = 0;//pour commencé à partir du premier tétromino
        this.activeTetromino = this.tetromino[this.tetrominoN];
        
        //mouvenment de notre piece
        this.x = 5;
        this.y = -2;
    }
    
    //dessin la piece sur le cadre
    

    Piece.prototype.fill = function(couleur){
        for(i = 0; i < this.activeTetromino.length ; i++){
            for(j = 0; j < this.activeTetromino.length; j++){
                if(this.activeTetromino[i][j]){
                    drawSquare(this.x + j, this.y + i, couleur);
                }
            }
        } 
    };
    
    Piece.prototype.draw = function(){
        this.fill(this.couleur);
    };
    // undraw a piece
    Piece.prototype.unDraw = function(){
        this.fill(background);
    };
    
    //mouvement de la piecce en bas
    Piece.prototype.moveDown = function(){
        if(!this.collision(0,1,this.activeTetromino)){
            this.unDraw();
            this.y++;
            this.draw();    
        }else{
            this.lock();
            p = Piece_aleatoire();
        }
    };
    
    //mouvement de la piecce a droite
    Piece.prototype.moveRight = function(){
        if(!this.collision(1,0,this.activeTetromino)){
            this.unDraw();
            this.x++;
            this.draw();    
        }
    };
    
    //mouvement de la piecce  gauche
    Piece.prototype.moveLeft = function(){
        if(!this.collision(-1,0,this.activeTetromino)){
            this.unDraw();
            this.x--;
            this.draw();    
        }
    };
    
    //mouvement de rotation de la piecce 
    Piece.prototype.rotate = function(){
        var nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
        var kick = 0;
       
        if(!this.collision(kick,0,nextPattern)){
            this.unDraw();
            this.x += kick;
            this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;// (0+1)%4 => 1
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw(); 
        }
    };
    
    
    var score = 0;
    
    Piece.prototype.lock = function(){
        for(i = 0; i < this.activeTetromino.length ; i++){
            for(j = 0; j < this.activeTetromino.length; j++){
                if(!this.activeTetromino[i][j]){
                    continue;
                }
                if(this.y + i < 0){
                    document.getElementById("game_over").style.display = "block";
                    document.getElementById("game_over").innerHTML = "\
                    <div class='null'>\n\
                        <h1 class='game'>GameOver</h1>\n\
                    </div>";
                    document.getElementById("rejouer").style.display = "block";
                    niveau.style.display = "none";
                    //arreter l'animation
                    gameOver = true;
                    break;
                }
                board[this.y+i][this.x+j] = this.couleur;
            }
        } 
        //enlever une ligne
        for(i = 0; i < ligne; i++){
            var supp = true;
            for(j = 0; j < colonne; j++){
                supp = supp && (board[i][j] !== background);
            }
            if(supp){
                for(y = i; y > 1; y--){
                    for(j = 0; j < colonne; j++){
                        board[y][j] = board[y-1][j];
                    }  
                }
                for(j = 0; j < colonne; j++){
                    board[0][j] = background;
                }
                score += 150;
            }
        }
        drawCadre();
        
        scoreUser.innerHTML = score;
        
        //garder le meilleur score
        if (meilleur_score < score)
        {
            meilleur_score = score;
        }
        
        var vide = 0;
        if( vide < meilleur_score)
        {
            vide = meilleur_score;
            scoreUser2.innerHTML = vide;
        }
    };
    
    //les colision
    //du coup le but et d'affecter a la fonction piece 
    //une collision entre les piece.
   Piece.prototype.collision = function(x, y, piece){
        for(i = 0; i < piece.length ; i++){
            for(j = 0; j < piece.length; j++){
                if(!piece[i][j]){
                    continue;
                }
                
                //coordonner de la piece
                //donc en récupère les coordonner 
                //des piece.
                var newX = this.x + j +x;
                var newY = this.y + i +y;
                
                //condition pour que la piece ne sort pas de la map
                if(newX < 0 || newX >= colonne || newY >= ligne ){
                    return true;
                }
                if(newY < 0){
                    continue;
                }
                if(board[newY][newX] !== background){
                    return true;
                }
            }
        } 
        return false;
    };
    
    //contrôle de la piecce 
    document.addEventListener("keydown",Control);
    
    function Control(){
        if (!gameOver)
        {
            if(event.keyCode === 37){
                p.moveLeft();
            }else if(event.keyCode === 32){
                p.rotate();
            }else if(event.keyCode === 39){
                p.moveRight();
            }else if(event.keyCode === 40){
                p.moveDown();
            }
        }
    }
    var dropStrat = Date.now();
    var gameOver = false;
    function drop(){
        var now = Date.now();
        var delta = now - dropStrat;
        //niveau 0
        if(score === 0 ){
            niveau.innerHTML='lvl 0'; 
            lvl = 700;
        //niveau 1
        }else if(score >= 500 ){
            //augmente la vitesse a 1
            niveau.innerHTML='lvl 1';
            lvl = 500;
        //niveau 2
        }
        if(score >= 1500 ){
            //augmente la vitesse a 0.3
            niveau.innerHTML='lvl 2';
            lvl = 300;
        //niveau 3
        }
        if(score >= 2500 ){
            //augmente la vitesse a 0.2
            niveau.innerHTML='lvl 3';
            lvl = 200;
        }
        if(score >= 9000 ){
            niveau.innerHTML='lvl max';
            //augmente la vitesse a 0.1
            lvl = 100;
        }
        
        if(delta > lvl){
            p.moveDown();
            dropStrat = Date.now();
        }
        if(!gameOver){
            requestAnimationFrame(drop);
        }
        else
        {
            setState(UNCHANGED);
        }
    }
    drop();
}

var state = 0;

var CHANGED = 1;
var UNCHANGED = 2;

function setState(state)
{
  this.state = state;
}

function getState()
{
  return state;
}