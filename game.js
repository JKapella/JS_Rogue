//TODO - currently the LOS stuff works of spacefree, not off anythign to do with Line of
//sight - 

var Game = {
    display: null,
    map: [],
    player: null,
    engine: null,
    scheduler: null, 
    digger: null,
    revealedMap: [],
    stairsUpTileLocation: null,

    //game settings
    screenWidth:54,
    screenHeight: 25,
    glyphSize: 25,  //usually 32
    mapHeight: 25,
    mapWidth: 34,

    //console settigs
    consoleXPositionStart: null, 

    //stats for player - put these somewhere else later!
    playerHp: 20,
    playerStr: 1,
	playerEyesight: 5,
    playerWeaponSkill: 0,
    playerDodge: 3,
    playerArmour: 1,

    //Game and level settings 

    dangerLevel: 12, //danger level is currently the amount of HP on average it's acceptable for a player to lose per level
    hpGain: 5, //i.e currently ONE FIFTH OF HP IS REGAINED!!!
    dungeonLevel: 1,

    init: function() {
        this.display = new ROT.Display();
        this.display.setOptions({
        width: this.screenWidth,
        height: this.screenHeight,
        fontSize: this.glyphSize,
        forceSquareRatio: true,
        });

        initialiseConsole();

        var list = document.getElementsByTagName("main");
        list[0].appendChild(this.display.getContainer());
        this._generateMap();

        this.player = this._createPlayer();
        updateActorPosition(this.player._x,this.player._y,this.player); 
        checkLineOfSight(this.player._x,this.player._y,this.player.eyeSight); 

        updateConsole();

        scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);

        generateEncounters();
        
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    },

    _generateMap: function() {
        this.digger = new ROT.Map.Digger(this.mapWidth,this.mapHeight, {dugPercentage: 0.4, roomWidth:[3,10], roomHeight:[3,6]});

        var digCallback = function(x,y,value) {         
            if (value) { //if it's a wall
                createWallTile(x,y);
            } else { //if it's free space
                createFloorTile(x,y);
            }           
        }

        this.digger.create(digCallback.bind(this));

        //Create map furniture
        this._generateStairsDown();
        this._generateStairsUp();
		
    },

    _createPlayer: function() {
        //find room number 1 - and get the 
        var x = this.digger._rooms[0]._x1 + 1
        var y = this.digger._rooms[0]._y1 + 1
        //put the player in one
        return new Player(x,y);
    },


    //TODO - make stair positioning more interesting!

    _generateStairsDown: function() {
        //find room to put stairs down in! - lets make it the LAST ROOM for now
        var exitRoom = this.digger._rooms[this.digger._rooms.length - 1];
       
        //make this more interesting so it's a random position in the room! 
        var x = exitRoom._x1 + 1
        var y = exitRoom._y1 + 1

        createStairsDownTile(x,y);
    },

    _generateStairsUp: function() {

        //This will be under the player
        var x = this.digger._rooms[0]._x1 + 1
        var y = this.digger._rooms[0]._y1 + 1

        this.stairsUpTileLocation = findArrayValueByCoordinates(Game.map, x + ',' + y);

        createStairsUpTile(x,y);
    },

    _downOneFloor: function() {
        //clear the old map
        for (x = 0; x < this.mapWidth; x++) {
            for (y = 0; y < this.mapHeight; y++) {
                this.display.draw(x, y, '.', 'black','black');
            }
        }
        this.map = [];
        this.digger = null;
        this.revealedMap = [];
        scheduler.clear();
        
        this._generateMap();

        scheduler.add(this.player, true);

        this.player._x = this.map[this.stairsUpTileLocation].x;
        this.player._y = this.map[this.stairsUpTileLocation].y;

        updateActorPosition(this.player._x,this.player._y,this.player); 
        checkLineOfSight(this.player._x,this.player._y,this.player.eyeSight); 

        this.dungeonLevel += 1;
        this.dangerLevel += this.dungeonLevel;
        generateEncounters();

        console.log(this.dungeonLevel);
        console.log(this.dangerLevel);

        //DEBUG - PLAYER GETS BACK 20% health
        this.player.hp += Math.round(this.player.hpMax/this.hpGain);
        if (this.player.hp > this.player.hpMax) {
            this.player.hp = this.player.hpMax;
        }
    },

}

//PLAYER FUNCTIONS

var Player = function(x, y) {
    this.name = 'Hero';
    this._x = x;
    this._y = y;
    this.hp = Game.playerHp;
    this.hpMax = Game.playerHp;
    this.armour = Game.playerArmour;
    this.str = Game.playerStr;
    this.weaponSkill = Game.playerWeaponSkill;
    this.dodge = Game.playerDodge;
    this.weapon = {name: 'Rusty Sword', weaponSkillMod: 0, dice: '1d2', penetration: 0}
	this.eyeSight = Game.playerEyesight;
    this._draw();
}

Player.prototype.getX = function() { return this._x; }
Player.prototype.getY = function() { return this._y; }

