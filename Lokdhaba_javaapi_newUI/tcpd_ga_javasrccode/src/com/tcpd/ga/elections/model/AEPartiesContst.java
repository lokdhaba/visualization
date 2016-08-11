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
public class AEPartiesContst implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5346095727125259092L;

	@Id
	@JsonIgnore
	private String id;
	@JsonIgnore	
	private String state;
	private int year;
	@JsonIgnore
	private int sa_no;
	private int parties_contested;
	private int parties_represented;

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
		return "AEPartiesContst [id=" + id + ", state=" + state + ", year=" + year + ", parties_contested="
				+ parties_contested + ", parties_represented=" + parties_represented + "]";
	}

}
