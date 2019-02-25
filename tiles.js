

function createWallTile(x,y) {
	
	var tileset = pickTileColour(1, 2, 3);

	var pickedSetVisible = null;
	var pickedSetNotVisible = null;

	if (tileset == 1) {
		pickedSetVisible = '#282828';
		pickedSetNotVisible = '#161616';
	} else if (tileset == 2) {
		pickedSetVisible = '#383322';
		pickedSetNotVisible = '#262216';
	} else {
		pickedSetVisible = '#383838';
		pickedSetNotVisible = '#262626';
	}
	
	Game.map.push({
		name: x + "," + y,
		type: 'Wall',
		glyph: '#',
		spaceFree: false,
		actorPresent: null,
		objectsPresent: [],
		x: x,
		y: y,
		foregroundColourVisible: '#000000',
		foregroundColourNotVisible: '#000000',
		backgroundColourVisible: pickedSetVisible,
		backgroundColourNotVisible: pickedSetNotVisible,
	});
}

function createFloorTile(x,y) {
	
	var tileset = pickTileColour(1, 2, 3);

	var pickedSetVisible = null;
	var pickedSetNotVisible = null;

	if (tileset == 1) {
		pickedSetVisible = '#282828';
		pickedSetNotVisible = '#161616';
	} else if (tileset == 2) {
		pickedSetVisible = '#383322';
		pickedSetNotVisible = '#262216';
	} else {
		pickedSetVisible = '#383838';
		pickedSetNotVisible = '#262626';
	}
	
	Game.map.push({
		name: x + "," + y,
		type: 'Floor',
		glyph: '.',
		spaceFree: true,
		actorPresent: null,
		objectsPresent: [],
		x: x,
		y: y,
		foregroundColourVisible: pickedSetVisible,
		foregroundColourNotVisible: pickedSetNotVisible,
		backgroundColourVisible: '#000000',
		backgroundColourNotVisible: '#000000',
	});	
}

function createStairsDownTile(x,y) {

	targetTile = findArrayValueByCoordinates(Game.map,x + "," + y); 

	Object.assign(Game.map[targetTile], {
		name: x + "," + y,
		type: 'Stairs Down',
		glyph: '>',
		foregroundColourVisible: '#959172',
		foregroundColourNotVisible: '#44412b',
		backgroundColourVisible: '#000000',
		backgroundColourNotVisible: '#000000',
	})
}

function createStairsUpTile(x,y) {

	targetTile = findArrayValueByCoordinates(Game.map,x + "," + y); 

	Object.assign(Game.map[targetTile], {
		name: x + "," + y,
		type: 'Stairs Up',
		glyph: '<',
		foregroundColourVisible: '#959172',
		foregroundColourNotVisible: '#44412b',
		backgroundColourVisible: '#000000',
		backgroundColourNotVisible: '#000000',
	})
}

function pickTileColour(colour1, colour2, colour3) {
	
	var colourPicked = Math.floor(ROT.RNG.getUniform() * 6) + 1;
	
	switch (colourPicked) {		
		case 5:
			return colour2;
			break;
		case 6:
			return colour3;
			break;
		default:
			return colour1;
	}
}