package com.kh.opendata.run;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.kh.opendata.model.vo.AirVO;

public class AirPollutionRun {

	private static final String SERVICE_KEY = "JppeOBq10JWncJXZH7dJfwnuKFmazs3GhTZDLKBp3Ljc8S4p4EyhptjHb2I4g3jLCVrl2s%2FCZNad35jsNDU84g%3D%3D";
	
	public static void main(String[] args) throws IOException {
		// * 요청 주소(URL)
		String url = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";
		
		// * 전달 데이터 (request parameter)
		// url += "?serviceKey=서비스키";
		// => 서비스 키를 제대로 보내지 않을 경우 --> SERVICE_KEY_IS_NOT_REGISTERED_ERROR 오류가 응답됨!!
		url += "?servicekey=" + SERVICE_KEY;
		
		// 시도 이름(전국, 서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주, 세종)
		// url += "&sidoName=서울";
		// => 한글이 포함된 경우 인코딩 처리를 해줘야 함! (java.net.URLEncoder)
		url += "&sidoName=" + URLEncoder.encode("서울", "UTF-8");
		
//		url += "&returnType=xml";
		url += "&returnType=json";
		
		// System.out.println(url);
		
		// (1) 요청 주소와 함께 URL 객체 생성 (java.net.URL)
		URL requestUrl = new URL(url);
		
		// (2) URL 객체 통해서 HttpURLConnection 객체 생성
		HttpURLConnection urlConn = (HttpURLConnection)requestUrl.openConnection();
		
		// (3) 요청 시 필요한 헤더 설정
		urlConn.setRequestMethod("GET");
		
		// (4) 공공데이터 API 서버로 요청을 보낸 후
		//			입력 스트림을 통해서 응답 데이터 읽기
		BufferedReader buf = new BufferedReader(
								new InputStreamReader(
											urlConn.getInputStream()
										)
									);
		
		String line;
		String responseText = "";
		while((line = buf.readLine()) != null) {
			
			responseText += line;
			
//			System.out.println(line);
			
		}
		
		// (5) 사용한 자원 반납
		buf.close();
		urlConn.disconnect();
		
		// * 응답 데이터 확인
//		System.out.println(responseText);
		
		// ---------------------------------------------
		
		// JsonObject, JsonArray, JsonElement 를 이용해서 파싱 가능
		// => Gson 라이브러리를 사용하여 원하는 데이터를 추출
		
		// * JsonParser 를 사용하려 문자열 형태의 데이터를 JsonObject 변환
		JsonObject totalObj = JsonParser.parseString(responseText)
										.getAsJsonObject();
		// * 응답 데이터에서 "response" 키에 해당하는 데이터 추출
		JsonObject responseObj = totalObj.getAsJsonObject("response");
		
//		System.out.println(responseObj);
		
		// * "body" 키에 해당하는 데이터 추출
		JsonObject bodyObj = responseObj.getAsJsonObject("body");
		
//		System.out.println(bodyObj);
		// { "totalCount": 40, "items": [...], "pageNo": 1, "numOgRows": 10 }
		int totalCount = bodyObj.get("totalCount").getAsInt();
//		System.out.println(totalCount);
		JsonArray items = bodyObj.getAsJsonArray("items");
//		System.out.println(items);
		
		ArrayList<AirVO> list = new ArrayList<>();
		
		// * JsonArray --> ArrayList
		for (int i = 0; i < items.size(); i++) {
			JsonObject item = items.get(i).getAsJsonObject();
//			System.out.println(item);
			
			AirVO air = new AirVO();
			
			air.setStationName( item.get("stationName").getAsString() );
			air.setDataTime( item.get("dataTime").getAsString() );
			air.setKhaiValue( item.get("khaiValue").getAsString() );
			air.setPm10Value( item.get("pm10Value").getAsString() );
			air.setSo2Value( item.get("so2Value").getAsString() );
			air.setCoValue( item.get("coValue").getAsString() );
			air.setNo2Value( item.get("no2Value").getAsString() );
			air.setO3Value( item.get("o3Value").getAsString() );
			
//			System.out.println(air);

			list.add(air);
			
		}
		
		System.out.println(list);
		
		System.out.println("=======구분선=======");
		for (AirVO air : list) {
			System.out.println(air);
		}
		

	}

}
