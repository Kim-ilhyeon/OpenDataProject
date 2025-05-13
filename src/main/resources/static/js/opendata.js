onload = () => {
	// 아이디 속성이 btn1인 요소가 클릭되었을 때 (이벤트 핸들러)
	const btn = document.getElementById("btn1");

		getAirPollution();
	//btn.onclick = function() {
	//	alert("클릭됨~!");
	//}
	btn.addEventListener("click", () => {
		// alert("이렇게도 가능함!");
		getAirPollution();
	});


}


// 대기 오염 정보 조회
const getAirPollution = () => {
	//[GET] /airPollution?location=선택된 지역정보

	// * 요청 전 작업 => 선택된 지역 정보 값을 가져와야 함!
	const location = document.getElementById("location").value;
	// console.log(location);
	
	// * 지역 정보를 담아 조회 요청 => 비동기 요청(fetch)
	fetch("/airPollution?location=" + location)
	.then(response=>response.json())
	// response.text() 은 문자열, 숫자, ... 응답 데이터 추출
	// response.json() 은 객체 형태로 응답 데이터 추출
	// => .then ((response) => {return response.json(); })
	.then(data => {
		// 응답 결과 확인
		console.log("성공!!");
		console.log(data);
		
		const list = data.list;
		const tbody = document.querySelector("#table tbody");
		const pageLi = document.querySelector(".pagination li:first-child");
		const paging = document.getElementById("paging");
		
		let element = "";
		for (let i = 0; i < list.length ; i++) {
		 		element += '<tr>'
						+	'<td>' + list[i].stationName + '</td>'
						+	'<td>' + list[i].dataTime + '</td>'
						+	'<td>' + list[i].khaiValue + '</td>'
						+	'<td>' + list[i].pm10Value + ' <b>㎍/㎥</b></td>'
						+	'<td>' + list[i].coValue + ' <b>ppm</b></td>'
						+	'<td>' + list[i].no2Value + ' <b>ppm</b></td>'
						+	'<td>' + list[i].so2Value + ' <b>ppm</b></td>'
						+	'<td>' + list[i].o3Value + ' <b>ppm</b></td>'
						+  '</tr>';
		}
			
			tbody.innerHTML = element;
			
		let pages = "";
		for (let i = 0; i < data.totalPage; i++) {
			pages += '<li class="page-item">'
					+	'<a class="page-link" href="#">' + (i+1) + '</a>'
					+'</li>';
		}
			// pageLi.innerHTML += pages;
			paging.innerHTML = pages;
			console.log(pages);
			
		
	})
	.catch(error => {
		console.log("실패ㅠㅜ");
		console.log(error);
	})
}