Player.prototype.act = function() {
    drawPlayerStats();
    Game.engine.lock();
    window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {

    var keyPressed = e.keyCode;

    if (keyPressed == 83) { //WAIT ONE TURN!
    } else if (keyPressed == 190) { //DEBUG - Currently '.' to go down one floor

            Game._downOneFloor();

    } else if (keyPressed == 13 || keyPressed == 32) { //THE ACTION KEY!

        console.log(this._x);
        if (Game.map[findArrayValueByCoordinates(Game.map,this._x + ',' + this._y)].type == 'Stairs Down') {
            Game._downOneFloor();
        }

    } else {

        var keyMap = {};
        keyMap[87] = 0;
        keyMap[69] = 1;
        keyMap[68] = 2;
        keyMap[67] = 3;
        keyMap[88] = 4;
        keyMap[90] = 5;
        keyMap[65] = 6;
        keyMap[81] = 7;

        if (!(keyPressed in keyMap)) { return; }
     
        var diff = ROT.DIRS[8][keyMap[keyPressed]];
        var newX = this._x + diff[0];
        var newY = this._y + diff[1];

        //check if new space is valid
        var destinationCoordinate = newX + "," + newY;
        var newCoordinateValue = findArrayValueByCoordinates(Game.map,destinationCoordinate);

        if (Game.map[newCoordinateValue].spaceFree == false) {
            if (Game.map[newCoordinateValue].actorPresent !== null) {
                attackAtLocation(this,newCoordinateValue);
            } else {
                return;  
            }
        } else {
            move(newX,newY,this);
        }

    }       
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
}

Player.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "@", "white");
}

function findArrayValueByCoordinates (arrayToCheck,destinationCoordinate) {

    for(var arrayNumber = 0; arrayNumber < arrayToCheck.length; arrayNumber += 1) {
        if(arrayToCheck[arrayNumber].name === destinationCoordinate) {
            return arrayNumber;
        }
    } 
    console.log("Function findArrayValueByCoordinates, can't find that in the array");
}

function attackAtLocation(attacker,placeAttacking) {

    var creatureImAttacking = Game.map[placeAttacking].actorPresent;

    if (rollToHit(attacker,creatureImAttacking)) {

        var damage = calculateDamage(attacker,creatureImAttacking);
        creatureImAttacking.hp -= damage;

        if (creatureImAttacking == Game.player) {
            updatePlayerIsHitText(attacker.name, damage, attacker.foregroundColour);
        } else {
            updateEnemyIsHitText(creatureImAttacking.name, damage, creatureImAttacking.foregroundColour);
        } 
    } else {
        if (creatureImAttacking == Game.player) {
            updatePlayerIsMissedText(attacker.name, attacker.foregroundColour);
        } else {
            updateEnemyIsMissedText(creatureImAttacking.name, creatureImAttacking.foregroundColour);
        } 
    }

    updateConsole();
    drawPlayerStats();

    if (creatureImAttacking.hp < 1 && creatureImAttacking == Game.player) {
        Game.playerHp = 0;
        drawPlayerStats();
        scheduler.clear();
        displayPlayerDeathMessage(attacker.name);
    } else if (creatureImAttacking.hp < 1) {
        kill(creatureImAttacking);
    }
}

function rollToHit(attacker,target) {
    if (rollDice('1d10') + attacker.weaponSkill + attacker.weapon.weaponSkillMod > target.dodge) {
        return true;
    } else {
        return false;
    }
}

function calculateDamage(attacker, enemy) {

    var damage = (attacker.str + rollDice(attacker.weapon.dice)) - (enemy.armour - attacker.weapon.penetration);

    return damage;
}

function rollDice(dice) {
    switch(dice) {
        case '1d2':
                var diceRoll =  Math.floor(ROT.RNG.getUniform() * 2) + 1;
            break;
        case '1d3':
                var diceRoll =  Math.floor(ROT.RNG.getUniform() * 3) + 1;
            break;
        case '1d4':
                var diceRoll =  Math.floor(ROT.RNG.getUniform() * 4) + 1;
            break;
        case '1d6':
                var diceRoll =  Math.floor(ROT.RNG.getUniform() * 6) + 1;
            break;
        case '1d8':
                var diceRoll =  Math.floor(ROT.RNG.getUniform() * 8) + 1;
            break;
        case '1d10':
                var diceRoll =  Math.floor(ROT.RNG.getUniform() * 10) + 1;
            break;
        default:
                1;    
    }
    return diceRoll;
}

function kill(creature) {

    var tileToUpdate = findArrayValueByCoordinates(Game.map,creature._x + ',' + creature._y);

    Object.assign(Game.map[tileToUpdate], { 
        foregroundColourVisible: '#b80000',
        foregroundColourNotVisible: '#6b0000',
        spaceFree: true,
        actorPresent: null,
    })   

    scheduler.remove(creature);

    consoleText = 'The %c{' + creature.foregroundColour + '}' + creature.name + ' %c{red}dies!%c{white}\n' + consoleText;
    updateConsole();

    checkLineOfSight(Game.player._x,Game.player._y,Game.player.eyeSight);
}

