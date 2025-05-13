package com.kh.opendata.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.kh.opendata.model.vo.AirPollution;
import com.kh.opendata.model.vo.AirVO;
import com.kh.opendata.service.APIService;

// @RestController => Controller + @ResponseBody
@Controller
public class APIController {
	private APIService apiService;
	public APIController(APIService apiService) {
		this.apiService = apiService;
	}
	
	// [GET] /airPollution?location=선택된 지역정보
	@GetMapping("/airPollution")
	@ResponseBody
	public AirPollution getAirPollution(@RequestParam(value="location", defaultValue="서울") String sidoName) throws IOException {
//		System.out.println("APIController에서 지역 정보 :: " + sidoName);
		AirPollution airPollution = apiService.getAirPollution(sidoName);
		
//		stationName : 측정소명
//		dataTime	: 측정일시
//		khaiValue	: 통합대기환경수치
//		pm10Value	: 미세먼지(PM10) 농도
//		coValue		: 일산화탄소 농도
//		so2Value	: 아황산가스 농도
//		o3Value		: 오존 농도
//		no2Value	: 이산화질소 농도	
		
		
		
		return airPollution;
		
	}
	
}
