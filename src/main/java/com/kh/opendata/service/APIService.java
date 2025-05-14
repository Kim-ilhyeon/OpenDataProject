package com.kh.opendata.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.kh.opendata.model.vo.AirPollution;
import com.kh.opendata.model.vo.AirVO;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class APIService {

	@Value("${opendataPreoject}")
	
	
	private static final String SERVICE_KEY = "JppeOBq10JWncJXZH7dJfwnuKFmazs3GhTZDLKBp3Ljc8S4p4EyhptjHb2I4g3jLCVrl2s%2FCZNad35jsNDU84g%3D%3D";

	/**
	 * 공공 테이터 API를 사용하여 대기오염 정보 조회
	 * @param sidoName 지역명
	 * @return 대기오염 조회 결과
	 * @throws IOException 
	 */
	public AirPollution getAirPollution(String sidoName) throws IOException {
		String url = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";
		
		url += "?servicekey=" + SERVICE_KEY;
		
		url += "&sidoName=" + URLEncoder.encode(sidoName, "UTF-8");
		
		url += "&returnType=json";
		
		URL requestUrl = new URL(url);
		
		HttpURLConnection urlConn = (HttpURLConnection)requestUrl.openConnection();
		
		/*
		// * 통신 성공 여부 체크
		if (urlConn.getResponseCode() == HttpServletResponse.SC_OK) {
			// * 응답 데이터 읽어오기
			BufferedReader buf = new BufferedReader(
							new InputStreamReader(urlConn.getInputStream()));
			
			
		} else {
			buf = new BufferedReader(new InputStramReader(urlConn.getErrorStream()));
		}
		*/
		
		urlConn.setRequestMethod("GET");
		
		BufferedReader buf = new BufferedReader(
									new InputStreamReader(
												urlConn.getInputStream()
											)
								);
		
		String line;
		String responseText = "";
		while ( (line = buf.readLine()) != null) {
			responseText += line;
			
//			System.out.println(line);
		}
		
		buf.close();
		urlConn.disconnect();
		
		JsonObject totalObj = JsonParser.parseString(responseText)
											.getAsJsonObject();
		JsonObject responseObj = totalObj.getAsJsonObject("response");
//		System.out.println(responseObj);
		
		JsonObject bodyObj = responseObj.getAsJsonObject("body");
		System.out.println("bodyObj :: " + bodyObj);
		
		int totalCount = bodyObj.get("totalCount").getAsInt();
//		System.out.println(totalCount);
		System.out.println("totalCount :: " + totalCount);
		int pageNo = bodyObj.get("pageNo").getAsInt();
		System.out.println("pageNo :: " + pageNo);
		int numOfRows = bodyObj.get("numOfRows").getAsInt();
		System.out.println("numOfRows :: " + numOfRows);
		
		int totalPage = totalCount / numOfRows;
		int remain = totalCount % numOfRows;
		if (remain != 0) {
			totalPage += 1;
		}
		System.out.println("totalPage수 :: " + totalPage);
		
		JsonArray items = bodyObj.getAsJsonArray("items");
//		System.out.println(items);
		
		ArrayList<AirVO> list = new ArrayList<>();
		
		for (int i = 0; i< items.size(); i++) {
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
		
//		System.out.println(list);

		AirPollution airPollution = new AirPollution();
		airPollution.setList(list);
		airPollution.setPageNo(pageNo);
		airPollution.setTotalCount(totalCount);
		airPollution.setNumOfRows(numOfRows);
		airPollution.setTotalPage(totalPage);
		
		System.out.println(airPollution);
		
		
		return airPollution;
	}

}
