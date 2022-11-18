let problems = [], handles = [];
let pId = [], hId = [];
let pCnt = 0, hCnt = 0;
let checkbox = false, tginput = false;
document.getElementById("checkbox").checked = false;

let lastreq = new Date(0);

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function tableAddProblem(type, id, pl){
	let tblbody = document.getElementById("pbdy");
	let row = document.createElement("tr");
	let cell = document.createElement("td");
	let incell = document.createElement("i");
	incell.setAttribute('class', type ? 'fa-solid fa-horse' : 'fa-solid fa-chart-simple');
	cell.appendChild(incell);
	row.appendChild(cell);

	cell = document.createElement("td");
	incell = document.createElement("a");
	incell.textContent = id + "_" + pl;
	if(type) incell.setAttribute('href', 'https://atcoder.jp/contests/' + id + "/tasks/" + id + "_" + pl);
	else if(id >= 100000) incell.setAttribute('href', 'https://codeforces.com/gym/' + id + "/problem/" + pl);
	else incell.setAttribute('href', 'https://codeforces.com/problemset/problem/' + id + "/" + pl);
	cell.appendChild(incell);
	row.appendChild(cell);

	cell = document.createElement("td");
	incell = document.createElement("i");
	incell.setAttribute('class', 'fa-solid fa-xmark');
	incell.setAttribute('style', 'cursor: pointer');
	incell.setAttribute('onclick', 'tableDeleteProblem(' + pCnt + ')');
	cell.appendChild(incell);
	row.appendChild(cell);

	tblbody.appendChild(row);
}

function addProblem(){
	let inp = document.getElementById("prblm").value;
	if(inp.length == 0) return;
	let comp = checkbox ? inp.toLowerCase().split('_') : inp.toUpperCase().split('_');

	document.getElementById("prblm").value = "";
	pId[pId.length] = ++pCnt;
	problems[problems.length] = {id: comp[0], pl: comp[1], type: checkbox};
	// alert("New Problem: " + problems[problems.length - 1]);

	tableAddProblem(checkbox, comp[0], comp[1]);
}

function tableAddHandle(name, inp, inp2){
	let tblbody = document.getElementById("hbdy");
	let row = document.createElement("tr");
	let cell = document.createElement("td");
	let incell = document.createElement("i");
	incell.setAttribute('class', 'fa-solid fa-xmark');
	incell.setAttribute('style', 'cursor: pointer');
	incell.setAttribute('onclick', 'tableDeleteHandle(' + hCnt + ')');
	cell.appendChild(incell);
	row.appendChild(cell);

	cell = document.createElement("td");
	incell = document.createTextNode(name);
	cell.appendChild(incell);
	row.appendChild(cell);

	cell = document.createElement("td");
	incell = document.createTextNode(inp);
	cell.appendChild(incell);
	row.appendChild(cell);

	cell = document.createElement("td");
	incell = document.createTextNode(inp2);
	cell.appendChild(incell);
	row.appendChild(cell);

	tblbody.appendChild(row);
}

function addHandle(){
	let name = document.getElementById("name").value;
	let inp = document.getElementById("cfhandle").value;
	let inp2 = document.getElementById("athandle").value;
	if(inp.length == 0 && inp2.length == 0) return;

	document.getElementById("name").value = "";
	document.getElementById("cfhandle").value = "";
	document.getElementById("athandle").value = "";
	if(name.length == 0){
		if(inp.length > 0) name = inp;
		else name = inp2;
	}

	hId[hId.length] = ++hCnt;
	handles[handles.length] = {name: name, cf: inp, at: inp2};
	// alert("New Handle: " + handles[handles.length - 1]);

	tableAddHandle(name, inp, inp2);
}

function createHeader(){
	let tblbody = document.getElementById("content");
	let row = document.createElement("tr");
	let cell = document.createElement("th");
	cell.setAttribute('class', 'num');
	cell.setAttribute('style', 'text-align: right');
	let cellText = document.createTextNode("N");
	cell.appendChild(cellText);
	row.appendChild(cell);

	cell = document.createElement("th");
	cellText = document.createTextNode("Name");
	cell.appendChild(cellText);
	row.appendChild(cell);

	cell = document.createElement("th");
	cellText = document.createTextNode("S");
	cell.appendChild(cellText);
	row.appendChild(cell);

	cell = document.createElement("th");
	cellText = document.createTextNode("P");
	cell.appendChild(cellText);
	row.appendChild(cell);

	for(let i = 0; i < problems.length; i++){
		cell = document.createElement("th");
		link = document.createElement("a");
		link.textContent = problems[i].id + "_" + problems[i].pl;
		if(problems[i].type == true) link.setAttribute('href', 'https://atcoder.jp/contests/' + problems[i].id + "/tasks/" + problems[i].id + "_" + problems[i].pl);
		else if(problems[i].id >= 100000) link.setAttribute('href', 'https://codeforces.com/gym/' + problems[i].id + "/problem/" + problems[i].pl);
		else link.setAttribute('href', 'https://codeforces.com/problemset/problem/' + problems[i].id + "/" + problems[i].pl);
		cell.appendChild(link);
		row.appendChild(cell);
	}
	tblbody.appendChild(row);
}

