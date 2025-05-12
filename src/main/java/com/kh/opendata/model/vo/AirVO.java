package com.kh.opendata.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * 에어코리아 대기오염 - 시도 별 실시간 측정 조회 후 응답 데이터를 저장
 */
@NoArgsConstructor
@Data
@AllArgsConstructor
public class AirVO {

	private String stationName;		// 측정소 이름
	private String dataTime; 		// 측정 일시
	private String khaiValue;		// 통합 대기환경 수치
	
	private String pm10Value;		// 미세먼지 농도
	private String so2Value;		// 아황산가스 농도
	private String coValue;			// 일산화탄소 농도
	private String no2Value;		// 이산화질소 농도
	private String o3Value;			// 오존 농도
	
}
