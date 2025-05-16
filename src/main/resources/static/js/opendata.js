onload = () => {
	// 아이디 속성이 btn1인 요소가 클릭되었을 때 (이벤트 핸들러)
	const btn = document.getElementById("btn1");
	// getAirPollution();
	// getAirPollutionV2();
	getAirPollutionV3();
	//btn.onclick = function() {
	//	alert("클릭됨~!");
	//}
	btn.addEventListener("click", () => {
		// alert("이렇게도 가능함!");
		// getAirPollution();
		// getAirPollutionV2();
		getAirPollutionV3();
	});
}

// 프론트(브라우저)에서 직접 공공데이터 서버로 요청 ( 요청주소(URL), 요청방식(GET), 요청 파라미터(서비스키, 시도명) )
const getAirPollutionV3 = () => {
	const location = document.getElementById("location");

	// * 요청 파라미터
	const serviceKey = "JppeOBq10JWncJXZH7dJfwnuKFmazs3GhTZDLKBp3Ljc8S4p4EyhptjHb2I4g3jLCVrl2s%2FCZNad35jsNDU84g%3D%3D";
	const sidoName = location.value;

	// * 요청 주소
	const url = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty"
		+ "?serviceKey=" + serviceKey
		+ "&sidoName=" + encodeURI(sidoName)
		// +"&returnType=json";
		+ "&returnType=xml";
	// * encodeURI(text) : {text} 문자를 UTF-8로 인코딩 처리
	// * decodeURI(text) : encodeURI처리된 {text} 의 원본으로 디코딩 처리

	// * 요청 방식 (GET) -> fetch/ajax/axious 사용 시 설정 또를 확인
	fetch(url)
		.then(response => response.text())
		.then(data => {
			console.log(data);
			try {
				/*
				// * JSON 타입으로 파싱 처리
				data = JSON.parse(data);
				console.log(data);

				const bodyData = data.response.body;
				console.log(bodyData);

				// 표시할 항목 목록을 전달
				const displayList = ["stationName", "dataTime", "khaiValue", "pm10Value"
					, "so2Value", "coValue", "no2Value", "o3Value"];

				displayAirPollutionData(bodyData.items, displayList);
				displayPagination(bodyData.totalCount, bodyData.pageNo, bodyData.numOfRows)
				*/

				// * XML 타입인 경우 처리
				// * DOMParser 객체를 사용하여 파싱처리
				const xmlParser = new DOMParser();
				data = xmlParser.parseFromString(data, "text/xml");
				console.log(data);

				displayAirPollutionXmlData(data);
				
				// 페이징처리: TODO

			} catch (e) {
				console.log(e);
			}
		})
		.catch(error => {
			console.error(error);
		})

}

/** 대기오염 정보를 화면에 표시 (xml형식)
 * data : XML 형식
 */
const displayAirPollutionXmlData = (data) => {
	// data => document 문서형태임!!

	// item 태그에 해당하는 부분만 추출
	const itemArr = data.getElementsByTagName("item");
	// => HTML 요소에 접근할 때와 마찬가지로 XML도 객체 형태로 저장되어 있음!!

	let tbodyText = "";
	for (const item of itemArr) {
		tbodyText += `
					<tr>
						<td>${item.querySelector('stationName').textContent}</td>
						<td>${item.querySelector('dataTime').textContent}</td>
						<td>${item.querySelector('khaiValue').textContent}</td>
						<td>${item.querySelector('pm10Value').textContent}</td>
						<td>${item.querySelector('coValue').textContent}</td>
						<td>${item.querySelector('no2Value').textContent}</td>
						<td>${item.querySelector('so2Value').textContent}</td>
						<td>${item.querySelector('o3Value').textContent}</td>
					</tr>
		`;
	}
	
	document.querySelector("#table tbody").innerHTML = tbodyText;
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

const displayAirPollutionData = (data, keyList) => {
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

	// 초기화 할 때에도 innerHTML대신에 .textContent = ""; 사용 권장!!

	for (let i = 0; i < list.length; i++) {

		const keys = keyList || Object.keys(item);

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
	// 반복문 겹쳐서도 사용 가능!! => 노션 내용 확인해서 작성해보기


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

	// paginationArea.innerHTML = "";
	// let pageItems = "";
	paginationArea.textContent = "";
	/*
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

	// paginationArea.innerHTML = pageItems;
	*/

	// * li 요소 생성 함수 *
	/**
	 * pageNo : 페이지 번호
	 * text : 표시할 텍스트
	 * liOptionalClass : 추가적으로 설정할 클래스명
	 */
	const createPageNum = (pageNo, text, liOptionalClass = "") => {
		// li 노드 생성
		const liElement = document.createElement("li");
		liElement.classList.add("page-item");

		if (liOptionalClass !== "") {
			liElement.classList.add(liOptionalClass);
		}

		// a 노드 생성
		const aElement = document.createElement("a");
		aElement.classList.add("page-link");
		aElement.setAttribute("href", "#");
		aElement.addEventListener('click', () => {
			getAirPollutionV2(pageNo);
		});

		aElement.textContent = text;
		liElement.appendChild(aElement);
		return liElement;
	}

	// 이전 버튼 부분
	const prevPageItem = createPageNum(pageNo - 1, "Previous", pageNo === 1 ? "disabled" : "");
	paginationArea.appendChild(prevPageItem);

	// 페이지 번호 버튼 부분
	for (let i = 1; i <= totalPage; i++) {
		const pageNum = createPageNum(i, i, pageNo === i ? "active" : "");
		paginationArea.appendChild(pageNum);
	}

	// 다음 버튼 부분
	const nextPageItem = createPageNum(pageNo + 1, "Next", pageNo === totalPage ? "disabled" : "");
	paginationArea.appendChild(nextPageItem);



	/*
	// 이전 버튼 부분
	const liElement = document.createElement("li");
	liElement.classList.add("page-item");
	if (pageNo === 1) {
		liElement.classList.add("disabled");
	}

	const aElement = document.createElement("a");
	aElement.classList.add("page-link");
	aElement.setAttribute("href", "#");
	aElement.addEventListener('click', () => {
		getAirPollutionV2(pageNo - 1);
	});
	
	aElement.textNode("Previous");
	liElement.appendChild(aElement);
	paginationArea.appendChild(liElement);
	*/

}









