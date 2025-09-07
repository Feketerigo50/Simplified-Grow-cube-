import "./styles.css";
import { useState, useEffect, useRef } from "react";

import { Cube } from "./models/Cube";

export default function App() {
	return (
		<div className="App">
			<h1>Hello</h1>
			<h2>Start editing to see some magic happen!</h2>
		</div>
	);
}

export function CubeGrow() {
	const cube = useRef<Cube>(new Cube(7,7)).current;
	const [busy, setBusy] = useState(false);
	const [ifGameOver, setGameOver] = useState(false);
	const [anime_step, setAnimeStep] = useState(0);
	const [cube_map, setMap] = useState<number[][]>([]);
	const [cube_element, setElement] = useState<Set<string>>(new Set());
	const [cube_display, setDisplay] = useState("");
	const [cube_display2, setDisplay2] = useState("");

	useEffect(() => { // 初始化頁面
		cube.resetMap();
		setMap(cube.getMap().map(row => [...row]));
	}, []);

	const addElement = (newItem: string) => {
		setTimeout(() => setBusy(true),  1);
		if(cube_element.has(newItem)){
			setTimeout(() => setBusy(false),  1);
			return;
		}

		cube.addElement(newItem);
		setElement((cube_element) => new Set(cube_element).add(newItem));
	};

	function showMap(){
		let tmp = "";
		for(let i=0; i<cube_map.length; i++){
			tmp = i + ": ";
			for(let j=0; j<cube_map[i].length; j++){
				tmp += cube_map[i][j] + " ";
			}
			console.log(tmp);
		}
	}

	function resetElement() {
		setElement(new Set());
		cube.resetMap();
		showMap();
	}

	function checkGameOver(start_time : number) {
		let game_over = cube_element.size == 4;
		if(game_over){
			setGameOver(true);
			setTimeout(() => showBackground(),  start_time*500);
		}else{
			setGameOver(false);
			setTimeout(() => setBusy(false),  start_time*500);
		}
	}

	function showBackground(){
		cube.clearMap();
		setMap(cube.getMap().map(row => [...row]));
	}

	function updateState() {
		[1,2,3,4,5,6].forEach((s, idx) => {
			setTimeout(() => setAnimeStep(s), idx * 500); 
		});
	}

	function manGetFire(){
		[7,8,9,10,11,12].forEach((s, idx) => {
			setTimeout(() => setAnimeStep(s), (idx+7) * 500); 
		});
	}

	useEffect(() => {
		console.log("anime step: ", anime_step);
		if (anime_step === 0) return;

		if (anime_step === 1) cube.updateWood();
		if (anime_step === 2) cube.updateWater();
		if (anime_step === 3) cube.checkInteraction("wood", "water");
		if (anime_step === 4) cube.updatePerson();
		if (anime_step === 5) cube.updateFire();
		if (anime_step === 6) cube.checkInteraction("person", "fire");
		if (anime_step === 7) cube.personWalk(1, cube.center_x, cube.center_y+1);
		if (anime_step === 8) cube.personWalk(1, cube.center_x, cube.center_y+2);
		if (anime_step === 9) cube.personWalk(-1, cube.center_x, cube.center_y+3);
		if (anime_step === 10) cube.personWalk(-1, cube.center_x, cube.center_y+2);
		if (anime_step === 11) cube.personWalk(-1, cube.center_x, cube.center_y+1);
		if (anime_step === 12) cube.walkResult();

		setMap(cube.getMap().map(row => [...row]));
	}, [anime_step]);

	useEffect(() => {
		let msg = Array.from(cube_element).join(", ");
		let msg2 = cube.describe().join(", ");
		setDisplay(msg);
		setDisplay2(msg2);
		
		if (cube_element.size == 0){
			setMap(cube.getMap().map(row => [...row]));
			checkGameOver(1);
			return;
		}

		updateState();
		manGetFire();
		checkGameOver(14);
	}, [cube_element]);

	const bgMap: { [key: number]: string } = {
		1: "/assets/land.png",
		2: "/assets/wood.png",
		3: "/assets/fire.png",
		4: "/assets/woodonfire.png",
		5: "/assets/fireonland2.png",
		6: "/assets/firedead.png",
		7: "/assets/land2.png",
		8: "/assets/water.png",
		9: "/assets/manonland.png",
		10: "/assets/manonwood.png",
		11: "/assets/manonfire.png"
	};

	return (
		<>
		<h1>迷你 Grow Cube</h1>
		<div id="cube" className="map-container">
			{cube_map.map((row, i) => (
				<div className="map-row" key={i}>
				{row.map((cell, j) => (
					<div
					key={j}
					className="map-cell"
					style={{ backgroundImage: cell === 0 ? "none" : `url(${bgMap[cell]})` }}
					/>
				))}
				</div>
			))}
			{/* <img id="person" src="./assets/man.png" /> */}
		</div>
		<div>
			<button disabled={busy} onClick={() => addElement("water")}>💧 水</button>
			<button disabled={busy} onClick={() => addElement("fire")}>🔥 火</button>
			<button disabled={busy} onClick={() => addElement("wood")}>🌳 樹</button>
			<button disabled={busy} onClick={() => addElement("person")}>👌 人</button>
			{/* <button disabled={busy} onClick={() => resetElement()}>Reset</button> */}
			{ifGameOver && ( <button onClick={resetElement}>Reset</button>)}
		</div>
		<p id="message">請選擇一個元素放到方塊上！</p>
		<p>現在使用元素有:&nbsp;{cube_display}</p>
		{cube_display2}
		
		</>
	);
}
