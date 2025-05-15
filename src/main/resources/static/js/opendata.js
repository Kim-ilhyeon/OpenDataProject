onload = () => {
	// 아이디 속성이 btn1인 요소가 클릭되었을 때 (이벤트 핸들러)
	const btn = document.getElementById("btn1");
	// getAirPollution();
	getAirPollutionV2();
	//btn.onclick = function() {
	//	alert("클릭됨~!");
	//}
	btn.addEventListener("click", () => {
		// alert("이렇게도 가능함!");
		// getAirPollution();
		getAirPollutionV2();
	});
}

// 대기 오염 정보 조회 (+ 페이지 정보 포함)
const getAirPollutionV2 = async (page = 1) => {
	// [GET] /airPollution/v2?location=지역정보&currPage=페이지번호

	const tbody = document.querySelector("#table tbody");
	tbody.innerHTML = "";
	
	const location = document.getElementById("location").value;

	try {

		// * 대기 오염 정보 요청 => 비동기 요청(fetch)
		const response = await fetch("/airPollution/v2?location=" + location + "&currPage=" + page)
		const data = await response.json();

		console.log(data); // => { items: [..], totalCount: 125, numOfRows: 10, pageNo: 1 }

		// * 조회 결과를 화면에 표시
		displayAirPollutionData(data.items);
		// * 페이징바 변경
		displayPagination(data.totalCount, data.pageNo, data.numOfRows);

	} catch (error) {

		console.error(error);

	}
}


// 대기 오염 정보 조회
const getAirPollution = () => {
	//[GET] /airPollution?location=선택된 지역정보

	// * 요청 전 작업 => 선택된 지역 정보 값을 가져와야 함!
	const location = document.getElementById("location").value;
	// console.log(location);

	// * 지역 정보를 담아 조회 요청 => 비동기 요청(fetch)
	fetch("/airPollution?location=" + location)
		.then(response => response.json())
		// response.text() 은 문자열, 숫자, ... 응답 데이터 추출
		// response.json() 은 객체 형태로 응답 데이터 추출
		// => .then ((response) => {return response.json(); })
		.then(data => {
			// 응답 결과 확인
			console.log("성공!!");
			console.log(data);

			/*
			const list = data.list;
			const tbody = document.querySelector("#table tbody");
			const pageLi = document.querySelector(".pagination li:first-child");
			const paging = document.getElementById("paging");

			let element = "";
			for (let i = 0; i < list.length; i++) {
				element += '<tr>'
					+ '<td>' + list[i].stationName + '</td>'
					+ '<td>' + list[i].dataTime + '</td>'
					+ '<td>' + list[i].khaiValue + '</td>'
					+ '<td>' + list[i].pm10Value + ' <b>㎍/㎥</b></td>'
					+ '<td>' + list[i].coValue + ' <b>ppm</b></td>'
					+ '<td>' + list[i].no2Value + ' <b>ppm</b></td>'
					+ '<td>' + list[i].so2Value + ' <b>ppm</b></td>'
					+ '<td>' + list[i].o3Value + ' <b>ppm</b></td>'
					+ '</tr>';
			}

			tbody.innerHTML = element;
			*/
			displayAirPollutionData(data.list);

			// let pages = "";
			// for (let i = 0; i < data.totalPage; i++) {
			// 	pages += '<li class="page-item">'
			// 			+	'<a class="page-link" href="#">' + (i+1) + '</a>'
			//			+'</li>';
			// }

			// pageLi.innerHTML += pages;
			// paging.innerHTML = pages;
			// console.log(pages);


		})
		.catch(error => {
			console.log("실패ㅠㅜ");
			console.log(error);
		})
}

const displayAirPollutionData = (data) => {
	// 전달된 데이터가 배열인지 아닌지 체크
	if (!Array.isArray(data)) {
		// console.log("data is not array.");
		console.error("data is not array.");
		return;
	}

	const list = data;
	const tbody = document.querySelector("#table tbody");

	/*
	let element = "";
	for (let i = 0; i < list.length; i++) {
		element += '<tr>'
			+ '<td>' + list[i].stationName + '</td>'
			+ '<td>' + list[i].dataTime + '</td>'
			+ '<td>' + list[i].khaiValue + '</td>'
			+ '<td>' + list[i].pm10Value + ' <b>㎍/㎥</b></td>'
			+ '<td>' + list[i].coValue + ' <b>ppm</b></td>'
			+ '<td>' + list[i].no2Value + ' <b>ppm</b></td>'
			+ '<td>' + list[i].so2Value + ' <b>ppm</b></td>'
			+ '<td>' + list[i].o3Value + ' <b>ppm</b></td>'
			+ '</tr>';
	}
	*/
	let element = "";


	for (let i = 0; i < list.length; i++) {
		const tr = document.createElement("tr");
		const td1 = document.createElement("td");
		const td2 = document.createElement("td");
		const td3 = document.createElement("td");
		const td4 = document.createElement("td");
		const td5 = document.createElement("td");
		const td6 = document.createElement("td");
		const td7 = document.createElement("td");
		const td8 = document.createElement("td");

		const stationName = document.createTextNode(list[i].stationName);
		const dataTime = document.createTextNode(list[i].dataTime);
		const khaiValue = document.createTextNode(list[i].khaiValue);
		const pm10Value = document.createTextNode(list[i].pm10Value);
		const coValue = document.createTextNode(list[i].coValue);
		const no2Value = document.createTextNode(list[i].no2Value);
		const so2Value = document.createTextNode(list[i].so2Value);
		const o3Value = document.createTextNode(list[i].o3Value);

		td1.appendChild(stationName);
		td2.appendChild(dataTime);
		td3.appendChild(khaiValue);
		td4.appendChild(pm10Value);
		td5.appendChild(coValue);
		td6.appendChild(no2Value);
		td7.appendChild(so2Value);
		td8.appendChild(o3Value);

		tr.append(td1);
		tr.append(td2);
		tr.append(td3);
		tr.append(td4);
		tr.append(td5);
		tr.append(td6);
		tr.append(td7);
		tr.append(td8);
// 자식을 하나씩 하고 


		tbody.appendChild(tr);
		
	}


	// tbody.innerHTML = tr;
	// tbody.innerHTML = element;
}


/**
 * totalCount : 전체 개수
 * pageNo 	  : 현재 페이지 번호
 * numOfRows  : 페이지 당 개수
 */
const displayPagination = (totalCount, pageNo, numOfRows) => {
	// 전체 페이지 수
	const totalPage = Math.ceil(totalCount / numOfRows);

	// 페이징 바 요소 접근
	const paginationArea = document.getElementById("pagination-area");

	let pageItems = "";
	// 이전 버튼 부분
	pageItems += `<li class="page-item ${pageNo === 1 ? "disabled" : ""}">
					<a class="page-link" href="#" onclick="getAirPollutionV2(${pageNo - 1})">Previous</a>
				  </li>`;

	// 페이지 번호 부분
	for (let i = 1; i <= totalPage; i++) {
		pageItems += `<li class="page-item" #{pageNo === i ? "active" : ""}">
					<a class="page-link" href="#" onclick="getAirPollutionV2(${i})">${i}</a>
				  </li>`;
	}

	// 다음 버튼 부분
	pageItems += `<li class="page-item ${pageNo === totalPage ? "disabled" : ""}">
	  				<a class="page-link" href="#" onclick="getAirPollutionV2(${pageNo + 1})">Next</a>
				  </li>`;

	paginationArea.innerHTML = pageItems;

}








