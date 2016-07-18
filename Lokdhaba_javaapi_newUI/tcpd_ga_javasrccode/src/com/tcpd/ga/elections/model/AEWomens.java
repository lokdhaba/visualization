package com.tcpd.ga.elections.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author Rakesh Muppa
 * @CreatedOn - 04/05/2016
 *
 */

@Document
public class AEWomens implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1641367311196020459L;

	@Id
	@JsonIgnore
	private String id;
	@JsonIgnore
	private String state;
	private int year;
	private float women_percentage;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public float getWomen_percentage() {
		return women_percentage;
	}

	public void setWomen_percentage(float women_percentage) {
		this.women_percentage = women_percentage;
	}

	@Override
	public String toString() {
		return "AEWomens [id=" + id + ", state=" + state + ", year=" + year + ", women_percentage=" + women_percentage
				+ "]";
	}

}
