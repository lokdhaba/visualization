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
public class AEVotrTurnouts implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4284381178222057660L;

	@Id
	@JsonIgnore
	private String id;
	@JsonIgnore
	private String state;
	private int year;
	@JsonIgnore
	private int sa_no;
	private int male;
	private int female;
	private int total;

	
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

	public int getSa_no() {
		return sa_no;
	}
	public void setSa_no(int sa_no) {
		this.sa_no = sa_no;
	}
	
	public String getYear() {
		return year + "#" + sa_no;
	}
	public void setYear(int year) {
		this.year = year;
	}

	public int getMale() {
		return male;
	}

	public void setMale(int male) {
		this.male = male;
	}

	public int getFemale() {
		return female;
	}

	public void setFemale(int female) {
		this.female = female;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	@Override
	public String toString() {
		return "AEVotrTurnouts [id=" + id + ", state=" + state + ", year=" + year + ", male=" + male + ", female="
				+ female + ", total=" + total + "]";
	}


	
}
