package com.kh.opendata.model.vo;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class AirPollution {

	private List<AirVO> list;
	private int pageNo;				// 현재 페이지 번호
	private int totalCount;			// 전체 결과 수
	private int numOfRows;			// 한 페이지 결과 수
	private int totalPage;			// 전체 페이지 수
	// 전체 페이지의 갯수는 전체 결과 수 / 한 페이지 당 결과 수 || 나머지가 있는 경우에는 +1
	
}
