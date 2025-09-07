export class CubeElement {
	type: string;
	level: number;
	usable: boolean;

	constructor(type: string) {
		this.type = type;
		this.level = 0;
		this.usable = false;
	}

	setUsable(usable: boolean){
		this.usable = usable;
	}

	isUsable(){
		return this.usable;
	}

	levelUp(){
		this.level += 1;
	}

	getLevel(){
		return this.level;
	}

	setLevel(level: number){
		this.level = level;
	}

	describe() {
		return `${this.type} : level ${this.level}`;
	}
}
