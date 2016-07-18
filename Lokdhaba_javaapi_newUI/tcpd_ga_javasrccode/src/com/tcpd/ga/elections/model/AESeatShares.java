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
public class AESeatShares implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6940289859282025000L;

	@Id
	@JsonIgnore
	private String id;
	@JsonIgnore
	private String state;
	private int year;
	private int bjp;
	private int jdu;
	private int rjd;
	private int inc;
	private int ind;

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

	public int getBjp() {
		return bjp;
	}

	public void setBjp(int bjp) {
		this.bjp = bjp;
	}

	public int getJdu() {
		return jdu;
	}

	public void setJdu(int jdu) {
		this.jdu = jdu;
	}

	public int getRjd() {
		return rjd;
	}

	public void setRjd(int rjd) {
		this.rjd = rjd;
	}

	public int getInc() {
		return inc;
	}

	public void setInc(int inc) {
		this.inc = inc;
	}

	public int getInd() {
		return ind;
	}

	public void setInd(int ind) {
		this.ind = ind;
	}

	@Override
	public String toString() {
		return "AESeatShares [id=" + id + ", state=" + state + ", year=" + year + ", bjp=" + bjp + ", jdu=" + jdu
				+ ", rjd=" + rjd + ", inc=" + inc + ", ind=" + ind + "]";
	}

}
