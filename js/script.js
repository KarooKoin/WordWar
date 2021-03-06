 $(function() {
    var healthPoints;
    var enemyHealthPoints;

    var rocketDamages;
    var enemyRocketDamages;
    var countRocket;
    var enemyRocket;
    var firstRocket;

    var timeRemain;
    var enemyTimeRemain;
    var betweenRockets;

    var timer;
    var enemyTimer;

    var wordsObject;
    var word;

    var end;

    var COMBO = 5;
    var actualCombo;

    var levels = {1:{'damages':91,'enemyDamages':100,'timeRocket':10,'enemyTimeRocket':11,'countRocket':1,'maxLetters':3,'description':'Bienvenue commandant, protégez votre château contre l’ennemi en le détruisant en premier avec vos canons.<br>Ecrivez les mots magiques apparaissant à l’écran pour enchanter vos boulets de canon. Cela vous permettra de les rendre plus explosifs.'},
                  2:{'damages':40,'enemyDamages':100,'timeRocket':10,'enemyTimeRocket':21,'countRocket':2,'maxLetters':4,'description':'Le château adverse a renforcé ses murs, deux boulets vont être nécessaires pour passer à travers le sortilège et détruire complètement leur fort.'},
                  3:{'damages':30,'enemyDamages':40,'timeRocket':15,'enemyTimeRocket':15,'betweenRockets':5000,'countRocket':2,'maxLetters':5,'description':'Nos ennemis ont amélioré leurs canons et tirent maintenant des boulets toutes les cinq secondes. Pour contrer leur stratégie, nos mages ont réussi à mettre au point un sort qui permet de faire exploser le boulet ennemi. Il nécessite de réussir cinq mots magiques d’affilée.'}
    };
    var actualLevel = 1;

    $.ajax({
        type: "POST",
        url: "./dictionary/wordsToArray.php",
        success: function(msg){
            wordsObject = jQuery.parseJSON(msg);
            $('#level-start').click(function(){startGame()});
            $('#start').fadeIn("slow").click(function(){start()});
            $('#next-level').click(function(){nextLevel()});
        }
    });

	$("#level-start").click(function(){
	
	    var $this = $(this);
	    
	    if($this.data('clicked')) {
	        $("#game-content").animate({"backgroundPosition":'-800px 0px'},3800);
	    }
	    else {
	        $("#game-content").animate({"backgroundPosition":'-800px 0px'},3800);
	    }
	});
	
/* 	document.getElementById("musique").play(); */
	
	function start(){
		$("#start").fadeOut(600);
        $("#logo").fadeIn(600).css("top","20px");
        $('#level').html(actualLevel);
        $('#popup p').html(levels[actualLevel]['description']);
        $("#popup").fadeIn(600);

        //On compare si le mot entré correspond au mot demandé
        $(document).keypress(function(e){
            if(e.which == 13 && end === false){ //si touche entrée pressée
                console.log(actualCombo);
                var inputWord = $('#wordField').val().toUpperCase();
                $('#wordField').val("");
                if(inputWord === word){
                	$('#wordField').css('box-shadow','0px 0px 20px #00FF00');
                    console.log('bon');
                    actualCombo ++;
                    if(actualCombo % COMBO == 0 && typeof(levels[actualLevel]['betweenRockets'])!=='undefined'){
                        console.log('combo');
                        clearInterval(enemyTimer[firstRocket]);
                        $('#bouletE'+firstRocket).hide();
                        firstRocket += 1;
                    }
                    addRocketDamages(word.length);
                    generateWord(3,levels[actualLevel]['maxLetters']);
                }
                else{
                    actualCombo = 0;
                    $('#wordField').css('box-shadow','0px 0px 20px #FF0000');
                    console.log('mauvais');
                }
            }
        })
	}

    function nextLevel(){
         actualLevel ++;
         $('#level').html(actualLevel);
         $('#popup p').html(levels[actualLevel]['description']);
         $("#popup").fadeIn(600);
         $('#next-level').hide();
         $('#level-start').attr('src','img/start.png').attr('alt','start-level').show();
         console.log ('lol');
     }
	
    function startGame(){
        newParty();
       
        $("#popup").fadeOut(600);
        $("#player").fadeIn(600).css("display","block");
        $("#ennemy").fadeIn(600).css("display","block");
        $("#word").fadeIn(600).css("display","block");
        $("#wordField").fadeIn(600).css("display","block");
        $('#CastleP').transition({ x: '-800px' }, 3800,'ease');
        $('#CastleE').transition({ x: '-400px' }, 3800,'ease');

        //On focus sur le champ input
        $("#wordField").focus().val("");
        $(document).click(function(){
            $("#wordField").focus();
        });
        $('#wordField').bind('paste', function (e) {
            e.preventDefault();
        });
    }

    function newParty(){
        end = false;
        actualCombo = 0;
        enemyTimer = [];
        countRocket = 0;
        enemyRocket = [];
        firstRocket = 0;
        betweenRockets = [];
        $('#wordField').attr('readonly',null);
        $('#CastleP').css("background","url('./img/joueur_1.png')");
        $('#CastleE').css("background","url('./img/ennemi_1.png')");
        $('#wordField').css('box-shadow','0px 0px 0px #000');
        initHP();
        initHP('enemy');
        $('#fillP').css("width",healthPoints+"%");
        $('#fillE').css("width",enemyHealthPoints+"%");
        $('#countRocket').html('');
        for (i=1; i<=levels[actualLevel]['countRocket']; i++){
            $('#countRocket').append('<img src="img/bouletE.png" alt="boulet">');
        }
        setTimeout(function(){
            generateWord(3,levels[actualLevel]['maxLetters']);
            newRocket();
            newRocket('enemy');
        },4000);
    }

    function initHP(enemy){
        if(typeof(enemy)==='undefined'){
            healthPoints = 100;
            $('#playerHP').html(healthPoints);
        }
        else{
            enemyHealthPoints = 100;
            $('#enemyHP').html(enemyHealthPoints);
        }
    }

    function initDamages(enemy){
        if(typeof(enemy)==='undefined'){
            rocketDamages = levels[actualLevel]['damages'];
            $('#playerDamages').html(rocketDamages);
        }
        else{
            enemyRocketDamages = levels[actualLevel]['enemyDamages'];
            $('#enemyDamages').html(enemyRocketDamages);
        }
    }

    function initTime(enemy){
        if(typeof(enemy)==='undefined'){
            timeRemain = levels[actualLevel]['timeRocket'];
            //$('#playerTime').html(timeRemain);
            $(function() {
                $(".playerTime")
                    .val(timeRemain)
                    .trigger('change')
                    .knob({
                        'readOnly' : true,
                        'min':0,
                        'max':30
                    });
            });
        }
        else{
            enemyTimeRemain = levels[actualLevel]['enemyTimeRocket'];
            $('#enemyTime').html(enemyTimeRemain);
        }
    }

    //argument enemy à ne préciser que si c'est un missile ennemi, sinon laisser vide
    function newRocket(enemy){
        if (end === false){
            initDamages(enemy);
            initTime(enemy);
            if(typeof(enemy)!=='undefined'){
                enemyRocket.push({'damages':enemyRocketDamages,'time':enemyTimeRemain});
                if(typeof(levels[actualLevel]['betweenRockets'])!=='undefined' && end==false){
                    betweenRockets[enemyRocket.length-1]=setTimeout(function(){newRocket('enemy')},levels[actualLevel]['betweenRockets'])
                }
                launchRocket(enemy,enemyRocket.length-1);
            }
            else{
                launchRocket(enemy);
            }
        }
    }

    function generateWord(begin,end){
        var wordLength = Math.floor(Math.random() * (end - begin + 1)) + begin;
        var lastWord = word;
        word = wordsObject[wordLength][Math.floor(Math.random()*wordsObject[wordLength].length)];
        if(word == lastWord){
            generateWord(begin,end);
        }
        $('#word').html(word);
    }

    //defilement du temps restant
    function launchRocket(enemy,rocketKey){
        if(typeof(enemy)==='undefined'){
            $('img:last-child', '#countRocket').remove();
            countRocket += 1;
            document.getElementById("boom").play();
            $('#bouletP')
        	.transition({ x: 200, y: -100},((levels[actualLevel]['timeRocket']*1000)/4),'linear')
        	.transition({ x: 300, y: -130}, ((levels[actualLevel]['timeRocket']*1000)/4),'linear')
        	.transition({ x: 370, y: -150}, ((levels[actualLevel]['timeRocket']*1000)/4),'linear')
        	.transition({ x: 500, y: 0}, ((levels[actualLevel]['timeRocket']*1000)/4),'linear')
        	.transition({ x: 0, y: 0}, 0,'linear');
        	$('#bouletP img').css('width','30px');

            timer = setInterval (function(){
                soustractTime(1);
            },1000);
        }
        else{
            $('#boulets').append('<div id="bouletE'+rocketKey+'"><span class="enemyDamages"></span><img src="img/boulet.png"></div>');
            $('.enemyDamages').html(enemyRocketDamages);
            document.getElementById("boom").play();
            $('#bouletE'+rocketKey)
        	.transition({ x: -200, y: -100},((levels[actualLevel]['enemyTimeRocket']*1000)/4),'linear')
        	.transition({ x: -300, y: -130}, ((levels[actualLevel]['enemyTimeRocket']*1000)/4),'linear')
        	.transition({ x: -370, y: -150}, ((levels[actualLevel]['enemyTimeRocket']*1000)/4),'linear')
        	.transition({ x: -500, y: 0}, ((levels[actualLevel]['enemyTimeRocket']*1000)/4),'linear')
        	.transition({ x: 0, y: 0}, 0,'linear');
        	
            enemyTimer[rocketKey] = setInterval (function(){
                soustractTime(1,enemy,rocketKey);
            },1000);
        }
    }

    function soustractTime(time,enemy,rocketKey){
        if(typeof(enemy)==='undefined'){
            timeRemain -= time;
            //$('#playerTime').html(timeRemain);
            $(function() {
                $(".playerTime")
                    .val(timeRemain)
                    .trigger('change')
                    .knob({
                        'readOnly' : true,
                        'min':0,
                        'max':30
                    });
            });
            if (timeRemain <= 0){
                clearInterval(timer);
                makeDamages(enemyHealthPoints,rocketDamages);
                if(countRocket < levels[actualLevel]['countRocket']){
                    newRocket();
                }
            }
        }
        else{
            enemyRocket[rocketKey]['time'] -= time;
            $('#enemyTime').html(enemyRocket[rocketKey]['time']);
            if (enemyRocket[rocketKey]['time'] <= 0){
                clearInterval(enemyTimer[rocketKey]);
                getDamages(healthPoints,enemyRocket[rocketKey]['damages']);
                firstRocket += 1;
                newRocket(enemy);
            }
        }
    }

    function addRocketDamages(damages){
        rocketDamages += damages;
        $('#playerDamages').html(rocketDamages);
        $('#bouletP img').css('width','+=5');
    }

    function getDamages(hp,enemyRocketDamages){
        healthPoints = hp - enemyRocketDamages;
        $('#fillP').css("width",healthPoints+"%");
        if (healthPoints <= 50){
        	document.getElementById("boom1").play();
        	$("#fumeeP").fadeIn(200).fadeOut(500);
	        $('#CastleP').css("background","url('./img/joueur_2.png')");
        }
        if(healthPoints <= 0){
        	document.getElementById("boom1").play();
            $('#CastleP').css("background","url('./img/joueur_3.png')");
            end=true;
            $('#playerHP').html(0);
            endGame();
            $('#popup').fadeIn('');
            $('#popup p').html('Vous avez perdu');
            $('#next-level').hide();
            $('#level-start').attr('src','img/replay.png').attr('alt','replay-level').show();
        }
        else{
            $('#playerHP').html(healthPoints);
        }
    }

    function makeDamages(enemyHP,rocketDamages){
        enemyHealthPoints = enemyHP - rocketDamages;
        $('#fillE').css("width",enemyHealthPoints+"%");
        if(enemyHealthPoints <= 50){
        	document.getElementById("boom1").play();
        	$("#fumeeE").fadeIn(200).fadeOut(500);
        	$('#CastleE').css("background","url('./img/ennemi_2.png')");
        }
        if(enemyHealthPoints <= 0){
        	document.getElementById("boom1").play();
        	$('#bouletP img').css('width','30px');
            $('#CastleE').css("background","url('./img/ennemi_3.png')");
            end=true;
            $('#enemyHP').html(0);
            endGame();
            $('#popup').fadeIn('');
            $('#popup p').html('Vous avez gagné');
            $('#level-start').hide();
            if (typeof(levels[actualLevel+1])!=='undefined'){
                $('#next-level').show();
            }
        }
        else{
            $('#enemyHP').html(enemyHealthPoints);
        }
    }

    function endGame(){
        clearInterval(timer);
        for(i=0; i<enemyTimer.length;i++){
            clearInterval(enemyTimer[i]);
        }
        if(typeof(levels[actualLevel]['betweenRockets'])!=='undefined'){
            for(i=0; i<betweenRockets.length;i++){
                clearInterval(betweenRockets[i]);
            }
        }
        word="";
        $('#word').html(word);
        $('#wordField').attr('readonly','readonly').val('');
        $('#boulets').html('');
    }

 });
