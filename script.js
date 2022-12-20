let width, height;
let player, world, entities;
let font;
const keys = {};

class Room {
	static WIDTH = 600;
	static HEIGHT = 600;
	static OFFSET = 40;
	static GAIN = 0.1;
	static rooms = [];

	constructor(image, x, y) {
		this.image = image;
		this.x = Room.OFFSET / 2 + x * (Room.WIDTH + Room.OFFSET);
		this.y = Room.OFFSET / 2 + y * (Room.HEIGHT + Room.OFFSET);
		this.targetOpacity = 210;
		this.opacity = 210;
	}

	inside() {
		const { x, y } = player;
		const inside = x >= this.x && x <= this.x + Room.WIDTH &&
					 				 y >= this.y && y <= this.y + Room.HEIGHT;
		return inside;
	}

	center() {
		return { x: this.x + Room.WIDTH / 2, y: this.x + Room.HEIGHT / 2 };
	}

	draw() {
		const x = this.x - world.x + width / 2;
		const y = this.y - world.y + height / 2;
		const w = Room.WIDTH;
		const h = Room.HEIGHT;
		image(this.image, x, y, w, h);
	}

	shadow() {
		const x = this.x - world.x + width / 2;
		const y = this.y - world.y + height / 2;
		const w = Room.WIDTH;
		const h = Room.HEIGHT;
		fill(0, 0, 0, this.opacity);
		rect(x, y, w, h);
	}

	update() {
		this.opacity += (this.targetOpacity - this.opacity) * Room.GAIN;
	}

	static load() {
		const COLUMNS = 2;
		const images = [
			loadImage("rooms/room1.png"),
			loadImage("rooms/room2.png"),
			loadImage("rooms/room3.png"),
			loadImage("rooms/room4.png"),
			loadImage("rooms/room5.png"),
			loadImage("rooms/room6.png"),
			loadImage("rooms/room7.png"),
		];
		for (let i = 0; i < images.length; i++) {
			const x = i % COLUMNS, y = Math.floor(i / COLUMNS);
			Room.rooms.push(new Room(images[i], x, y));
		}
	}

	static draw() {
		Room.rooms.forEach(room => room.draw());
	}

	static shadow() {
		Room.rooms.forEach(room => room.shadow());
	}

	static update() {
		Room.rooms.forEach(room => {
			if (!room.inside()) return;
			room.targetOpacity = 0;
		});
		Room.rooms.forEach(room => room.update());
	}
}

class Entity {
	static THRESHOLD = 50;
	static entities = [];
	
