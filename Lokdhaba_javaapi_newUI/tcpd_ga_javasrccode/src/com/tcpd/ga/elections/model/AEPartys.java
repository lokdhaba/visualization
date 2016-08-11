package com.tcpd.ga.elections.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author Rakesh Muppa
 * @CreatedOn - 04/05/2016
 *
 */

@Document
public class AEPartys implements Serializable{

	/**
	 * 
	 */
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5319785276063082433L;
	
	@Id
	private String id;
	private String ac_name;
	private int ac_no;
	private int position;
	private String ac_type;
	private String cand1;
	private String party1;
	private String state;
	private Double vote_percent;
	private int voters;
	private int votes1;
	private int year;
	private int sa_no;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getAc_name() {
		return ac_name;
	}
	public void setAc_name(String ac_name) {
		this.ac_name = ac_name;
	}
	public int getAc_no() {
		return ac_no;
	}
	public void setAc_no(int ac_no) {
		this.ac_no = ac_no;
	}
	
	public String getAc_type() {
		return ac_type;
	}
	public void setAc_type(String ac_type) {
		this.ac_type = ac_type;
	}
	public String getCand1() {
		return cand1;
	}
	public void setCand1(String cand1) {
		this.cand1 = cand1;
	}
	
	public String getParty1() {
		return party1;
	}
	public void setParty1(String party1) {
		this.party1 = party1;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}
	
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
	public Double getVote_percent() {
		return vote_percent;
	}
	public void setVote_percent(Double vote_percent) {
		this.vote_percent = vote_percent;
	}
	public int getVoters() {
		return voters;
	}
	public void setVoters(int voters) {
		this.voters = voters;
	}
	public int getVotes1() {
		return votes1;
	}
	public void setVotes1(int votes1) {
		this.votes1 = votes1;
	}
	public int getSa_no() {
		return sa_no;
	}
	public void setSa_no(int sa_no) {
		this.sa_no = sa_no;
	}
	
	public String getYear() {
		return year + "#" +sa_no;
	}
	public void setYear(int year) {
		this.year = year;
	}
	@Override
	public String toString() {
		return "AEPartys [id=" + id + ", ac_name=" + ac_name + ", ac_no=" + ac_no + ", ac_type=" + ac_type + ", cand1="
				+ cand1 + ",  party1=" + party1 + ", position="	+ position + ", state=" + state + ", vote_percent=" + vote_percent + ", voters=" + voters + ", votes1=" + votes1 + ", year=" + year
				+ "]";
	}
	
}
