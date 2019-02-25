
var consoleText = '%c{#959172}Welcome to the dungeon... \n';

function initialiseConsole() {
        Game.consoleXPositionStart = Game.mapWidth + 1;
        //draw decorative outline
        for (currenty = 0; currenty < Game.screenHeight; currenty++) {
            Game.display.draw(Game.mapWidth, currenty, ' ', '', 'grey')
        }
        for (currentx = Game.mapWidth; currentx < Game.screenWidth; currentx++) {
            Game.display.draw(currentx, (Game.screenHeight/2) - 0.5, ' ', '', 'grey')
        } 
        Game.display.drawText(Game.consoleXPositionStart, 0, "---JSRogue V0.03---");
}

function drawPlayerStats() {
	
    if (Game.player.hp < 10) {
        Game.display.drawText(Game.consoleXPositionStart + 1, 2, "Health:    " + Game.player.hp + "/" + Game.player.hpMax);     
    } else {
        Game.display.drawText(Game.consoleXPositionStart + 1, 2, "Health:   " + Game.player.hp + "/" + Game.player.hpMax);     
    }
    Game.display.drawText(Game.consoleXPositionStart + 1, 3, "Dodge:        " + Game.player.dodge);
    Game.display.drawText(Game.consoleXPositionStart + 1, 4, "Armour:       " + Game.player.armour);
    Game.display.drawText(Game.consoleXPositionStart + 1, 5, "Strength:     " + Game.player.str);
    Game.display.drawText(Game.consoleXPositionStart + 1, 6, "Weapon Skill: " + Game.player.weaponSkill);

    Game.display.drawText(Game.consoleXPositionStart + 1, 9, "Current weapon:");
    Game.display.drawText(Game.consoleXPositionStart + 1, 10, Game.player.weapon.name + ' (' + Game.player.weapon.dice + ')');

}

function updateConsole() {

    for (y = 13; y < Game.screenHeight; y++) {
        for (x = Game.mapWidth + 1; x < Game.screenWidth; x++) {
            Game.display.drawText(x, y, '%c{black}.');
        }
    }
    Game.display.drawText(Game.consoleXPositionStart, 13, consoleText, 18);
}

//COMBAT MESSAGES!

function updatePlayerIsHitText(attackerName, damage, attackerColour) {
    consoleText = 'The %c{' + attackerColour + '}' + attackerName + ' %c{white}strikes you for %c{red}' + damage + ' %c{white}damage!\n' + consoleText;
}

function updateEnemyIsHitText(creatureImAttacking, damage, creatureImAttackingColour) {
    consoleText = 'You hit the %c{' + creatureImAttackingColour + '}' + creatureImAttacking + ' %c{white}for ' + damage + ' damage!\n' + consoleText;
}

function updatePlayerIsMissedText(attackerName, attackerColour) {
    consoleText = 'The %c{' + attackerColour + '}' + attackerName + ' %c{blue}misses%c{white}!\n' + consoleText;
}

function updateEnemyIsMissedText(creatureImAttacking, creatureImAttackingColour) {
    consoleText = 'You %c{blue}miss %c{white}the %c{' + creatureImAttackingColour + '}' + creatureImAttacking + '%c{white}!\n' + consoleText;
}


//DEATH MESSAGE

function displayPlayerDeathMessage(whatYouWereKilledBy) {

    for (x = 6; x < 27; x++) {
        for (y = 9; y < 16; y++) {
            Game.display.draw(x, y, '.','black','black');
        }
    }

    var deathText = 'You have been slain by a ' + whatYouWereKilledBy + '!\n\n Refresh the page to fight again...';

    Game.display.drawText(7, 10, deathText, 20);

}