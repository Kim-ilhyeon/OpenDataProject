package com.kh.opendata.model.dto;

import java.util.List;

import com.kh.opendata.model.vo.AirVO;

import lombok.Data;

@Data
public class AirResponse {

	private List<AirVO> items;	// 조회결과 목록
	private int numOfRows;		// 한 페이지 당 결과 수
	private int pageNo;			// 페이지 번호 (현재 페이지)
	private int totalCount;		// 전체 결과 수 (총 개수)
	
}
