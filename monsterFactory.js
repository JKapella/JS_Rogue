


function generateTestMonster(room) {

    //DEBUG MONSTER IN EACH ROOM!

        var x = room._x2 + -1;
        var y = room._y2 + -1;

        rat = createRat(x,y);
        updateActorPosition(rat._x,rat._y,rat);
        scheduler.add(rat, true);
}


function initialiseCreature(x,y,creaturename) {

    var creature = null;

    switch (creaturename) {
        case 'wisp':
            creature = createWisp(x,y);
            break;
        case 'rat':
            creature = createRat(x,y);
            break;
        case 'scorpion':
            creature = createScorpion(x,y);
            break;
        case 'giantLouse':
            creature = createGiantLouse(x,y);
            break;
        case 'massquito':
            creature = createMassquito(x,y);
            break;
        case 'goblin':
            creature = createGoblin(x,y);
            break;
        default:
            console.log('Initialise Creature function - creature name dont match nuffin');
    }
    return creature;
}

//CRECHA CREATA

var Creature = function(name, x, y, str, weaponSkill, dodge, armour, weapon, hp, eyesight, glyph, foregroundColour) {
    this.name = name;
    this._x = x;
    this._y = y;
    this.str = str;
    this.weaponSkill = weaponSkill;
    this.hp = hp;
    this.armour = armour;
    this.dodge = dodge;
    this.eyesight = eyesight;
    this.weapon = weapon;
    this.glyph = glyph;
    this.foregroundColour = foregroundColour;
    this.active = false;
}

Creature.prototype._draw = function() {
    Game.display.draw(this._x, this._y, this.glyph, this.foregroundColour);
}
 
//MONSTER FUNCTIONS

Creature.prototype.act = function() {  

    if (this.active) {

        var x = Game.player.getX();
        var y = Game.player.getY();
        var myX = this._x;
        var myY = this._y;
        var myTile = findArrayValueByCoordinates(Game.map, myX + "," + myY);

        //pathfinding callback
        var passableCallback = function(x, y) {

            var currentTile = findArrayValueByCoordinates(Game.map, x + "," + y);
            if (Game.map[currentTile].spaceFree == true) {
                return true;
            } else if (Game.map[currentTile] == Game.map[myTile]) {
                return true;
            } else {
                return false;
            }           
        }
        var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:8});
     
        var path = [];

        var pathCallback = function(x, y) {       
            path.push([x, y]);
        }    
        astar.compute(this._x, this._y, pathCallback);
        path.shift();

        if (path.length == 0) {

        } else if (path.length == 1) {
            attackAtLocation(this,findArrayValueByCoordinates(Game.map, x + "," + y));
        } else {
            var nextx = path[0][0];
            var nexty = path[0][1];
            move(nextx,nexty,this); 
        }
    } else {
        monsterLineOfSight(this._x,this._y,this.eyesight,this);
    }
}

function monsterLineOfSight(actorX,actorY,visionRadius,actor) {
    
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
        
    fov.compute(actorX, actorY, visionRadius, function(x, y, r, visibility) {
    
        key = findArrayValueByCoordinates(Game.map,x + ',' + y);

        if (Game.map[key].actorPresent == Game.player) {
            actor.active = true;
        }     
    });      
}

 //MONSTER TYPES

function createWisp(x,y) {
    return new Creature(
        'Wisp',
        x,
        y,
        0, //strength
        1, //weapon skill
        4, //dodge
        0, //armour
        {name: 'Burn', weaponSkillMod: 0, dice: '1d2', penetration: 0},
        1, //hp
        6, //eyesight
        'w',
        '#6d9eeb',
    );
}

function createRat(x,y) {
    return new Creature(
        'Rat',
        x,
        y,
        0, //strength
        0, //weapon skill
        3, //dodge
        0, //armour
        {name: 'Bite', weaponSkillMod: 0, dice: '1d2', penetration: 0},
        3, //hp
        6, //eyesight
        'r',
        '#663300',
    );
}

function createScorpion(x,y) {
    return new Creature(
        'Scorpion',
        x,
        y,
        0, //strength
        2, //weapon skill
        4, //dodge
        0, //armour
        {name: 'Sting', weaponSkillMod: 0, dice: '1d2', penetration: 0},
        3, //hp
        6, //eyesight
        's',
        '#e69138',
    );
}

function createGiantLouse(x,y) {
    return new Creature(
        'Giant Louse',
        x,
        y,
        0, //strength
        0, //weapon skill
        2, //dodge
        1, //armour
        {name: 'Mandible', weaponSkillMod: 0, dice: '1d2', penetration: 0},
        3, //hp
        6, //eyesight
        'l',
        '#b4a7d6',
    );
}

function createMassquito(x,y) {
    return new Creature(
        'Massquito',
        x,
        y,
        1, //strength
        0, //weapon skill
        3, //dodge
        0, //armour
        {name: 'Needle', weaponSkillMod: 0, dice: '1d3', penetration: 0},
        2, //hp
        6, //eyesight
        'm',
        '#ffd966',
    );
}

function createGoblin(x,y) {
	return new Creature(
        'Goblin',
        x,
        y,
        0, //strength
        0, //weapon skill
        3, //dodge
        1, //armour
        {name: 'Bite', weaponSkillMod: 0, dice: '1d2', penetration: 0},
        3, //hp
        6, //eyesight
        'g',
        '#6aa84f',
    );
}