function move(targetx, targety, creatureMoving) {
    
        var oldCoordinateValue = findArrayValueByCoordinates(Game.map,creatureMoving._x + "," + creatureMoving._y);

        Object.assign(Game.map[oldCoordinateValue], { 
            spaceFree: true,
            actorPresent: null,
        })

        creatureMoving._x = targetx;
        creatureMoving._y = targety;
        
        updateActorPosition(targetx, targety, creatureMoving);

        checkLineOfSight(Game.player._x,Game.player._y,Game.player.eyeSight);
}

function updateActorPosition(x,y,actor) {
    var positionToUpdate = findArrayValueByCoordinates(Game.map,x +","+ y);

    Object.assign(Game.map[positionToUpdate], {
        spaceFree: false,
        actorPresent: actor,
    }); 
}

function checkLineOfSight(actorX,actorY,visionRadius) {
	
	var myTile = findArrayValueByCoordinates(Game.map, actorX + "," + actorY);
	
	function lightPasses(x, y) {

       if (x < 0 || x > Game.mapWidth - 1 || y < 0 || y > Game.mapHeight - 1) {
        return false;
       }

	   var currentTile = findArrayValueByCoordinates(Game.map, x + "," + y);

	   if (Game.map[currentTile].spaceFree == true) {
	       return true;
	   } else if (Game.map[currentTile] == Game.map[myTile]) {
	       return true;
	   }  			
	}	
			
	var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);

    var seenThisTurn = [];
		
	fov.compute(actorX, actorY, visionRadius, function(x, y, r, visibility) {
	
        key = findArrayValueByCoordinates(Game.map,x + ',' + y);

        if (Game.revealedMap.indexOf(key) === -1 ) {

        Game.revealedMap.push(key)

        }

        seenThisTurn.push(key);
	});

    drawRevealedMap();
    drawVisibleMap(seenThisTurn);	 
}

function drawRevealedMap() {

    for (arrayItem = 0; arrayItem < Game.revealedMap.length; arrayItem++) {

        var revealedTile = Game.revealedMap[arrayItem];

        var x = Game.map[revealedTile].x;
        var y = Game.map[revealedTile].y;

        Game.display.draw(x, y, Game.map[revealedTile].glyph,Game.map[revealedTile].foregroundColourNotVisible,Game.map[revealedTile].backgroundColourNotVisible);
    }
}

function drawVisibleMap(array) {

    for (arrayItem = 0; arrayItem < array.length; arrayItem++) {

        var visibleTile = array[arrayItem];

        var x = Game.map[visibleTile].x;
        var y = Game.map[visibleTile].y;

        if (Game.map[visibleTile].actorPresent !== null) {
            Game.map[visibleTile].actorPresent._draw();
        } else {
            Game.display.draw(x, y, Game.map[visibleTile].glyph,Game.map[visibleTile].foregroundColourVisible,Game.map[visibleTile].backgroundColourVisible);
        }

    }
}

//ENCOUNTER GENERATOR

function generateEncounters() {

    var dangerLevelToDistrubute = Game.dangerLevel; //this should adjust by player strength and position in the game

    //select encounters up to danger level

    var encounters = [];

    while (dangerLevelToDistrubute > 0) {

        var currentRoll =  Math.floor(ROT.RNG.getUniform() * (possibleEncounters.length));

        if ((dangerLevelToDistrubute - possibleEncounters[currentRoll].cr) >= 0) {
            encounters.push(possibleEncounters[currentRoll]);
            dangerLevelToDistrubute -= possibleEncounters[currentRoll].cr;
        }
    }

    console.log(encounters);

    //deliver enocounters to rooms in the dunge and add them to the scheduler

    var rooms = Game.digger._rooms.length;

    for (encounter in encounters) {

        var targetRoom = Game.digger._rooms[Math.floor(ROT.RNG.getUniform() * (rooms - 1) + 1)];
        
        var encounterPlaced = false;

        while (encounterPlaced == false) {

            var x = targetRoom._x1 + (Math.floor(ROT.RNG.getUniform() * (targetRoom._x2 - targetRoom._x1)));
            var y = targetRoom._y1 + (Math.floor(ROT.RNG.getUniform() * (targetRoom._y2 - targetRoom._y1)));

            var position = findArrayValueByCoordinates(x + ',' + y);                  

            if (!Game.map[position].spaceFree) {

                creature = initialiseCreature(x,y,encounters[encounter].name);

                updateActorPosition(creature._x,creature._y,creature);
                scheduler.add(creature, true);
                encounterPlaced = true;
            }
        }
    }
}


//List of encounters

var possibleEncounters = [
    {name: 'wisp', cr: 0.5},
    {name: 'rat', cr: 1},
    {name: 'scorpion', cr: 1.5},
    {name: 'giantLouse', cr: 2.5},
    {name: 'massquito', cr: 2.5},
    {name: 'goblin', cr: 3},
];
