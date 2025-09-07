import { CubeElement } from "./CubeElement";

export class Cube {
  rows: number;
  cols: number;
  center_x: number;
  center_y: number;
  elements = ["wood", "water", "person", "fire"];
  fire_status: number;
  elements_dict: Map<string, CubeElement>;
  cube_map: number[][];

  constructor(row: number, col: number) {
	// console.log("Cube constructed!");
	this.rows = row;
	this.cols = col;
	this.center_x = Math.floor(row / 2);
	this.center_y = Math.floor(col / 2);
	this.elements_dict = new Map([
		["wood", new CubeElement("wood")],
		["water", new CubeElement("water")],
		["person", new CubeElement("person")],
		["fire", new CubeElement("fire")],
	]);
	this.fire_status = 0;
	this.cube_map = Array.from({ length: this.rows }, () =>
		Array(this.cols).fill(0)
	);
  }

  describe(): string[] {
	const res: string[] = [];
	this.elements_dict.forEach((value, key) => {
		res.push(value.describe());
	});
	return res;
  }

  getMap() {
	return this.cube_map;
  }

  clearMap() {
	for(let i=1; i<this.cube_map.length-1; i++){
		for(let j=1; j<this.cube_map[i].length-1; j++){
			if(this.cube_map[i][j] == 4){
				this.cube_map[i][j] = 0;
			}
		}
	}
  }

  resetMap() {
	for (let i = 0; i < this.elements.length; i++) {
		this.elements_dict.get(this.elements[i])!.setLevel(0);
		this.elements_dict.get(this.elements[i])!.setUsable(false);
	}
	this.fire_status = 0;

	for (let i = 0; i < this.rows; i++) {
		for (let j = 0; j < this.cols; j++) {
			this.cube_map[i][j] = 1;
	  	}
	}
  }

  addElement(element_name: string) {
	const ele = this.elements_dict.get(element_name);
	// console.log(ele?.describe());
	if (ele) {
	  	ele.setLevel(1);
		ele.setUsable(true);
	}
	// console.log(this.elements_dict.get(element_name)!.describe());
  }

  getBurnStatus(): number {
	return this.fire_status;
  }
  
  walkResult(){
	if(this.getBurnStatus() == 1){
		// 人去燒草
		this.cube_map[this.center_x][this.center_y] = 4;
		this.burnMap();
	}else if(this.getBurnStatus() == 2){
		// 火滅掉
		this.cube_map[this.center_x][this.center_y] = 6;
	}
  }

  personWalk(dir : number, walk_x: number, walk_y: number){
	// 人走路
	if(this.getBurnStatus() == 0) return;
	
	const cur_state = this.cube_map[walk_x][walk_y]; // 目前位置狀態
	if(cur_state == 9){
		this.cube_map[walk_x][walk_y] = 1;
	}else if(cur_state == 10){
		this.cube_map[walk_x][walk_y] = 2;
	}

	const next_state = this.cube_map[walk_x][walk_y+dir]; // 下一個位置狀態
	if(next_state == 1 || next_state == 5){
		this.cube_map[walk_x][walk_y+dir] = 9;
	}else if(next_state == 2){
		this.cube_map[walk_x][walk_y+dir] = 10;
	}

	return;
  }
  
  checkInteraction(element_1: string, element_2: string) {
	const wood = this.elements_dict.get("wood")!;
	const water = this.elements_dict.get("water")!;
	const person = this.elements_dict.get("person")!;
	const fire = this.elements_dict.get("fire")!;

	if (element_1 == "wood" && element_2 == "water") {
		if( wood.isUsable() && water.isUsable() ){
			if(wood.getLevel() > 2 && water.getLevel() > 2){
				this.updateMap();
			}
			if(person.isUsable()){
				const cur_state = this.cube_map[this.center_x][this.center_y+1];
				if(cur_state == 1){
					this.cube_map[this.center_x][this.center_y+1] = 9;
				}else if(cur_state == 2){
					this.cube_map[this.center_x][this.center_y+1] = 10;
				}
			}
		}
	}else if (element_1 == "person" && element_2 == "fire") {
		let cur_state = this.cube_map[this.center_x][this.center_y];
		this.fire_status = 0;
		if( person.isUsable() && fire.isUsable() ){
			if( cur_state == 2 ){
				this.fire_status = 1;
				fire.setUsable(false);
			}else if(cur_state == 7 || cur_state == 8){
				this.fire_status = 2;
				fire.setUsable(false);
			}else{
				cur_state = this.cube_map[this.center_x][this.center_y+1];
				if (cur_state == 1) {
					this.cube_map[this.center_x][this.center_y+1] = 9;
				} else if (cur_state == 2) {
					this.cube_map[this.center_x][this.center_y+1] = 10;
				}
			}
		}
	}
  }