function toRes(a){
	if(a < 0) return String(a);
	if(a == 0) return "";
	if(a == 1) return "+";
	return "+" + String(a - 1);
}

function setInfo(message){
	document.getElementById("info").style.animation = '';
	document.getElementById("info").innerText = message;
}

function hideInfo(){
	document.getElementById("info").style.animation = 'fading 2s forwards';
}

function setError(message){
	document.getElementById("error").style.animation = '';
	document.getElementById("error").innerText = message;
	document.getElementById("error").style.animation = 'fading 5s forwards';
}

async function getRes(i, handle){
	// console.log(handle.name);
	
	let obj = [];
	let result = {
		id: i,
		solved: 0,
		penalty: 0,
		error: [false, false],
		status: Array(problems.length).fill(0)
	};

	// Codeforces
	if(handle.cf.length > 0){
		await fetch('https://codeforces.com/api/user.status?language=en&handle=' + handle.cf).then((response) => {
			if(response.status >= 200 && response.status <= 299) return response.text();
			else {
				setError("Codeforces request failed (" + (i + 1) + ")");
				throw new Error("Codeforces request failed: " + 'https://codeforces.com/api/user.status?language=en&handle=' + handle.cf);
			}
		})
		.then((jsonResponse) => {
			obj = JSON.parse(jsonResponse);
			if(obj.status != "OK") {
				setError(obj.comment);
				throw new Error(obj.comment);
			}

			for(let i = obj.result.length - 1; i >= 0; i--){
				for(let j = 0; j < problems.length; j++){
					if(problems[j].type != false) continue;
					if(obj.result[i].problem.contestId == problems[j].id && obj.result[i].problem.index == problems[j].pl && result.status[j] <= 0){
						if(obj.result[i].verdict == "OK") result.penalty -= result.status[j], result.status[j] = -result.status[j] + 1, result.solved++;
						else result.status[j]--;
					}
				}
			}
		})
		.catch((error) => {
			result.error[0] = true;
			console.log(error);
		});
	}

	// AtCoder
	if(handle.at.length == 0) return result;
	let time = 0;
	do {
		await sleep(Math.max(0, 1200 - (Date.now() - lastreq)));
		lastreq = Date.now();
		await fetch('https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=' + handle.at + '&from_second=' + time).then((response) => {
			if(response.status >= 200 && response.status <= 299) return response.text();
			else {
				setError("AtCoder request failed (" + (i + 1) + ")");
				throw new Error("AtCoder request failed: " + 'https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=' + handle.at + '&from_second=' + time);
			}
		})
		.then((jsonResponse) => {
			obj = JSON.parse(jsonResponse);
			for(let i = 0; i < obj.length; i++){
				for(let j = 0; j < problems.length; j++){
					if(problems[j].type != true) continue;
					if(obj[i].problem_id == problems[j].id + "_" + problems[j].pl && result.status[j] <= 0){
						if(obj[i].result == "AC") result.penalty -= result.status[j], result.status[j] = -result.status[j] + 1, result.solved++;
						else result.status[j]--;
					}
				}
			}
			if(obj.length > 0) time = obj[obj.length - 1].epoch_second + 1;
			else if(time == 0) result.error[1] = true;
		})
		.catch((error) => {
			obj = [];
			result.error[1] = true;
			console.log(error);
		});
	} while(obj.length == 500);

	return result;
}