	constructor(image, x, y, w, h, event = () => {}) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.event = event;
		this.interaction = null;
	}

	shadow() {
		const x = this.x - world.x + width / 2;
		const y = this.y - world.y + height / 2;
		const w = this.w;
		const h = this.h;
		fill(0, 0, 0, 40);
		ellipse(x + w / 2, y + h, w * 1.6, 20);
	}

	draw() {
		const x = this.x - world.x + width / 2;
		const y = this.y - world.y + height / 2;
		const w = this.w;
		const h = this.h;
		image(this.image, x, y, w, h);
	}

	distance() {
		const { x: ax, y: ay } = this.center();
		const { x: bx, y: by } = player.center();
		return Math.hypot(ax - bx, ay - by);
	}

	center() {
		return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
	}

	static interact() {
		Entity.entities.forEach(entity => {
			if (player.interaction != null) return;
			if (entity.distance() > Entity.THRESHOLD) return;
			player.interaction = entity.event();
		})
	}
	static load() {
		Entity.entities = [
			// Georgiana
			new Entity(loadImage("entities/georginia.png"), 180, 230, 40, 80),
			// Eliza
			new Entity(loadImage("entities/eliza.png"), 235, 230, 40, 80),
			// Mrs. Reed
			new Entity(loadImage("entities/mrsreed.png"), 220, 400, 40, 80, () => new Dialogue([
				{ source: Entity.entities[2], dialogue: "Mrs. Reed: Go to your room!" },
			])),
			// John
			new Entity(loadImage("entities/johnreed.png"), 380, 305, 40, 80, () => new Dialogue([
				{ source: Entity.entities[3], dialogue: "John Reed: You have no business to take our books;" },
				{ source: Entity.entities[3], dialogue: "John Reed: you are a dependent, mama says;" },
				{ source: Entity.entities[3], dialogue: "John Reed: you have no money; your father left you none;" },
				{ source: Entity.entities[3], dialogue: "John Reed: you ought to beg, and not to live here with gentlemen’s children like us, and ear the same meals we do, and wear clothes at our mama’s expense." },
			])),
			// Helen
			new Entity(loadImage("entities/helen.png"), 955, 240, 40, 80, () => new Dialogue([
				{ source: Entity.entities[4], dialogue: "Helen: It is far better to endure patiently a smart which nobody feels but yourself, than to commit a hasty action whose evil consequences will extend to all connected with you;" },
				{ source: Entity.entities[4], dialogue: "Helen: and besides, the Bible bids us return good for evil." },
			])),
			// Ms. Temple
			new Entity(loadImage("entities/mstemple.png"), 830, 365, 40, 80, () => new Dialogue([
				{ source: Entity.entities[5], dialogue: "Ms. Temple: You had this morning a breakfast which you could not eat; you must be hungry: – I have ordered that a lunch of bread and cheese shall be served to all." },
			])),
			// Mr. Brocklehurst
			new Entity(loadImage("entities/brocklehurst.png"), 1060, 430, 40, 80, () => new Dialogue([
				{ source: Entity.entities[6], dialogue: "Mr. Brocklehurst: My dear children," },
				{ source: Entity.entities[6], dialogue: "Mr. Brocklehurst: this is a sad, a melancholy occasion; for it becomes my duty to warn you that this girl, who might be one of God’s own lambs, is a little castaway:" },
				{ source: Entity.entities[6], dialogue: "Mr. Brocklehurst: not a member of the true flock, but evidently an interloper and an alien." },
				{ source: Entity.entities[6], dialogue: "Mr. Brocklehurst: You must be on your guard against her; you must shun her example; if necessary, avoid her company, exclude her from your sports, and shut her from your converse." },
				{ source: Entity.entities[6], dialogue: "Mr. Brocklehurst: Teachers, you must watch her; keep your eyes on her movements, weigh well her words, scrutinise her actions, punish her body to save the soul;" },
				{ source: Entity.entities[6], dialogue: "Mr. Brocklehurst: if, indeed, such salvation be possible, for…this girl is – a liar!" },
			])),
			// Rochester
			new Entity(loadImage("entities/rochester.png"), 270, 910, 40, 80),
			// Blanche
			new Entity(loadImage("entities/blanche.png"), 450, 985, 40, 80, () => new Dialogue([
				{ source: Entity.entities[8], dialogue: "Blanche Ingram: Why, I suppose you have a governess for her: I saw a person with her just now – is she gone?" },
				{ source: Entity.entities[8], dialogue: "Blanche Ingram: Oh, no! there she is still behind the window-curtain." },
				{ source: Entity.entities[8], dialogue: "Blanche Ingram: You pay her, of course: I should think it quite as expensive, – more so; for you have them both to keep in addition…" },
				{ source: Entity.entities[8], dialogue: "Blanche Ingram: You should hear mama on the chapter of governesses: Mary and I have had, I should think, a dozen at least in our day;" },
				{ source: Entity.entities[8], dialogue: "Blanche Ingram: half of them detestable and the rest ridiculous, and all incubi – were they not, mama?" },
			])),
			// Mr. Briggs
			new Entity(loadImage("entities/briggs.png"), 755, 930, 40, 80, () => new Dialogue([
				{ source: Entity.entities[9], dialogue: "Mr. Briggs: STOP. this wedding at once. For you are already wedded to another woman!" },
			])),
			// Rochester
			new Entity(loadImage("entities/rochester.png"), 310, 1695, 40, 80, () => new Dialogue([
				{ source: Entity.entities[10], dialogue: "Rochester: That is my wife," },
				{ source: Entity.entities[10], dialogue: "Rochester: Such is the sole conjugal embrace I am ever to know – such are the endearments which are to solace my leisure hours!" },
				{ source: Entity.entities[10], dialogue: "Rochester: And this is what I wished to have" },
				{ source: Entity.entities[10], dialogue: "Rochester: this young girl, who stands so grave and quiet at the mouth of hell, looking collectedly at the gambols of a demon." },
				{ source: Entity.entities[10], dialogue: "Rochester: I wanted her just as a change after that fierce ragout. Wood and Briggs, look at the difference! Compare these clear eyes with the red balls yonder – this face with that mask – this form with that bulk;" },
				{ source: Entity.entities[10], dialogue: "Rochester: then judge me, priest of the Gospel and man of the law, and remember, with what judgment ye judge ye shall be judged!" },
			])),
			// St. John
			new Entity(loadImage("entities/stjohn.png"), 985, 820, 40, 80, () => new Dialogue([
				{ source: Entity.entities[11], dialogue: "St. John: God and nature intended you for a missionary’s wife." },
				{ source: Entity.entities[11], dialogue: "St. John: It is not personal but mental endowments they have given you; you are formed for labor, not love." },
				{ source: Entity.entities[11], dialogue: "St. John: A missionary’s wife you must—shall be." },
				{ source: Entity.entities[11], dialogue: "St. John: You shall be mine; I claim you—not for my pleasure, but for my Sovereign’s service." },
			])),
			// Mary
			new Entity(loadImage("entities/mary.png"), 190, 1610, 40, 80),
			// Diana
			new Entity(loadImage("entities/diana.png"), 240, 1610, 40, 80),
			// Rochester
			new Entity(loadImage("entities/rochester.png"), 880, 1675, 40, 80, () => new Dialogue([
				{ source: Entity.entities[14], dialogue: "Rochester: I know what it is to" },
				{ source: Entity.entities[14], dialogue: "Rochester: live entirely for and with what I love best on earth." },
			])),
		];
	}

	static shadow() {
		Entity.entities.forEach(entity => entity.shadow());
	}

	static draw() {
		Entity.entities.forEach(entity => entity.draw());
	}
}