  updateWood() {
	const wood = this.elements_dict.get("wood")!;
	const water = this.elements_dict.get("water")!;
	if (wood.isUsable()) {
		if(water.isUsable()){
			this.cube_map[this.center_x][this.center_y] = 2;
			wood.levelUp();
		}else{
			this.cube_map[this.center_x][this.center_y] = 7;
		}
	}
  }

  updateWater() {
	const wood = this.elements_dict.get("wood")!;
	const water = this.elements_dict.get("water")!;
	if (water.isUsable()) {
		if(wood.isUsable()){
			this.cube_map[this.center_x][this.center_y] = 2;
			water.levelUp();
		}else{
			this.cube_map[this.center_x][this.center_y] = 8;
		}
	}
  }

  updatePerson() {
	const person = this.elements_dict.get("person")!;
	const fire = this.elements_dict.get("fire")!;
	if (person.isUsable()) {
		const cur_state = this.cube_map[this.center_x][this.center_y+1];

		if(fire.isUsable()){
			person.levelUp();
		}else{
			if (cur_state == 1) {
				this.cube_map[this.center_x][this.center_y+1] = 9;
			} else if (cur_state == 2) {
				this.cube_map[this.center_x][this.center_y+1] = 10;
			}
		}
	}
  }

  updateFire() {
	const wood = this.elements_dict.get("wood")!;
	const water = this.elements_dict.get("water")!;
	const person = this.elements_dict.get("person")!;
	const fire = this.elements_dict.get("fire")!;
	
	if(fire.isUsable()){
		this.cube_map[this.center_x][this.cols - 1] = 5;
		if(person.isUsable()){
			wood.setUsable(false);
			water.setUsable(false);
			fire.levelUp();
		}
	}
  }

  burnMap() {
	const dirs = [-1, 0, 1, 0, -1, -1, 1, 1, -1];

	const visited = Array.from({ length: this.rows }, () =>
	  	Array(this.cols).fill(false)
	);

	const queue: [number, number][] = [];
	queue.push([this.center_x, this.center_y]);

	while (queue.length != 0) {
		const tmp = queue.shift()!;
		const x: number = tmp[0];
		const y: number = tmp[1];
		visited[x][y] = true;

		for (let d = 0; d < 8; d++) {
			const next_x = x + dirs[d];
			const next_y = y + dirs[d + 1];
			if (
			this.cube_map[next_x][next_y] == 2 &&
			visited[next_x][next_y] == false
			) {
				this.cube_map[next_x][next_y] = 4;
				queue.push([next_x, next_y]);
			}
		}
	}
  }

  updateMap() {
	const dirs = [-1, 0, 1, 0, -1, -1, 1, 1, -1];

	const visited = Array.from({ length: this.rows }, () =>
	  	Array(this.cols).fill(false)
	);

	const queue: [number, number][] = [];
	for(let i=0; i<this.rows; i++){
		for(let j=0; j<this.cols; j++){
			if(this.cube_map[i][j] == 2){
				queue.push([i, j]);
				visited[i][j] = true;
			}
		}
	}

	while (queue.length != 0) {
		const tmp = queue.shift()!;
		const x: number = tmp[0];
		const y: number = tmp[1];

		for (let d = 0; d < 8; d++) {
			const next_x = x + dirs[d];
			const next_y = y + dirs[d + 1];

			if(next_x < 1 || next_x >= this.rows - 1 || next_y < 1 || next_y >= this.cols - 1){
				continue;
			}

			if (visited[next_x][next_y] == false) {
				this.cube_map[next_x][next_y] = 2;
			}
		}
	}
  }
}
