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
public class AEVoteShares implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7803469280612515756L;

	@Id
	@JsonIgnore
	private String id;
	@JsonIgnore
	private String state;
	private int year;
	private int sa_no;
	private String party;
	private int votes;
	
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
	
	public String getParty() {
		return party;
	}

	public void setParty(String party) {
		this.party = party;
	}
	public int getVotes() {
		return votes;
	}

	public void setVotes(int votes) {
		this.votes = votes;
	}
	
	@Override
	public String toString() {
		return "AEVoteShares [id=" + id + ", state=" + state + ", year=" + year + ", party ="+ party + ", votes ="+ votes +"]";
	}
	/*
	private int BJP;
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
		return BJP;
	}
	public void setBjp(int BJP) {
		this.BJP = BJP;
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
		return "AEVoteShares [id=" + id + ", state=" + state + ", year=" + year + ", BJP=" + BJP + ", jdu=" + jdu
				+ ", rjd=" + rjd + ", inc=" + inc + ", ind=" + ind + "]";
	}
	*/
	
}