class Dialogue {
	static WIDTH = 500;
	static HEIGHT = 130;
	static OFFSET = 50;
	static THICKNESS = 3;
	static MARGIN = 10;
	
	constructor(script) {
		world.follow = this;
		this.script = script;
		this.index = 0;
		this.visibleDialogue = "";
		this.dialogue = script[0].dialogue;
	}

	center() {
		return this.script[this.index].source.center();
	}

	draw() {
		const { x, y } = this.center();
		const ox = width / 2 - Dialogue.WIDTH / 2;
		const oy = height - Dialogue.HEIGHT - Dialogue.OFFSET;
		const ow = Dialogue.WIDTH;
		const oh = Dialogue.HEIGHT;
		const ix = ox + Dialogue.THICKNESS;
		const iy = oy + Dialogue.THICKNESS;
		const iw = ow - Dialogue.THICKNESS * 2;
		const ih = oh - Dialogue.THICKNESS * 2;
		const tx = ix + Dialogue.MARGIN;
		const ty = iy + Dialogue.MARGIN - 5;
		const tw = iw - Dialogue.MARGIN * 2;
		const th = ih - Dialogue.MARGIN * 2;
		fill(255, 255, 255);
		rect(ox, oy, ow, oh);
		fill(0, 0, 0);
		rect(ix, iy, iw, ih);
		fill(255, 255, 255);
		text(this.visibleDialogue, tx, ty, tw, th);
	}

	interact() {
		this.index++;
		if (this.index >= this.script.length) {
			world.follow = world.player;
			player.interaction = null;
			return;
		}
		this.visibleDialogue = "";
		this.dialogue = this.script[this.index].dialogue;
	}

	update() {
		if (this.visibleDialogue.length >= this.dialogue.length) return;
		this.visibleDialogue += this.dialogue[this.visibleDialogue.length];
	}
}

class World {
	static GAIN = 0.1;
	
	constructor(player) {
		this.player = player;
		this.follow = player;
		this.x = player.x;
		this.y = player.y;
	}

	update() {
		const { x, y } = this.follow.center();
		this.x += (x - this.x) * World.GAIN;
		this.y += (y - this.y) * World.GAIN;
	}
}

addEventListener("keydown", e => {
	if (e.isComposing || e.keyCode == 229) return;
	keys[e.key] = e.repeat ? 2 : 1;
	if (e.key == "e" && !e.repeat) {
		if (player.interaction == null) Entity.interact();
		else player.interaction.interact();
	}
});
addEventListener("keyup", e => {
	if (e.isComposing || e.keyCode == 229) return;
	keys[e.key] = 0;
});

function preload() {
	font = loadFont("fonts/pixel1.otf");
	player = new Entity(loadImage("entities/jane.png"), 295, 335, 40, 80);
	world = new World(player);
	Room.load();
	Entity.load();
}

function setup() {
	width = windowWidth;
	height = windowHeight;
  createCanvas(width, height);
	textFont(font);
	textSize(15);
	noStroke();
}

function draw() {
	background(0, 0, 0);
	Room.draw();
	Entity.shadow();
	player.shadow();
	Entity.draw();
	Room.shadow();
	player.draw();
	
	if (player.interaction == null) {
		if (keys["w"]) player.y -= 5;
		if (keys["s"]) player.y += 5;
		if (keys["a"]) player.x -= 5;
		if (keys["d"]) player.x += 5;
	} else {
		player.interaction.draw();
		player.interaction.update();
	}
	
	Room.update();
	world.update();

	fill(255);
	text(player.x + " " + player.y, 10, 10);
}