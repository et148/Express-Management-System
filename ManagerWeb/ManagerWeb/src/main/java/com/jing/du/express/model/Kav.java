package com.jing.du.express.model;

public class Kav {

	private String value;
	
	private String text;
	
	public Kav() {
		
	}
	
	public Kav(String text, String value) {
		this.text = text;
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

}
