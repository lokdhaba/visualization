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
public class GEVoteShares implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2889245711274803089L;
	
	@Id
	@JsonIgnore
	private String id;
	private int year;
	private int ga_no;
	private String party;
	private int votes;
	
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
		return "GEVoteShares [id=" + id + ", year=" + year + ", party ="+ party + ", votes ="+ votes +"]";
	}
	
	
	/*
	private int year;
	private int bjp;
	private int inc;

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

	public int getBjp() {
		return bjp;
	}

	public void setBjp(int bjp) {
		this.bjp = bjp;
	}

	public int getInc() {
		return inc;
	}

	public void setInc(int inc) {
		this.inc = inc;
	}

	@Override
	public String toString() {
		return "GEVoteShares [id=" + id + ", year=" + year + ", bjp=" + bjp + ", inc=" + inc + "]";
	}
*/
	
}
