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
public class GEPartiesContsts implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1004999832511420479L;

	@Id
	@JsonIgnore
	private String id;
	private int year;
	@JsonIgnore
	private int ga_no;
	private int parties_contested;
	private int parties_represented;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getGa_no() {
		return ga_no;
	}
	public void setGa_no(int ga_no) {
		this.ga_no = ga_no;
	}
	
	public String getYear() {
		return year + "#" + ga_no;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getParties_contested() {
		return parties_contested;
	}

	public void setParties_contested(int parties_contested) {
		this.parties_contested = parties_contested;
	}

	public int getParties_represented() {
		return parties_represented;
	}

	public void setParties_represented(int parties_represented) {
		this.parties_represented = parties_represented;
	}

	@Override
	public String toString() {
		return "GEPartiesContsts [id=" + id + ", year=" + year + ", parties_contested=" + parties_contested
				+ ", parties_represented=" + parties_represented + "]";
	}

	
}
