package com.jing.du.express.model;

public class PageModel {

	private Integer sEcho;
	
	private Integer iDisplayStart;
	
	private Integer iDisplayLength;

	public Integer getsEcho() {
		return sEcho;
	}

	public void setsEcho(Integer sEcho) {
		this.sEcho = sEcho;
	}

	public Integer getiDisplayStart() {
		return iDisplayStart;
	}

	public void setiDisplayStart(Integer iDisplayStart) {
		this.iDisplayStart = iDisplayStart;
	}

	public Integer getiDisplayLength() {
		return iDisplayLength;
	}

	public void setiDisplayLength(Integer iDisplayLength) {
		this.iDisplayLength = iDisplayLength;
	}
	
	public Integer getPage() {
		return this.iDisplayStart / iDisplayLength;
	}
	
	public Integer getSize() {
		return iDisplayLength;
	}
}
