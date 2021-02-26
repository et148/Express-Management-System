package com.jing.du.express.model;

import java.util.List;

public class DataTable {
	private int sEcho;
	private long iTotalRecords;
	private long iTotalDisplayRecords;
	private Object[] aaData;

	public DataTable(int sEcho, long iTotalRecords, List<? extends Object> data) {
		this.sEcho = sEcho;
		this.iTotalRecords = iTotalRecords;
		this.iTotalDisplayRecords = iTotalRecords;
		aaData = new Object[data.size()];
		data.toArray(aaData);
	}

	public int getsEcho() {
		return sEcho;
	}

	public void setsEcho(int sEcho) {
		this.sEcho = sEcho;
	}

	public long getiTotalRecords() {
		return iTotalRecords;
	}

	public void setiTotalRecords(long iTotalRecords) {
		this.iTotalRecords = iTotalRecords;
	}

	public long getiTotalDisplayRecords() {
		return iTotalDisplayRecords;
	}

	public void setiTotalDisplayRecords(long iTotalDisplayRecords) {
		this.iTotalDisplayRecords = iTotalDisplayRecords;
	}

	public Object[] getAaData() {
		return aaData;
	}

	public void setAaData(Object[] aaData) {
		this.aaData = aaData;
	}

}
