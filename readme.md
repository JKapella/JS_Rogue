# JS_rogue

A little Javascript Roguelike built using the  [ROT.js library by Ondrej Zara.](http://ondras.github.io/rot.js/hp/) 

I'm planning for this to be a small-scope project to try out the library, and it might be useful for anyone wanting to take a peek at another implementation of the the ROT.js library.

You can play the work-in-progress [here.](https://jkapella.github.io/JS_Rogue/)

## How to play

* 8 directional movement using QWE-ASD-ZXC (yep, I know it's a bit wierd, but there's too few numpads about now, I'm going to do something better with the controls in the future).
* Bump into enemies to attack (as is tradition).
* Spacebar is the use key, when you reach the stairs down (>) hit space to go to a new (harder) floor.

You're going to die. There isn't any way to heal currently, and the levels get more saturated with low level enemies exponentially, so you'll not last long. 

If you do die and want to play again, refresh the page.

## What's currently in the game?

* Character and character movement
* Procedureally generated 'dungeon' maps
* Character line of sight, both to reveal the map and manage fog-of-war
* Enemies, who will pathfind to attach you when they are activated
* Enemy line of sight (enemies sleep until you get get close enough for them to see you)
* Enemy and player combat (to-hit and damage rolls based on stats and current gear)
* Enemy HP and death
* Player HP and death (with a death screen)
* Console to track player stats
* Console to ouput combat messages
* A number of low level enemies of various difficulties
* An 'encounter calculator' which will select a number of enemy encoutners for each floor

## Roadmap

Coming soon...

## Thanks and other thoughts

Massive thanks to Ondrej Zara for his fantastic and user-friendly library, really cool. 
