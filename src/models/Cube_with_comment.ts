import { CubeElement } from "./CubeElement";

// 代表一個遊戲方塊，管理所有元素與地圖狀態
export class Cube {
  rows: number; // 地圖行數
  cols: number; // 地圖列數
  center_x: number; // 地圖中心點 x
  center_y: number; // 地圖中心點 y
  elements = ["wood", "water", "person", "fire"]; // 支援的元素種類
  fire_status: number; // 火的狀態（0: 無火, 1: 燒, 2: 滅）
  elements_dict: Map<string, CubeElement>; // 各元素對應的物件
  cube_map: number[][]; // 地圖狀態矩陣

  constructor(row: number, col: number) {
    // 初始化地圖大小與中心點
    this.rows = row;
    this.cols = col;
    this.center_x = Math.floor(row / 2);
    this.center_y = Math.floor(col / 2);
    // 初始化所有元素
    this.elements_dict = new Map([
        ["wood", new CubeElement("wood")],
        ["water", new CubeElement("water")],
        ["person", new CubeElement("person")],
        ["fire", new CubeElement("fire")],
    ]);
    this.fire_status = 0;
    // 初始化地圖，全部填 0
    this.cube_map = Array.from({ length: this.rows }, () =>
        Array(this.cols).fill(0)
    );
  }

  // 回傳所有元素的描述字串
  describe(): string[] {
    const res: string[] = [];
    this.elements_dict.forEach((value, key) => {
        res.push(value.describe());
    });
    return res;
  }

  // 取得地圖狀態
  getMap() {
    return this.cube_map;
  }

  // 清除地圖上所有燒焦的格子（4 代表燒焦）
  clearMap() {
    for(let i=1; i<this.cube_map.length-1; i++){
        for(let j=1; j<this.cube_map[i].length-1; j++){
            if(this.cube_map[i][j] == 4){
                this.cube_map[i][j] = 0;
            }
        }
    }
  }

  // 重設所有元素狀態與地圖
  resetMap() {
    for (let i = 0; i < this.elements.length; i++) {
        this.elements_dict.get(this.elements[i])!.setLevel(0); // 重設等級
        this.elements_dict.get(this.elements[i])!.setUsable(false); // 設為不可用
    }
    this.fire_status = 0;

    // 地圖全部設為 1（預設地形）
    for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
            this.cube_map[i][j] = 1;
      	}
    }
  }

  // 新增一個元素到地圖（設為可用且等級 1）
  addElement(element_name: string) {
    const ele = this.elements_dict.get(element_name);
    // 這裡 ele 是 reference，直接修改會影響 elements_dict 裡的物件
    if (ele) {
      	ele.setLevel(1);
        ele.setUsable(true);
    }
  }

  // 取得火的狀態
  getBurnStatus(): number {
    return this.fire_status;
  }
  
  // 根據火的狀態決定地圖中心的變化
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

  // 控制人移動，並根據地圖狀態更新格子
  personWalk(dir : number, walk_x: number, walk_y: number){
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
  
  // 處理元素間的互動（如木+水、人+火）
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

  // 以下 updateXXX 皆為根據元素狀態更新地圖與等級
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

  // 廣度優先搜尋，將所有可燒的格子設為燒焦
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

  // 廣度優先搜尋，將所有連通的格子設為 2
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