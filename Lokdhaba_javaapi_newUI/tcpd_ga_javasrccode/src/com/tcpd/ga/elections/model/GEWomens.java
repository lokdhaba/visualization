package com.tcpd.ga.elections.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author Rakesh Muppa
 * @CreatedOn - 26/05/2016
 *
 */

@Document
public class GEWomens implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8220244072134826836L;

	@Id
	@JsonIgnore
	private String id;
	private int year;
	private float women_percentage;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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
		return "AEWomens [id=" + id + ", year=" + year + ", women_percentage=" + women_percentage
				+ "]";
	}

}