async function main(){
	document.getElementById("upd").disabled = true;
	document.getElementById("upd").style.cursor = 'not-allowed';

	if(tginput){
		document.getElementById("general").style.display = "block";
		document.getElementById("edit").style.display = "none";
		tginput = !tginput;
	}

	let stats = {
		solved: Array(problems.length).fill(0),
		tried: Array(problems.length).fill(0)
	};

	// console.log(handles);
	// console.log(problems);
	handles.sort();
	
	let results = [];
	const tblbody = document.getElementById("content");
	tblbody.innerHTML = "";
	createHeader();

	for(let i = 0; i < handles.length; i++){
		setInfo(handles[i].name + " (" + (i + 1) + "/" + handles.length + ")");
		results[results.length] = await getRes(i, handles[i]);
	}
	
	results.sort(function(a, b){
		if(a.solved > b.solved) return -1;
		if(a.solved == b.solved){
			if(a.penalty < b.penalty) return -1;
			if(a.penalty == b.penalty) return 0;
			return 1;
		}
		return 1;
	});

	// console.log(results);
	let prev = -1, clr = false;

	for(let i = 0; i < results.length; i++){
		let row = document.createElement("tr");
		if(results[i].solved != prev) {
			prev = results[i].solved;
			clr = !clr;
		}
		if(clr) row.setAttribute('style', 'background-color: var(--clr1)');
		let cell = document.createElement("td");
		cell.setAttribute('class', 'num');
		let cellText = document.createTextNode(i + 1);
		cell.appendChild(cellText);
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.setAttribute('class', 'tname');
		cell.innerHTML = handles[results[i].id].name + 
						(results[i].error[0] ? " <span style=\"color: var(--triedclr)\">CF</span>" : "") + 
						(results[i].error[1] ? " <span style=\"color: var(--triedclr)\">AT</span>" : "");
		row.appendChild(cell);

		cell = document.createElement("td");
		cellText = document.createTextNode(results[i].solved);
		cell.appendChild(cellText);
		row.appendChild(cell);

		cell = document.createElement("td");
		cellText = document.createTextNode(results[i].penalty);
		cell.appendChild(cellText);
		row.appendChild(cell);

		for(let j = 0; j < results[i].status.length; j++){
			cell = document.createElement("td");
			res = document.createTextNode(toRes(results[i].status[j]));
			if(results[i].status[j] < 0) cell.setAttribute('class', 'tried'), stats.tried[j]++;
			else if(results[i].status[j] > 0) cell.setAttribute('class', 'solved'), stats.tried[j]++, stats.solved[j]++;
			cell.appendChild(res);
			row.appendChild(cell);
		}
		tblbody.appendChild(row);
	}

	let row = document.createElement("tr");
	row.setAttribute('style', 'background-color: var(--backgnd)');
	row.setAttribute('class', 'stats');
	let cell = document.createElement("td");
	cell.setAttribute('class', 'num');
	row.appendChild(cell);

	cell = document.createElement("td");
	cell.innerHTML = "<span style=\"color: var(--solvedclr)\">solved</span>/tried";
	row.appendChild(cell);

	cell = document.createElement("td");
	row.appendChild(cell);

	cell = document.createElement("td");
	row.appendChild(cell);

	for(let j = 0; j < stats.solved.length; j++){
		cell = document.createElement("td");
		cell.setAttribute('class', 'solved');
		cell.innerHTML = stats.solved[j] + "<span style=\"color: var(--clr)\">/" + stats.tried[j] + "</span>";
		cell.appendChild(res);
		row.appendChild(cell);
	}
	tblbody.appendChild(row);

	hideInfo();
	document.getElementById("upd").disabled = false;
	document.getElementById("upd").style.cursor = 'pointer';
}

///

function importJSON(){
	let imported = prompt("Insert JSON text here:", "");
	if(imported == null || imported.length == 0) return;

	let obj = JSON.parse(imported);
	for(let i = 0; i < obj.problems.length; i++){
		pId[pId.length] = ++pCnt;
		problems[problems.length] = obj.problems[i];
		tableAddProblem(problems[problems.length - 1].type, problems[problems.length - 1].id, problems[problems.length - 1].pl);
	}
	for(let i = 0; i < obj.handles.length; i++){
		hId[hId.length] = ++hCnt;
		handles[handles.length] = obj.handles[i];
		tableAddHandle(handles[handles.length - 1].name, handles[handles.length - 1].cf, handles[handles.length - 1].at);
	}
	// console.log(problems, handles);
}

function exportJSON(){
	navigator.clipboard.writeText("{\"problems\": " + JSON.stringify(problems) + ", \"handles\": " + JSON.stringify(handles) + "}");
	alert("Copied JSON text to the clipboard");
}

function togglePlaceholder(){
	document.getElementById("prblm").setAttribute('placeholder', checkbox ? '1405_E' : 'abc276_e');
	checkbox = !checkbox;
}

function toggleInput(){
	if(tginput){
		document.getElementById("general").style.display = "block";
		document.getElementById("edit").style.display = "none";
	}
	else {
		document.getElementById("general").style.display = "none";
		document.getElementById("edit").style.display = "block";
	}
	tginput = !tginput;
}

function tableDeleteProblem(id){
	for(let i = 0; i < pId.length; i++){
		if(pId[i] == id){
			pId.splice(i, 1);
			problems.splice(i, 1);
			document.getElementById("pbdy").childNodes[i + 3].remove();
			break;
		}
	}
}

function tableDeleteHandle(id){
	for(let i = 0; i < hId.length; i++){
		if(hId[i] == id){
			hId.splice(i, 1);
			handles.splice(i, 1);
			document.getElementById("hbdy").childNodes[i + 3].remove();
			break;
		}
	}
}
